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

const PAUSE_AFTER_CHAR = {
  '.': 160,
  '?': 180,
  '!': 180,
  ',': 80,
  '\n': 120,
  ':': 90,
  ';': 80,
};

function charDelay(ch) {
  return PAUSE_AFTER_CHAR[ch] || 0;
}

function simulateTyping(fullText, onToken, signal) {
  return new Promise((resolve) => {
    let i = 0;

    function pushNext() {
      if (signal.aborted) { resolve(); return; }
      if (i >= fullText.length) { resolve(); return; }

      const ch = fullText[i];
      const delay = 14 + Math.random() * 18 + charDelay(ch);

      onToken(ch);
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
  const chatsRef = useRef(chats);
  const activeChatIdRef = useRef(activeChatId);
  const streamingRef = useRef(null);

  useEffect(() => {
    chatsRef.current = chats;
  }, [chats]);

  useEffect(() => {
    activeChatIdRef.current = activeChatId;
  }, [activeChatId]);

  useEffect(() => {
    streamingRef.current = streamingMessage;
  }, [streamingMessage]);

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
    setChats((prev) => prev.map((c) => c.id === activeChatIdRef.current ? { ...c, messages: [], title: 'New Chat' } : c));
    setError(null);
  }, []);

  const addMessage = useCallback((role, text) => {
    const id = activeChatIdRef.current;
    if (!id) return null;
    const message = { id: generateId(), role, text, timestamp: new Date().toISOString() };
    setChats((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const messages = [...c.messages, message];
        const title = c.title === 'New Chat' && role === 'user' ? text.slice(0, 60) + (text.length > 60 ? '...' : '') : c.title;
        return { ...c, messages, title };
      })
    );
    return message.id;
  }, []);

  const onToken = useCallback((accumulated, assistantMsgId, chatId) => {
    setChats((prev) =>
      prev.map((c) => {
        if (c.id !== chatId) return c;
        const existing = c.messages.find((m) => m.id === assistantMsgId);
        if (existing) {
          return { ...c, messages: c.messages.map((m) => m.id === assistantMsgId ? { ...m, text: accumulated } : m) };
        }
        return { ...c, messages: [...c.messages, { id: assistantMsgId, role: 'assistant', text: accumulated, timestamp: new Date().toISOString() }] };
      })
    );
  }, []);

  const sendUserMessage = useCallback(async (text) => {
    const chatId = activeChatIdRef.current;
    if (!chatId) return;

    addMessage('user', text);
    setLoading(true);
    setError(null);
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    const assistantMsgId = generateId();
    setStreamingMessage(assistantMsgId);

    let accumulated = '';
    let charBuffer = '';
    let charTimer = null;

    const flushCharBuffer = () => {
      if (charTimer) { clearTimeout(charTimer); charTimer = null; }
      if (charBuffer) {
        accumulated += charBuffer;
        onToken(accumulated, assistantMsgId, chatId);
        charBuffer = '';
      }
    };

    const scheduleChar = () => {
      if (charTimer) return;
      charTimer = setTimeout(() => {
        charTimer = null;
        if (charBuffer) {
          const ch = charBuffer[0];
          charBuffer = charBuffer.slice(1);
          accumulated += ch;
          onToken(accumulated, assistantMsgId, chatId);
          if (charBuffer) scheduleChar();
        }
      }, 14 + Math.random() * 18 + (charBuffer ? charDelay(charBuffer[0]) : 0));
    };

    const handleToken = (token) => {
      charBuffer += token;
      if (!charTimer) scheduleChar();
    };

    const chat = chatsRef.current.find((c) => c.id === chatId);
    const history = chat ? chat.messages : [];

    try {
      await sendMessageStream([...history, { role: 'user', text }], signal, handleToken);
      flushWordBuffer();
    } catch (err) {
      if (signal.aborted) return;
      flushCharBuffer();
      if (accumulated.length === 0) {
        try {
          const reply = await sendMessage([...history, { role: 'user', text }], signal);
          if (!signal.aborted) await simulateTyping(reply, handleToken, signal);
        } catch (err2) {
          if (!signal.aborted) setError(err2.message);
        }
      }
    } finally {
      if (!signal.aborted) {
        setLoading(false);
        setStreamingMessage(null);
        const currentChats = chatsRef.current;
        const currentChat = currentChats.find((c) => c.id === chatId);
        const msgExists = currentChat?.messages?.some((m) => m.id === assistantMsgId);
        if (!msgExists && accumulated) {
          addMessage('assistant', accumulated);
        }
      } else {
        setStreamingMessage(null);
        setLoading(false);
      }
    }
  }, [addMessage, onToken]);

  const stopGeneration = useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  const retry = useCallback(() => {
    const chatId = activeChatIdRef.current;
    if (!chatId || !error) return;
    const chat = chatsRef.current.find((c) => c.id === chatId);
    if (!chat || chat.messages.length === 0) return;
    const lastUserMsg = [...chat.messages].reverse().find((m) => m.role === 'user');
    if (!lastUserMsg) return;

    setChats((prev) =>
      prev.map((c) => c.id === chatId ? { ...c, messages: c.messages.filter((m) => m.role !== 'assistant' || m.id !== chat.messages[chat.messages.length - 1].id) } : c)
    );
    setError(null);
    setLoading(true);
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    const assistantMsgId = generateId();
    setStreamingMessage(assistantMsgId);

    const history = chat.messages.filter((m) => m.id !== lastUserMsg.id);
    let accumulated = '';
    let charBuffer = '';
    let charTimer = null;

    const flushCharBuffer = () => {
      if (charTimer) { clearTimeout(charTimer); charTimer = null; }
      if (charBuffer) {
        accumulated += charBuffer;
        onToken(accumulated, assistantMsgId, chatId);
        charBuffer = '';
      }
    };

    const scheduleChar = () => {
      if (charTimer) return;
      charTimer = setTimeout(() => {
        charTimer = null;
        if (charBuffer) {
          const ch = charBuffer[0];
          charBuffer = charBuffer.slice(1);
          accumulated += ch;
          onToken(accumulated, assistantMsgId, chatId);
          if (charBuffer) scheduleChar();
        }
      }, 14 + Math.random() * 18 + (charBuffer ? charDelay(charBuffer[0]) : 0));
    };

    const handleToken = (token) => {
      charBuffer += token;
      if (!charTimer) scheduleChar();
    };

    sendMessageStream([...history, lastUserMsg], signal, handleToken)
      .then(flushCharBuffer)
      .catch(async () => {
        if (signal.aborted) return;
        flushCharBuffer();
        if (accumulated.length === 0) {
          try {
            const reply = await sendMessage([...history, lastUserMsg], signal);
            if (!signal.aborted) await simulateTyping(reply, handleToken, signal);
          } catch (err2) {
            if (!signal.aborted) setError(err2.message);
          }
        }
      })
      .finally(() => {
        setStreamingMessage(null);
        setLoading(false);
      });
  }, [error, onToken]);

  return { chats, activeChat, activeChatId, loading, error, createChat, deleteChat, setActiveChatId, clearActiveChat, sendUserMessage, stopGeneration, retry, streamingMessage };
}
