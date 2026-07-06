import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  scrolled?: boolean;
  theme?: 'dark' | 'light';
};

const GLITCH_BURST_MS = 450;
const GLITCH_REPEAT_MS = 5000;

export default function CyberButton({ children, onClick, scrolled = false, theme = 'dark' }: Props) {
  const [glitching, setGlitching] = useState(false);
  const burstTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const repeatTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const isLight = theme === 'light';

  const burst = () => {
    setGlitching(true);
    if (burstTimer.current) clearTimeout(burstTimer.current);
    burstTimer.current = setTimeout(() => setGlitching(false), GLITCH_BURST_MS);
  };

  const handleEnter = () => {
    burst();
    repeatTimer.current = setInterval(burst, GLITCH_REPEAT_MS);
  };

  const handleLeave = () => {
    if (repeatTimer.current) clearInterval(repeatTimer.current);
    if (burstTimer.current) clearTimeout(burstTimer.current);
    repeatTimer.current = null;
    setGlitching(false);
  };

  useEffect(() => {
    return () => {
      if (repeatTimer.current) clearInterval(repeatTimer.current);
      if (burstTimer.current) clearTimeout(burstTimer.current);
    };
  }, []);

  return (
    <motion.button
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        cyber-btn relative group inline-flex items-center justify-center
        px-5 py-0 min-h-[2.125rem] font-mono font-bold tracking-wider text-xs uppercase
        transition-all duration-200 border overflow-hidden select-none
        ${scrolled
          ? "shadow-[0_0_20px_rgba(0,255,255,0.35)] hover:shadow-[0_0_32px_rgba(0,255,255,0.6)]"
          : "shadow-none"
        }
        ${
          scrolled
            ? isLight
              ? "bg-gradient-to-b from-white to-cyan-50/90 text-slate-800 border-cyan-300/70"
              : "bg-gradient-to-b from-slate-900/95 to-slate-950/95 text-cyan-300 border-cyan-500/40"
            : isLight
              ? "bg-gradient-to-b from-white/85 to-cyan-50/70 text-slate-800 border-cyan-200/60"
              : "bg-gradient-to-b from-slate-900/75 to-slate-950/80 text-cyan-300/95 border-cyan-500/25"
        }
      `}
    >
      <span className="cyber-btn-corner cyber-btn-corner-tl" aria-hidden="true" />
      <span className="cyber-btn-corner cyber-btn-corner-tr" aria-hidden="true" />
      <span className="cyber-btn-corner cyber-btn-corner-bl" aria-hidden="true" />
      <span className="cyber-btn-corner cyber-btn-corner-br" aria-hidden="true" />

      <span
        className={`cyber-btn-text relative z-20 ${glitching ? 'cyber-btn-glitch-hover' : ''}`}
        data-text={typeof children === 'string' ? children : undefined}
      >
        {children}
      </span>

      <span className={`cyber-glitch ${glitching ? 'cyber-glitch-hover' : ''}`} aria-hidden="true" />
      <span className={`cyber-btn-scanline ${glitching ? 'cyber-btn-scanline-hover' : ''}`} aria-hidden="true" />
    </motion.button>
  );
}
