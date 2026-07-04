import { motion } from "framer-motion";
import { useState } from "react";

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  scrolled?: boolean;
  theme?: 'dark' | 'light';
};

export default function CyberButton({ children, onClick, scrolled = false, theme = 'dark' }: Props) {
  const [hover, setHover] = useState(false);
  const isLight = theme === 'light';

  return (
    <motion.button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      whileHover={{ scale: 1.05, y: -2 }}
      onClick={onClick}
      className={`
        relative group px-6 py-3 rounded-md font-medium transition-all duration-300
        border border-transparent
        font-mono font-bold tracking-tight
        ${scrolled
          ? "shadow-[0_0_25px_rgba(0,255,255,0.45)] hover:shadow-[0_0_40px_rgba(0,255,255,0.75)]"
          : "shadow-none"
        }
        ${
          scrolled
            ? isLight
              ? "bg-gradient-to-b from-white to-cyan-50 text-slate-800 border-cyan-200"
              : "bg-gradient-to-b from-cyan-900/90 to-indigo-900/90 text-cyan-300"
            : isLight
              ? "bg-gradient-to-b from-white/80 to-cyan-50/80 text-slate-800 border-cyan-100"
              : "bg-gradient-to-b from-slate-900/80 to-slate-800/80 text-cyan-300"
        }

        overflow-hidden select-none
      `}
    >
      {/* Text */}
      <span className="relative z-20 group-hover:animate-glitch">
        {children}
      </span>

      {/* Glitch overlay */}
      <span
        className={`cyber-glitch ${hover ? "animate" : ""}`}
        aria-hidden="true"
      />
    </motion.button>
  );
}


