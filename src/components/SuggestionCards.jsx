import { motion } from 'framer-motion';

const suggestions = [
  { icon: '✨', text: 'Write a poem about AI' },
  { icon: '🔮', text: 'Explain quantum computing' },
  { icon: '🎨', text: 'Design a logo concept' },
  { icon: '💻', text: 'Debug my code' },
];

export default function SuggestionCards({ onSelect }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
      {suggestions.map(({ icon, text }, i) => (
        <motion.button
          key={text}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -2, scale: 1.01 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onSelect(text)}
          className="px-4 py-4 rounded-2xl bg-cosmic-700/40 backdrop-blur-md border border-white/5 text-left hover:bg-cosmic-600/50 hover:border-purple-500/20 transition-all duration-200 group"
        >
          <span className="text-lg block mb-2">{icon}</span>
          <span className="text-sm text-cosmic-100 group-hover:text-white transition-colors leading-snug">
            {text}
          </span>
        </motion.button>
      ))}
    </div>
  );
}
