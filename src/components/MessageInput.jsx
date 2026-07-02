import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

export default function MessageInput({ onSend, loading }) {
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
    <div className="shrink-0 px-3 lg:px-6 py-3 lg:py-4 border-t border-white/5 bg-cosmic-800/40 backdrop-blur-xl">
      <div className="max-w-3xl mx-auto">
        <div className="relative flex items-center gap-2 bg-cosmic-700/50 backdrop-blur-md rounded-2xl ring-1 ring-white/5 focus-within:ring-purple-500/30 transition-all duration-300 px-4 py-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            disabled={loading}
            className="flex-1 bg-transparent text-sm text-cosmic-50 placeholder:text-cosmic-300 outline-none resize-none py-2 max-h-32 disabled:opacity-50"
            style={{ fieldSizing: 'content' }}
          />

          <motion.button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            whileHover={input.trim() && !loading ? { scale: 1.04 } : {}}
            whileTap={input.trim() && !loading ? { scale: 0.93 } : {}}
            className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${
              input.trim() && !loading
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md shadow-purple-500/20 hover:shadow-lg hover:shadow-purple-500/30'
                : 'bg-cosmic-600/50 text-cosmic-300 cursor-not-allowed'
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="2" x2="8" y2="14"/><line x1="2" y1="8" x2="14" y2="8"/>
            </svg>
          </motion.button>
        </div>

        <p className="text-[11px] text-center text-cosmic-300 mt-2 font-medium">
          ScratchBot can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  );
}
