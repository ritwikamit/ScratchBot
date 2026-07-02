import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import MarkdownRenderer from './MarkdownRenderer';
import StreamingMessage from './StreamingMessage';
import CopyButton from './CopyButton';

export default function ChatMessage({ message, isStreaming }) {
  const isUser = message.role === 'user';
  const [showCopy, setShowCopy] = useState(false);

  const msgVariants = {
    initial: { opacity: 0, y: 10, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, y: -6, transition: { duration: 0.15 } },
  };

  return (
    <motion.div
      variants={msgVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      layout
      onMouseEnter={() => setShowCopy(true)}
      onMouseLeave={() => setShowCopy(false)}
      className={`flex items-start gap-2 sm:gap-3 ${isUser ? 'justify-end' : ''}`}
    >
      {!isUser && (
        <div className="shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-purple-500/80 to-pink-500/80 flex items-center justify-center shadow-md shadow-purple-500/15 mt-1">
          <svg width="16" height="16" className="sm:w-[18px] sm:h-[18px]" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="16" stroke="white" strokeWidth="1.4" opacity="0.7"/>
            <circle cx="20" cy="20" r="10" stroke="white" strokeWidth="1" opacity="0.4"/>
            <circle cx="20" cy="20" r="3" fill="white" opacity="0.8"/>
            <line x1="20" y1="6" x2="20" y2="12" stroke="white" strokeWidth="1.4" strokeLinecap="round" opacity="0.6"/>
            <line x1="20" y1="28" x2="20" y2="34" stroke="white" strokeWidth="1.4" strokeLinecap="round" opacity="0.6"/>
            <line x1="6" y1="20" x2="12" y2="20" stroke="white" strokeWidth="1.4" strokeLinecap="round" opacity="0.6"/>
            <line x1="28" y1="20" x2="34" y2="20" stroke="white" strokeWidth="1.4" strokeLinecap="round" opacity="0.6"/>
          </svg>
        </div>
      )}

      <div
        className={`relative group max-w-[88%] sm:max-w-[80%] lg:max-w-[70%] ${
          isUser ? 'order-1' : ''
        }`}
      >
        <div
          className={`px-3 py-2.5 sm:px-4 sm:py-3 rounded-2xl text-sm leading-relaxed ${
            isUser
              ? 'bg-purple-600/25 backdrop-blur-2xl text-purple-50 ring-1 ring-purple-400/20 shadow-md shadow-purple-500/5'
              : 'bg-black/40 backdrop-blur-2xl text-white ring-1 ring-white/10'
          }`}
        >
          {isUser ? (
            <p className="text-sm sm:text-[15px] leading-relaxed">{message.text}</p>
          ) : isStreaming ? (
            <StreamingMessage text={message.text} />
          ) : (
            <MarkdownRenderer content={message.text} />
          )}
        </div>

        <div
          className={`flex items-center gap-1.5 mt-1.5 ${
            isUser ? 'justify-end' : ''
          }`}
        >
          {!isUser && !isStreaming && (
            <motion.div
              initial={false}
              animate={{ opacity: showCopy ? 1 : 0, y: showCopy ? 0 : 2 }}
              transition={{ duration: 0.15 }}
            >
              <CopyButton text={message.text} />
            </motion.div>
          )}
          <span className={`text-[10px] font-medium ${isUser ? 'text-purple-300/50' : 'text-cosmic-300'}`}>
            {isUser ? 'You' : isStreaming ? 'Generating...' : 'ScratchBot'}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
