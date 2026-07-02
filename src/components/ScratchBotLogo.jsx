import { motion } from 'framer-motion';

export default function ScratchBotLogo({ size = 32, onClick, className = '' }) {
  const svgSize = typeof size === 'number' ? size : 32;
  const wrapper = (children) => {
    if (onClick) {
      return (
        <motion.button
          onClick={onClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`shrink-0 ${className}`}
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
      className="text-white"
    >
      <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="20" cy="20" r="3" fill="currentColor" />
      <path d="M20 8 L20 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M20 26 L20 32" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8 20 L14 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M26 20 L32 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
