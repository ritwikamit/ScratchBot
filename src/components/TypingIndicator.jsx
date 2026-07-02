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
        <svg width="12" height="12" className="sm:w-[14px] sm:h-[14px]" viewBox="0 0 36 36" fill="none">
          <path d="M18 5l2.2 6.6L27 14l-6.8 2.4L18 23l-2.2-6.6L9 14l6.8-2.4L18 5z" fill="white" opacity="0.7"/>
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
