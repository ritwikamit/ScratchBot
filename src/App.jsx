import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StarsBackground } from './components/ui/stars-background';
import SpiralAccent from './components/SpiralAccent';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ChatWindow from './components/ChatWindow';
import MessageInput from './components/MessageInput';
import { useChat } from './hooks/useChat';

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [query]);
  return matches;
}

export default function App() {
  const {
    chats, activeChat, activeChatId, loading, error,
    createChat, deleteChat, setActiveChatId, clearActiveChat, sendUserMessage, retry,
  } = useChat();

  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 1024);

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  useEffect(() => {
    if (chats.length > 0 && !activeChatId) setActiveChatId(chats[0].id);
  }, [chats, activeChatId, setActiveChatId]);

  const handleNewChat = useCallback(() => {
    createChat();
    if (!sidebarOpen) setSidebarOpen(true);
  }, [createChat, sidebarOpen]);

  const messages = activeChat ? activeChat.messages : [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="h-screen flex overflow-hidden bg-[#06060e]"
    >
      <StarsBackground starDensity={0.00012} className="pointer-events-none" />
      <div className="hidden sm:block"><SpiralAccent /></div>

      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <Sidebar
            key="sidebar"
            chats={chats}
            activeChatId={activeChatId}
            onNewChat={handleNewChat}
            onSelectChat={(id) => {
              setActiveChatId(id);
              if (!isDesktop) setSidebarOpen(false);
            }}
            onDeleteChat={deleteChat}
            isOverlay={!isDesktop}
            onClose={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0 relative" style={{ zIndex: 10 }}>
        <Header
          onClearChat={clearActiveChat}
          messageCount={messages.length}
          onToggleSidebar={() => setSidebarOpen((p) => !p)}
        />

        <main className="flex-1 flex flex-col min-h-0">
          {activeChatId ? (
            <>
              <ChatWindow
                messages={messages}
                loading={loading}
                error={error}
                onSendMessage={sendUserMessage}
                onRetry={retry}
              />
              <MessageInput onSend={sendUserMessage} loading={loading} />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center px-4 sm:px-6">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="text-center w-full max-w-sm"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-cosmic-600/60 backdrop-blur-md flex items-center justify-center mx-auto mb-5 sm:mb-6 ring-1 ring-white/5">
                  <svg width="26" height="26" className="sm:w-8 sm:h-8" viewBox="0 0 36 36" fill="none">
                    <path d="M18 4l2.5 7.5L28 14l-7.5 2.5L18 24l-2.5-7.5L8 14l7.5-2.5L18 4z" fill="url(#sbGrad)" opacity="0.9"/>
                    <circle cx="18" cy="14" r="2" fill="white" opacity="0.4"/>
                    <defs><linearGradient id="sbGrad" x1="0" y1="0" x2="36" y2="36"><stop offset="0%" stop-color="#a78bfa"/><stop offset="100%" stop-color="#ec4899"/></linearGradient></defs>
                  </svg>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white mb-2 font-display tracking-wide">Welcome to ScratchBot</h2>
                <p className="text-xs sm:text-sm text-cosmic-100 mb-5 sm:mb-6 mx-auto leading-relaxed">
                  Your cosmic AI assistant. Ask anything — from code to creativity.
                </p>
                <motion.button
                  onClick={handleNewChat}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold text-sm shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-200"
                >
                  Start a conversation
                </motion.button>
              </motion.div>
            </div>
          )}
        </main>
      </div>
    </motion.div>
  );
}
