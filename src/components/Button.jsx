import { motion } from 'framer-motion';

const variants = {
  primary: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md shadow-purple-500/20 hover:shadow-lg hover:shadow-purple-500/30',
  secondary: 'bg-white/5 text-cosmic-100 hover:bg-white/10 hover:text-white ring-1 ring-white/10',
  ghost: 'text-cosmic-200 hover:text-white hover:bg-white/5',
  outline: 'bg-transparent text-cosmic-100 ring-1 ring-white/10 hover:ring-purple-500/40 hover:text-white',
  'icon-only': 'text-cosmic-200 hover:text-white hover:bg-white/5',
  danger: 'text-cosmic-200 hover:text-red-400 hover:bg-red-500/10',
};

const sizes = {
  sm: 'px-2 py-1 text-[10px] sm:text-[11px] rounded-lg',
  md: 'px-3 py-1.5 text-xs sm:text-sm rounded-xl',
  lg: 'px-4 py-2 text-sm sm:text-base rounded-xl',
};

export default function Button({ variant = 'primary', size = 'md', disabled = false, className = '', children, ...props }) {
  const base = 'inline-flex items-center justify-center gap-1.5 font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 focus-visible:ring-offset-1 focus-visible:ring-offset-black';

  const motionProps = disabled ? {} : {
    whileHover: { y: -1, scale: 1.01 },
    whileTap: { scale: 0.98 },
  };

  return (
    <motion.button
      disabled={disabled}
      className={`${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      {...motionProps}
      {...props}
    >
      {children}
    </motion.button>
  );
}
