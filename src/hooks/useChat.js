import { useState, useCallback, useEffect, useRef } from 'react';
import { sendMessage, sendMessageStream } from '../services/gemini';
import { generateId } from '../utils/helpers';

const STORAGE_KEY = 'scratchbot_chat_history';

function loadChats() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

const PAUSE_AFTER = {
  '.': 180,
  '?': 180,
  '!': 180,
  ',': 100,
  '\n': 120,
  '#': 200,
  '`': 150,
};

function simulateTyping(fullText, onToken, signal) {
  return new Promise((resolve) => {
    const words = fullText.split(/(?<=\s)/);
    let i = 0;

    function pushNext() {
      if (signal.aborted) { resolve(); return; }
      if (i >= words.length) { resolve(); return; }

      const chunk = words[i];
      const lastChar = chunk.trim().slice(-1);
      const baseDelay = 20 + Math.random() * 25;
      const extra = PAUSE_AFTER[lastChar] || PAUSE_AFTER[chunk[0]] || 0;
      const delay = baseDelay + extra;

      onToken(chunk);
      i++;
      setTimeout(pushNext, delay);
    }

    pushNext();
  });
}

export function useChat() {
  const [chats, setChats] = useState(() => loadChats());
  const [activeChatId, setActiveChatId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);
  const [streamingMessage, setStreamingMessage] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
  }, [chats]);

  const activeChat = chats.find((c) => c.id === activeChatId) || null;

  const createChat = useCallback(() => {
    const id = generateId();
    const newChat = { id, title: 'New Chat', messages: [], createdAt: new Date().toISOString() };
    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(id);
    setError(null);
    return id;
  }, []);

  const deleteChat = useCallback((id) => {
    setChats((prev) => prev.filter((c) => c.id !== id));
    setActiveChatId((prev) => (prev === id ? null : prev));
  }, []);

  const clearActiveChat = useCallback(() => {
    setChats((prev) => prev.map((c) => c.id === activeChatId ? { ...c, messages: [], title: 'New Chat' } : c));
    setError(null);
  }, [activeChatId]);

  const addMessage = useCallback((role, text) => {
    if (!activeChatId) return;
    const message = { id: generateId(), role, text, timestamp: new Date().toISOString() };
    setChats((prev) =>
      prev.map((c) => {
        if (c.id !== activeChatId) return c;
        const messages = [...c.messages, message];
        const title = c.title === 'New Chat' && role === 'user' ? text.slice(0, 60) + (text.length > 60 ? '...' : '') : c.title;
        return { ...c, messages, title };
      })
    );
    return message.id;
  }, [activeChatId]);

  const sendUserMessage = useCallback(async (text) => {
    if (!activeChatId) return;
    addMessage('user', text);
    setLoading(true);
    setError(null);
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    const chat = chats.find((c) => c.id === activeChatId);
    const history = chat ? chat.messages : [];

    const assistantMsgId = generateId();
    setStreamingMessage(assistantMsgId);

    let accumulated = '';

    const onToken = (token) => {
      accumulated += token;
      setChats((prev) =>
        prev.map((c) => {
          if (c.id !== activeChatId) return c;
          const existing = c.messages.find((m) => m.id === assistantMsgId);
          if (existing) {
            return { ...c, messages: c.messages.map((m) => m.id === assistantMsgId ? { ...m, text: accumulated } : m) };
          }
          return { ...c, messages: [...c.messages, { id: assistantMsgId, role: 'assistant', text: accumulated, timestamp: new Date().toISOString() }] };
        })
      );
    };

    try {
      await sendMessageStream([...history, { role: 'user', text }], signal, onToken);
    } catch (err) {
      if (signal.aborted) return;
      if (accumulated.length === 0) {
        try {
          const reply = await sendMessage([...history, { role: 'user', text }], signal);
          if (!signal.aborted) await simulateTyping(reply, onToken, signal);
        } catch (err2) {
          if (!signal.aborted) setError(err2.message);
        }
      }
    } finally {
      if (!signal.aborted) {
        setLoading(false);
        setStreamingMessage(null);
        const chatState = chats.find((c) => c.id === activeChatId);
        const msgExists = chatState?.messages?.some((m) => m.id === assistantMsgId);
        if (!msgExists && accumulated) {
          addMessage('assistant', accumulated);
        }
      } else {
        setStreamingMessage(null);
        setLoading(false);
      }
    }
  }, [activeChatId, chats, addMessage]);

  const stopGeneration = useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  const retry = useCallback(() => {
    if (!activeChatId || !error) return;
    const chat = chats.find((c) => c.id === activeChatId);
    if (!chat || chat.messages.length === 0) return;
    const lastUserMsg = [...chat.messages].reverse().find((m) => m.role === 'user');
    if (!lastUserMsg) return;

    setChats((prev) =>
      prev.map((c) => c.id === activeChatId ? { ...c, messages: c.messages.filter((m) => m.role !== 'assistant' || m.id !== chat.messages[chat.messages.length - 1].id) } : c)
    );
    setError(null);
    setLoading(true);
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    const history = chat.messages.filter((m) => m.id !== lastUserMsg.id);

    const assistantMsgId = generateId();
    setStreamingMessage(assistantMsgId);

    let accumulated = '';

    const onToken = (token) => {
      accumulated += token;
      setChats((prev) =>
        prev.map((c) => {
          if (c.id !== activeChatId) return c;
          const existing = c.messages.find((m) => m.id === assistantMsgId);
          if (existing) {
            return { ...c, messages: c.messages.map((m) => m.id === assistantMsgId ? { ...m, text: accumulated } : m) };
          }
          return { ...c, messages: [...c.messages, { id: assistantMsgId, role: 'assistant', text: accumulated, timestamp: new Date().toISOString() }] };
        })
      );
    };

    sendMessageStream([...history, lastUserMsg], signal, onToken)
      .catch(async () => {
        if (signal.aborted) return;
        if (accumulated.length === 0) {
          try {
            const reply = await sendMessage([...history, lastUserMsg], signal);
            if (!signal.aborted) await simulateTyping(reply, onToken, signal);
          } catch (err2) {
            if (!signal.aborted) setError(err2.message);
          }
        }
      })
      .finally(() => {
        if (!signal.aborted) {
          setLoading(false);
          setStreamingMessage(null);
        } else {
          setStreamingMessage(null);
          setLoading(false);
        }
      });
  }, [activeChatId, chats, error, addMessage]);

  return { chats, activeChat, activeChatId, loading, error, createChat, deleteChat, setActiveChatId, clearActiveChat, sendUserMessage, stopGeneration, retry, streamingMessage };
}
