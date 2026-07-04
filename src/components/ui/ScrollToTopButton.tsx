import { AnimatePresence, motion } from 'framer-motion'
import { ChevronUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { Language, Theme } from '../../App'

type Props = {
  language: Language
  theme: Theme
}

export default function ScrollToTopButton({ language, theme }: Props) {
  const [visible, setVisible] = useState(false)
  const isLight = theme === 'light'

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 380)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const label = language === 'tr' ? 'Yukarı Çık' : 'Back to Top'

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.95 }}
          transition={{ duration: 0.25 }}
          onClick={scrollTop}
          aria-label={label}
          title={label}
          className={`fixed bottom-6 right-5 sm:bottom-8 sm:right-8 z-[90] rounded-full border px-3 py-3 backdrop-blur-xl transition-all duration-300 ${
            isLight
              ? 'bg-white/80 text-fuchsia-700 border-fuchsia-400/60 shadow-[0_0_18px_rgba(217,70,239,0.4)] hover:shadow-[0_0_28px_rgba(34,211,238,0.55)]'
              : 'bg-slate-900/75 text-cyan-300 border-cyan-400/45 shadow-[0_0_18px_rgba(34,211,238,0.35)] hover:shadow-[0_0_28px_rgba(236,72,153,0.45)]'
          }`}
        >
          <span className="absolute inset-0 rounded-full bg-[linear-gradient(120deg,transparent_20%,rgba(255,255,255,0.28)_50%,transparent_80%)] -translate-x-full hover:translate-x-full transition-transform duration-700" />
          <span className="relative flex items-center gap-1 text-xs sm:text-sm font-semibold font-mono">
            <ChevronUp className="h-4 w-4" />
            <span className="hidden sm:inline">{label}</span>
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
