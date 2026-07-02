import { motion } from 'framer-motion';
import ScratchBotLogo from './ScratchBotLogo';
import Button from './Button';

export default function Header({ onClearChat, messageCount, onToggleSidebar }) {
  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="h-12 sm:h-14 shrink-0 flex items-center justify-between px-3 sm:px-4 lg:px-6 border-b border-white/5 bg-black/20 backdrop-blur-2xl">
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

        <button onClick={handleLogoClick} className="flex items-center gap-2 sm:gap-3 group">
          <ScratchBotLogo size={28} />
          <span className="font-display font-bold text-white text-xs sm:text-sm tracking-wider">
            <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">Scratch</span>Bot
          </span>
        </button>

        <span className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-semibold tracking-wide ring-1 ring-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Online
        </span>
      </div>

      <div className="flex items-center gap-1">
        {messageCount > 0 && (
          <Button
            onClick={onClearChat}
            variant="danger"
            size="sm"
          >
            <svg width="11" height="11" className="sm:w-[13px] sm:h-[13px]" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 4h12M5 4V2.5a.5.5 0 01.5-.5h5a.5.5 0 01.5.5V4M13 4v9.5a1 1 0 01-1 1H4a1 1 0 01-1-1V4"/>
            </svg>
            Clear
          </Button>
        )}
      </div>
    </header>
  );
}
