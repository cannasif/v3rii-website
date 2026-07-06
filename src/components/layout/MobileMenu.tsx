import { motion, AnimatePresence } from "framer-motion"
import { useEffect } from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"
import CyberLangToggle from "../ui/CyberLangToggle"
import CyberPowerSwitch from "../ui/CyberPowerSwitch"
import type { Language, Theme } from "../../App"

type Props = {
  isOpen: boolean
  onClose: () => void
  scrollToSection: (id: string) => void
  language: Language
  theme: Theme
  onLanguageChange: (language: Language) => void
  onThemeToggle: () => void
}

export default function MobileMenu({
  isOpen,
  onClose,
  scrollToSection,
  language,
  theme,
  onLanguageChange,
  onThemeToggle
}: Props) {
  const isLight = theme === "light"
  const labels = {
    tr: {
      home: "Ana Sayfa",
      products: "Ürünler",
      about: "Hakkımızda",
      contact: "İletişim",
    },
    en: {
      home: "Home",
      products: "Products",
      about: "About",
      contact: "Contact",
    }
  }[language]

  const go = (id: string) => {
    onClose()
    setTimeout(() => scrollToSection(id), 250)
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
      document.documentElement.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
      document.documentElement.style.overflow = "auto"
    }
  }, [isOpen])

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-md backdrop-saturate-150 z-[999999]"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            className={`absolute top-20 mx-auto left-0 right-0 w-[92%] border border-cyan-400/25 backdrop-blur-xl p-4 space-y-3 shadow-xl relative ${
              isLight
                ? "bg-gradient-to-br from-white/95 via-cyan-50/90 to-white/95"
                : "bg-gradient-to-br from-slate-900/95 via-slate-950/90 to-slate-900/95"
            }`}
            style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))' }}
          >
            {/* Üst şerit: solda LANG + IŞIK, sağda kapatma butonu */}
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-cyan-500/15">
              <div className="flex items-center gap-4">
                <CyberLangToggle
                  language={language}
                  onLanguageChange={onLanguageChange}
                  theme={theme}
                />
                <CyberPowerSwitch theme={theme} language={language} onToggle={onThemeToggle} />
              </div>

              <button
                onClick={onClose}
                className={`h-9 w-9 flex-shrink-0 flex items-center justify-center border transition hover:text-red-400 ${
                  isLight
                    ? "bg-slate-200 hover:bg-slate-300 border-slate-300 text-slate-700"
                    : "bg-slate-900/90 hover:bg-slate-800 border-cyan-500/30 text-cyan-200"
                }`}
                style={{ clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))' }}
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            {[
              { id: 'home', text: labels.home },
              { id: 'products', text: labels.products },
              { id: 'about', text: labels.about },
              { id: 'contact', text: labels.contact },
            ].map((item, idx) => (
              <button
                key={idx}
                onClick={() => go(item.id)}
                className={`relative overflow-hidden w-full px-5 py-3 text-left font-mono text-sm uppercase tracking-widest transition-all duration-200 active:scale-[0.98] ${
                  isLight
                    ? "bg-slate-100 text-slate-800 hover:bg-slate-200 border border-cyan-200/60"
                    : "bg-slate-900/60 text-cyan-200 hover:bg-slate-800/80 border border-cyan-500/20"
                }`}
                style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' }}
              >
                <span className="text-cyan-500/50 mr-2">{`>`}</span>
                {item.text}
              </button>
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
