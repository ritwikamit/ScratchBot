import { useState, useCallback, useEffect, useRef } from 'react';
import { sendMessage } from '../services/gemini';
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

export function useChat() {
  const [chats, setChats] = useState(() => loadChats());
  const [activeChatId, setActiveChatId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

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

    try {
      const reply = await sendMessage([...history, { role: 'user', text }], signal);
      if (!signal.aborted) addMessage('assistant', reply);
    } catch (err) {
      if (!signal.aborted) setError(err.message);
    } finally {
      if (!signal.aborted) setLoading(false);
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

    sendMessage([...history, lastUserMsg], signal)
      .then((reply) => { if (!signal.aborted) addMessage('assistant', reply); })
      .catch((err) => { if (!signal.aborted) setError(err.message); })
      .finally(() => { if (!signal.aborted) setLoading(false); });
  }, [activeChatId, chats, error, addMessage]);

  return { chats, activeChat, activeChatId, loading, error, createChat, deleteChat, setActiveChatId, clearActiveChat, sendUserMessage, stopGeneration, retry };
}
