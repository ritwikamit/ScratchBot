import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MessageInput({ onSend, onStop, loading }) {
  const [input, setInput] = useState('');
  const inputRef = useRef(null);

  const handleSend = useCallback(() => {
    const text = input.trim();
    if (!text || loading) return;
    onSend(text);
    setInput('');
    inputRef.current?.focus();
  }, [input, loading, onSend]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="shrink-0 px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 border-t border-white/5 bg-black/20 backdrop-blur-2xl">
      <div className="max-w-3xl mx-auto">
        <div className="relative flex items-center gap-2 bg-black/50 backdrop-blur-2xl rounded-2xl ring-1 ring-white/10 focus-within:ring-purple-500/40 focus-within:shadow-lg focus-within:shadow-purple-500/10 transition-all duration-300 px-3 sm:px-4 py-1.5 sm:py-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            disabled={loading}
            className="flex-1 bg-transparent text-sm text-white placeholder:text-cosmic-300 outline-none resize-none py-1.5 sm:py-2 max-h-32 disabled:opacity-50"
            style={{ fieldSizing: 'content' }}
          />

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.button
                key="stop"
                onClick={onStop}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.15 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.93 }}
                className="shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center bg-red-500/20 text-red-400 ring-1 ring-red-500/30 hover:bg-red-500/30 transition-all duration-200"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                  <rect x="1" y="1" width="10" height="10" rx="1.5" />
                </svg>
              </motion.button>
            ) : (
              <motion.button
                key="send"
                onClick={handleSend}
                disabled={!input.trim()}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.15 }}
                whileHover={input.trim() ? { scale: 1.04 } : {}}
                whileTap={input.trim() ? { scale: 0.93 } : {}}
                className={`shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
                  input.trim()
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md shadow-purple-500/20 hover:shadow-lg hover:shadow-purple-500/30'
                    : 'bg-cosmic-600/50 text-cosmic-300 cursor-not-allowed'
                }`}
              >
                <svg width="14" height="14" className="sm:w-4 sm:h-4 -translate-y-0.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="1" y1="8" x2="14" y2="8"/><polyline points="9,3 14,8 9,13"/>
                </svg>
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <p className="text-[10px] sm:text-[11px] text-center text-cosmic-300 mt-1.5 sm:mt-2 font-medium">
          ScratchBot can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  );
}
