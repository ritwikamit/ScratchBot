import { motion } from 'framer-motion';

export default function ScratchBotLogo({ size = 36, onClick, className = '' }) {
  const svgSize = typeof size === 'number' ? size : 36;
  const wrapper = (children) => {
    if (onClick) {
      return (
        <motion.button
          onClick={onClick}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
          className={`shrink-0 ${className}`}
          style={{ filter: 'drop-shadow(0 0 6px rgba(236,72,153,0.25))' }}
          title="ScratchBot"
        >
          {children}
        </motion.button>
      );
    }
    return <div className={`shrink-0 ${className}`}>{children}</div>;
  };

  return wrapper(
    <svg
      width={svgSize}
      height={svgSize}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="sbGrad" x1="4" y1="4" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>
      <path
        d="M8 12 C8 9.79 9.79 8 12 8 L28 8 C30.21 8 32 9.79 32 12 L32 22 C32 24.21 30.21 26 28 26 L16 26 L10 31 L10 26 L12 26 C9.79 26 8 24.21 8 22 Z"
        stroke="url(#sbGrad)" strokeWidth="1.6" strokeLinejoin="round"
      />
      <path
        d="M20 13 L21.2 16.3 L24.5 17.5 L21.2 18.7 L20 22 L18.8 18.7 L15.5 17.5 L18.8 16.3 Z"
        fill="url(#sbGrad)"
      />
    </svg>
  );
}
