import { motion, AnimatePresence } from "framer-motion"
import { useEffect } from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"
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
      platform: "API Katmanı",
      about: "Hakkımızda",
      contact: "İletişim",
      mode: "Mod"
      ,
      light: "Açık",
      dark: "Koyu"
    },
    en: {
      home: "Home",
      products: "Products",
      platform: "API Layer",
      about: "About",
      contact: "Contact",
      mode: "Mode",
      light: "Light",
      dark: "Dark"
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
          className="
            fixed inset-0 
            bg-black/40 
            backdrop-blur-md 
            backdrop-saturate-150 
            z-[999999]
          "
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            className={`absolute top-16 mx-auto left-0 right-0 w-[92%] rounded-3xl border border-cyan-400/20 backdrop-blur-xl p-4 space-y-3 shadow-xl relative ${
              isLight
                ? "bg-gradient-to-br from-white/90 via-cyan-100/80 to-white/90"
                : "bg-gradient-to-br from-slate-900/80 via-purple-900/60 to-slate-900/80"
            }`}
          >

            {/* X */}
            <button
              onClick={onClose}
              className={`absolute -top-4 -right-4 h-10 w-10 flex items-center justify-center rounded-full border transition backdrop-blur-md z-10 hover:text-red-400 ${
                isLight
                  ? "bg-slate-200 hover:bg-slate-300 border-slate-300 text-slate-700"
                  : "bg-white/10 hover:bg-white/20 border-white/20 text-white/80"
              }`}
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-2">
              <select
                value={language}
                onChange={(e) => onLanguageChange(e.target.value as Language)}
                className={`w-1/2 rounded-xl border px-3 py-2 text-sm ${
                  isLight
                    ? "bg-white text-slate-800 border-cyan-200"
                    : "bg-slate-900/80 text-white border-cyan-500/30"
                }`}
              >
                <option value="tr">TR</option>
                <option value="en">EN</option>
              </select>
              <button
                onClick={onThemeToggle}
                className={`w-1/2 rounded-xl border px-3 py-2 text-sm font-medium transition ${
                  isLight
                    ? "bg-white text-slate-800 border-cyan-200 hover:bg-slate-100"
                    : "bg-slate-900/80 text-cyan-200 border-cyan-500/30 hover:bg-slate-800"
                }`}
              >
                {labels.mode}: {isLight ? labels.light : labels.dark}
              </button>
            </div>

            {/* MENU BUTTON */}
            {[
              { id: 'home', text: labels.home },
              { id: 'products', text: labels.products },
              { id: 'platform', text: labels.platform },
              { id: 'about', text: labels.about },
              { id: 'contact', text: labels.contact },
            ].map((item, idx) => (
              <button
                key={idx}
                onClick={() => go(item.id)}
                className={`relative overflow-hidden w-full px-5 py-3 rounded-xl text-left transition-all duration-200 active:scale-[0.97] active:shadow-[0_0_12px_rgba(255,255,255,0.2)] ${
                  isLight
                    ? "bg-slate-200 text-slate-800 hover:bg-slate-300 active:bg-slate-400"
                    : "bg-white/10 text-white hover:bg-white/20 active:bg-white/30"
                }`}
              >
                {/* RIPPLE */}
                <span
                  className="
                    absolute inset-0 opacity-0
                    active:animate-[pulse_0.4s_ease-out]
                    rounded-xl
                    bg-white/40
                  "
                ></span>

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
