import { AnimatePresence, motion } from 'framer-motion'
import { ChevronUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { Language, Theme } from '../../App'

type Props = {
  language: Language
  theme: Theme
}

const CYBER_CLIP = 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)'

export default function ScrollToTopButton({ language, theme }: Props) {
  const [visible, setVisible] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const isLight = theme === 'light'

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 380)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Chatbot veya ürün modalı açıkken buton gizlenir
  useEffect(() => {
    const onChatToggle = (event: Event) => {
      setChatOpen(Boolean((event as CustomEvent<{ open: boolean }>).detail?.open))
    }
    const onModalToggle = (event: Event) => {
      setModalOpen(Boolean((event as CustomEvent<{ open: boolean }>).detail?.open))
    }
    window.addEventListener('v3rii-chat-toggle', onChatToggle)
    window.addEventListener('v3rii-product-modal-toggle', onModalToggle)
    return () => {
      window.removeEventListener('v3rii-chat-toggle', onChatToggle)
      window.removeEventListener('v3rii-product-modal-toggle', onModalToggle)
    }
  }, [])

  const label = language === 'tr' ? 'Yukarı Çık' : 'Back to Top'

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <AnimatePresence>
      {visible && !chatOpen && !modalOpen && (
        <motion.button
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.95 }}
          transition={{ duration: 0.25 }}
          onClick={scrollTop}
          aria-label={label}
          title={label}
          style={{ clipPath: CYBER_CLIP }}
          className={`group fixed bottom-24 right-4 z-[96] overflow-hidden border px-3.5 py-2.5 backdrop-blur-xl transition-all duration-300 sm:bottom-28 sm:right-7 ${
            isLight
              ? 'border-pink-500/50 bg-white/85 text-pink-700 shadow-[0_0_18px_rgba(219,39,119,0.35)] hover:shadow-[0_0_28px_rgba(219,39,119,0.5)]'
              : 'border-pink-500/45 bg-[#0a0f1a]/85 text-pink-400 shadow-[0_0_18px_rgba(219,39,119,0.3)] hover:border-pink-400/70 hover:shadow-[0_0_30px_rgba(219,39,119,0.5)]'
          }`}
        >
          {/* Tarama çizgileri */}
          <span
            className="pointer-events-none absolute inset-0 opacity-25"
            style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(34,211,238,0.18) 3px, rgba(34,211,238,0.18) 4px)' }}
          />
          {/* Hover ışık süpürmesi */}
          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          {/* Köşe aksanları */}
          <span className="pointer-events-none absolute right-0 top-0 h-2 w-2 border-r border-t border-cyan-400/70" />
          <span className="pointer-events-none absolute bottom-0 left-0 h-2 w-2 border-b border-l border-cyan-400/70" />

          <span className="relative flex items-center gap-1.5 font-cyber text-[10px] font-bold uppercase tracking-[0.2em] sm:text-[11px]">
            <ChevronUp className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
            <span className="hidden sm:inline">{label}</span>
            <span className="hidden animate-pulse text-cyan-400 sm:inline">_</span>
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
