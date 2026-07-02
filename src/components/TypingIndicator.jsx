import { motion } from 'framer-motion';

const dotVariants = {
  animate: (i) => ({
    y: [0, -4, 0],
    opacity: [0.4, 1, 0.4],
    transition: {
      duration: 1,
      repeat: Infinity,
      delay: i * 0.12,
      ease: 'easeInOut',
    },
  }),
};

export default function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      className="flex items-start gap-2 sm:gap-3 px-2 sm:px-4"
    >
      <div className="shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-purple-500/60 to-pink-500/60 flex items-center justify-center shadow-sm mt-1">
        <svg width="14" height="14" className="sm:w-4 sm:h-4" viewBox="0 0 40 40" fill="none">
          <path d="M12 15 C12 13.62 13.12 12.5 14.5 12.5 L25.5 12.5 C26.88 12.5 28 13.62 28 15 L28 21 C28 22.38 26.88 23.5 25.5 23.5 L19 23.5 L15 26.5 L15 23.5 L14.5 23.5 C13.12 23.5 12 22.38 12 21 Z"
                stroke="white" strokeWidth="1.4" strokeLinejoin="round" opacity="0.6"/>
          <path d="M20 16 L20.5 17.5 L22 18 L20.5 18.5 L20 20 L19.5 18.5 L18 18 L19.5 17.5 Z"
                fill="white" opacity="0.6"/>
        </svg>
      </div>
      <div className="px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl bg-cosmic-700/40 backdrop-blur-md ring-1 ring-white/5 flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            custom={i}
            variants={dotVariants}
            animate="animate"
            className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-purple-400/70"
          />
        ))}
      </div>
    </motion.div>
  );
}
