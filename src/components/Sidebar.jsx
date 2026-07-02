import { motion } from 'framer-motion';
import { formatDate, truncate } from '../utils/helpers';

const sidebarVariants = {
  hidden: { x: -300, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 260, damping: 26 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: (i) => ({
    opacity: 1, x: 0,
    transition: { delay: 0.06 + i * 0.025, type: 'spring', stiffness: 300, damping: 28 },
  }),
};

const LogoSvg = ({ className }) => (
  <svg className={className} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sbSide" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#a78bfa"/><stop offset="100%" stop-color="#ec4899"/>
      </linearGradient>
    </defs>
    <rect width="36" height="36" rx="10" fill="#111122" stroke="url(#sbSide)" stroke-width="1"/>
    <path d="M18 5l2.2 6.6L27 14l-6.8 2.4L18 23l-2.2-6.6L9 14l6.8-2.4L18 5z" fill="url(#sbSide)" opacity="0.85"/>
    <circle cx="18" cy="13.5" r="1.8" fill="white" opacity="0.35"/>
  </svg>
);

export default function Sidebar({ chats, activeChatId, onNewChat, onSelectChat, onDeleteChat }) {
  const grouped = chats.reduce((acc, chat) => {
    const label = formatDate(new Date(chat.createdAt));
    if (!acc[label]) acc[label] = [];
    acc[label].push(chat);
    return acc;
  }, {});

  return (
    <motion.aside
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
      exit={{ x: -300, opacity: 0, transition: { duration: 0.2 } }}
      className="w-72 h-full bg-cosmic-800/80 backdrop-blur-xl border-r border-white/5 flex flex-col shrink-0"
      style={{ zIndex: 20 }}
    >
      <div className="p-5 border-b border-white/5">
        <div className="flex items-center gap-3 mb-5">
          <LogoSvg className="w-9 h-9 shrink-0" />
          <div>
            <h1 className="font-display font-bold text-white text-sm tracking-wider">
              <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Scratch</span>Bot
            </h1>
            <p className="text-[11px] text-cosmic-200 font-medium">AI Assistant</p>
          </div>
        </div>

        <motion.button
          onClick={onNewChat}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.97 }}
          className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium text-sm shadow-md shadow-purple-600/20 hover:shadow-lg hover:shadow-purple-600/30 transition-all duration-200"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="8" y1="3" x2="8" y2="13"/><line x1="3" y1="8" x2="13" y2="8"/>
          </svg>
          New Chat
        </motion.button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4 scrollbar-thin">
        {Object.entries(grouped).map(([label, items]) => (
          <div key={label}>
            <p className="px-3 text-[11px] font-semibold text-cosmic-200 mb-2 uppercase tracking-[0.08em]">{label}</p>
            <div className="space-y-0.5">
              {items.map((chat, i) => (
                <motion.div key={chat.id} custom={i} variants={itemVariants} initial="hidden" animate="visible">
                  <button
                    onClick={() => onSelectChat(chat.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all duration-150 group flex items-center justify-between ${
                      chat.id === activeChatId
                        ? 'bg-purple-500/10 text-purple-300 font-medium shadow-sm ring-1 ring-purple-500/20'
                        : 'text-cosmic-100 hover:bg-white/[0.03]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <svg className="shrink-0" width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M8 1a3 3 0 00-3 3v1h6V4a3 3 0 00-3-3z"/>
                        <path d="M3 7a2 2 0 012-2h6a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/>
                      </svg>
                      <span className="truncate">{truncate(chat.title, 28)}</span>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); onDeleteChat(chat.id); }}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-white/10 text-cosmic-200 hover:text-red-400 transition-all"
                    >
                      <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <line x1="4" y1="4" x2="12" y2="12"/><line x1="12" y1="4" x2="4" y2="12"/>
                      </svg>
                    </button>
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
        {chats.length === 0 && (
          <div className="text-center py-12 px-4">
            <div className="w-12 h-12 rounded-2xl bg-cosmic-600/50 flex items-center justify-center mx-auto mb-3 ring-1 ring-white/5">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-cosmic-200">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
              </svg>
            </div>
            <p className="text-sm text-cosmic-200 font-medium">No conversations yet</p>
            <p className="text-xs text-cosmic-300 mt-1">Start a new chat to begin</p>
          </div>
        )}
      </nav>

      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
          <span className="text-xs text-cosmic-200 font-medium">ScratchBot v1.0</span>
        </div>
      </div>
    </motion.aside>
  );
}
