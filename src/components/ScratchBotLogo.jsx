import { motion } from 'framer-motion';

export default function ScratchBotLogo({ size = 36, onClick, className = '' }) {
  const svgSize = typeof size === 'number' ? size : 36;
  const wrapper = (children) => {
    if (onClick) {
      return (
        <motion.button
          onClick={onClick}
          whileHover={{ scale: 1.08 }}
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
      <circle cx="20" cy="20" r="18" stroke="url(#sbGrad)" strokeWidth="1.5" opacity="0.9" />
      <circle cx="20" cy="20" r="12" stroke="url(#sbGrad)" strokeWidth="1" opacity="0.5" />
      <circle cx="20" cy="20" r="3.5" fill="url(#sbGrad)" />
      <path d="M20 5 L20 11" stroke="url(#sbGrad)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M20 29 L20 35" stroke="url(#sbGrad)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M5 20 L11 20" stroke="url(#sbGrad)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M29 20 L35 20" stroke="url(#sbGrad)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
