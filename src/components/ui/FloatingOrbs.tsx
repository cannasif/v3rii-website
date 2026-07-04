import { motion } from 'framer-motion'

export default function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 left-1/4 w-20 h-20 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full opacity-20 blur-xl"
      />
      <motion.div
        animate={{ y: [0, 20, 0], rotate: [0, -5, 0], scale: [1, 0.9, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute top-1/3 right-1/4 w-32 h-32 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-15 blur-xl"
      />
    </div>
  )
}

