import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';

export default function ChatWindow({ messages, loading, error, onSendMessage, onRetry }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
  };

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin px-2 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6">
      <AnimatePresence mode="popLayout">
        {messages.length === 0 && !loading ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full flex flex-col items-center justify-center px-4"
          >
            <div className="mb-4 sm:mb-5">
              <svg width="44" height="44" className="sm:w-[52px] sm:h-[52px] mx-auto" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="18" stroke="url(#sbGrad)" strokeWidth="1.5" opacity="0.35"/>
                <circle cx="20" cy="20" r="12" stroke="url(#sbGrad)" strokeWidth="1.5" opacity="0.55"/>
                <path d="M20 20 C20 12, 28 8, 32 12 C36 16, 32 24, 24 24 C18 24, 16 18, 20 14" stroke="url(#sbGrad)" strokeWidth="2" strokeLinecap="round" fill="none"/>
                <circle cx="20" cy="20" r="3.5" fill="url(#sbGrad)"/>
                <circle cx="32" cy="12" r="1.6" fill="#ec4899"/>
                <circle cx="9" cy="9" r="1" fill="#a855f7" opacity="0.8"/>
                <circle cx="33" cy="30" r="1.2" fill="#a855f7" opacity="0.6"/>
                <defs><linearGradient id="sbGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#a855f7"/><stop offset="100%" stop-color="#ec4899"/></linearGradient></defs>
              </svg>
            </div>
              <p className="text-sm sm:text-base font-medium text-white/80 mb-1">Ask me anything</p>
            <p className="text-xs text-cosmic-200">I can help you code, create, and explore ideas</p>
          </motion.div>
        ) : (
          <motion.div key="messages" variants={containerVariants} initial="hidden" animate="visible" className="max-w-3xl mx-auto space-y-3">
            <AnimatePresence>
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
            </AnimatePresence>

            {loading && <TypingIndicator />}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 max-w-3xl mx-auto px-3 sm:px-4 py-3 rounded-xl bg-red-500/10 backdrop-blur-2xl border border-red-500/15 text-sm text-red-300"
              >
                <svg className="shrink-0 mt-0.5 hidden sm:block" width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="8" cy="8" r="7"/><line x1="8" y1="5" x2="8" y2="8"/><line x1="8" y1="11" x2="8" y2="11.01" strokeWidth="2"/>
                </svg>
                <div className="flex-1 min-w-0">
                  <p className="font-medium mb-1 text-xs sm:text-sm">Error</p>
                  <p className="text-red-300/80 text-xs break-words">{error}</p>
                </div>
                <button
                  onClick={onRetry}
                  className="shrink-0 px-2.5 sm:px-3 py-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-xs font-semibold text-red-300 transition-all"
                >
                  Retry
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <div ref={bottomRef} />
    </div>
  );
}
