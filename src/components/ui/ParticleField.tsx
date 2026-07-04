import { motion } from 'framer-motion'

type Props = { count?: number }

export default function ParticleField({ count = 30 }: Props) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className={`absolute rounded-full ${i % 3 === 0 ? 'w-3 h-3 bg-cyan-400/40' : i % 3 === 1 ? 'w-2 h-2 bg-purple-400/30' : 'w-1 h-1 bg-pink-400/50'}`}
          animate={{ x: [0, Math.random() * 200 - 100, 0], y: [0, Math.random() * 200 - 100, 0], opacity: [0, 1, 0], scale: [0, 1, 0], rotate: [0, 360] }}
          transition={{ duration: 4 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 3, ease: 'easeInOut' }}
          style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
        />
      ))}
    </div>
  )
}
