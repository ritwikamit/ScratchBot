import { motion } from 'framer-motion';

export default function ScratchBotLogo({ size = 36, onClick, className = '' }) {
  const svgSize = typeof size === 'number' ? size : 36;
  const wrapper = (children) => {
    if (onClick) {
      return (
        <motion.button
          onClick={onClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`shrink-0 ${className}`}
          style={{ filter: 'drop-shadow(0 0 8px rgba(168,85,247,0.35))' }}
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
      className="transition-all duration-300"
    >
      <defs>
        <linearGradient id="sbGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="18" stroke="url(#sbGrad)" strokeWidth="1.5" opacity="0.35" />
      <circle cx="20" cy="20" r="12" stroke="url(#sbGrad)" strokeWidth="1.5" opacity="0.55" />
      <path d="M20 20 C20 12, 28 8, 32 12 C36 16, 32 24, 24 24 C18 24, 16 18, 20 14"
        stroke="url(#sbGrad)" strokeWidth="2" strokeLinecap="round" fill="none" />
      <circle cx="20" cy="20" r="3.5" fill="url(#sbGrad)" />
      <circle cx="32" cy="12" r="1.6" fill="#ec4899" />
      <circle cx="9" cy="9" r="1" fill="#a855f7" opacity="0.8" />
      <circle cx="33" cy="30" r="1.2" fill="#a855f7" opacity="0.6" />
    </svg>
  );
}
