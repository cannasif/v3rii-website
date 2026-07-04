import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { useState } from 'react'

type Props = {
  label: string
  onClick?: () => void
  variant?: 'primary' | 'outline'
  theme?: 'dark' | 'light'
}

export default function AnimatedButton({ label, onClick, variant = 'primary', theme = 'dark' }: Props) {
  const [hover, setHover] = useState(false)
  const isLight = theme === 'light'

  if (variant === 'outline') {
    return (
      <motion.button
        whileHover={{ scale: 1.05, backgroundColor: '#8b5cf6', color: '#ffffff', boxShadow: '0 15px 30px -10px rgba(139, 92, 246, 0.4)' }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={`border px-8 py-4 rounded-full font-semibold transition-all duration-300 relative overflow-hidden group ring-1 ring-purple-400/30 shadow-[0_0_18px_rgba(139,92,246,0.35)] font-mono font-bold tracking-tight ${
          isLight ? 'border-fuchsia-600 text-fuchsia-700 bg-white/80' : 'border-purple-400 text-purple-400'
        }`}
      >
        <span className="relative z-10">{label}</span>
        <div className="absolute inset-0 bg-purple-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
      </motion.button>
    )
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05, boxShadow: '0 20px 40px -12px rgba(139, 92, 246, 0.4)', background: 'linear-gradient(45deg, #06b6d4, #8b5cf6, #06b6d4)' }}
      whileTap={{ scale: 0.95 }}
      animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
      transition={{ backgroundPosition: { duration: 3, repeat: Infinity, ease: 'linear' } }}
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      onClick={onClick}
      className={`bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 flex items-center gap-2 relative overflow-hidden group shadow-[0_0_20px_rgba(139,92,246,0.35)] font-mono font-bold tracking-tight ${
        isLight ? 'ring-1 ring-cyan-600/40' : 'ring-1 ring-cyan-400/30'
      }`}
      style={{ backgroundSize: '200% 200%' }}
    >
      <span className="relative z-10 flex items-center gap-2">
        {label}
        <ChevronRight className="w-5 h-5" />
      </span>

      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

      <motion.span className="absolute -top-1 left-4 w-10 h-[2px] bg-cyan-400/70" style={{ filter: 'drop-shadow(0 0 8px rgba(6,182,212,0.8))' }} animate={hover ? { x: [0, 2, -2, 0], opacity: [0.2, 0.9, 0.4, 0.7] } : { opacity: 0 }} transition={{ duration: 0.4, repeat: hover ? Infinity : 0 }} />
      <motion.span className="absolute -bottom-1 right-6 w-8 h-[2px] bg-fuchsia-500/70" style={{ filter: 'drop-shadow(0 0 8px rgba(236,72,153,0.8))', transform: 'rotate(-8deg)' }} animate={hover ? { y: [0, -2, 2, 0], opacity: [0.2, 0.9, 0.4, 0.7] } : { opacity: 0 }} transition={{ duration: 0.45, repeat: hover ? Infinity : 0 }} />
      <motion.span className="absolute top-2 -right-1 w-6 h-[2px] bg-cyan-300/80" style={{ filter: 'drop-shadow(0 0 10px rgba(6,182,212,1))', transform: 'rotate(20deg)' }} animate={hover ? { x: [0, -2, 2, 0], opacity: [0.1, 0.8, 0.3, 0.6] } : { opacity: 0 }} transition={{ duration: 0.35, repeat: hover ? Infinity : 0 }} />
      <motion.span className="absolute -top-2 right-1/3 w-12 h-[2px] bg-purple-400/70" style={{ filter: 'drop-shadow(0 0 10px rgba(168,85,247,1))', transform: 'rotate(-15deg)' }} animate={hover ? { y: [0, 2, -2, 0], opacity: [0.15, 0.85, 0.35, 0.65] } : { opacity: 0 }} transition={{ duration: 0.5, repeat: hover ? Infinity : 0 }} />
    </motion.button>
  )
}
