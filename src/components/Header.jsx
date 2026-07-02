import { motion } from 'framer-motion';

export default function Header({ onClearChat, messageCount, onToggleSidebar }) {
  return (
    <header className="h-12 sm:h-14 shrink-0 flex items-center justify-between px-3 sm:px-4 lg:px-6 border-b border-white/5 bg-cosmic-800/40 backdrop-blur-xl">
      <div className="flex items-center gap-2 sm:gap-3">
        <motion.button
          onClick={onToggleSidebar}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          className="p-1.5 sm:p-2 -ml-1.5 rounded-xl hover:bg-white/5 text-cosmic-200 transition-colors"
        >
          <svg width="16" height="16" className="sm:w-[18px] sm:h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </motion.button>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-sm">
            <svg width="12" height="12" className="sm:w-[14px] sm:h-[14px]" viewBox="0 0 36 36" fill="none">
              <path d="M18 5l2.2 6.6L27 14l-6.8 2.4L18 23l-2.2-6.6L9 14l6.8-2.4L18 5z" fill="white" opacity="0.85"/>
            </svg>
          </div>
          <span className="font-display font-bold text-white text-xs sm:text-sm tracking-wider">
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Scratch</span>Bot
          </span>
        </div>

        <span className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-semibold tracking-wide ring-1 ring-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Online
        </span>
      </div>

      <div className="flex items-center gap-1">
        {messageCount > 0 && (
          <motion.button
            onClick={onClearChat}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl text-[10px] sm:text-[11px] font-semibold text-cosmic-200 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150"
          >
            <svg width="11" height="11" className="sm:w-[13px] sm:h-[13px]" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 4h12M5 4V2.5a.5.5 0 01.5-.5h5a.5.5 0 01.5.5V4M13 4v9.5a1 1 0 01-1 1H4a1 1 0 01-1-1V4"/>
            </svg>
            Clear
          </motion.button>
        )}
      </div>
    </header>
  );
}
