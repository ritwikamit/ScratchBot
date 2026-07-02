import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SpiralAnimation } from './components/ui/spiral-animation';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ChatWindow from './components/ChatWindow';
import MessageInput from './components/MessageInput';
import ScratchBotLogo from './components/ScratchBotLogo';
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
    createChat, deleteChat, setActiveChatId, clearActiveChat, sendUserMessage, stopGeneration, retry,
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
      className="h-screen flex overflow-hidden bg-black"
    >
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <SpiralAnimation />
      </div>

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
              <MessageInput onSend={sendUserMessage} onStop={stopGeneration} loading={loading} />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center px-4 sm:px-6">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="text-center w-full max-w-sm"
              >
                <ScratchBotLogo size={56} className="mx-auto mb-5 sm:mb-6" />
                <h2 className="text-lg sm:text-xl font-bold text-white mb-2 font-display tracking-wide">
                  Welcome to <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">Scratch</span>Bot
                </h2>
                <p className="text-xs sm:text-sm text-cosmic-100 mb-5 sm:mb-6 mx-auto leading-relaxed">
                  Your cosmic AI assistant. Ask anything — from code to creativity.
                </p>
                <motion.button
                  onClick={handleNewChat}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full sm:w-auto px-6 sm:px-7 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold text-sm shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-200"
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
