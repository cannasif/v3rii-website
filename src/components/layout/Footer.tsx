import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Facebook, Instagram, Linkedin, TerminalSquare } from "lucide-react"
import type { Language, Theme } from "../../App"

type Props = {
  language: Language
  theme: Theme
}

// Lucide'da X (Twitter) marka ikonu yok; küçük özel SVG
function XLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  )
}

export default function Footer({ language, theme }: Props) {
  const isLight = theme === "light"
  const [toastVisible, setToastVisible] = useState(false)
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const text = {
    tr: {
      rights: "Tüm Hakları Saklıdır",
      statusLine: ">_ SYS.LINK // SOSYAL KANALLAR",
      comingSoon: "BU KANAL ÇOK YAKINDA AKTİF..."
    },
    en: {
      rights: "All Rights Reserved",
      statusLine: ">_ SYS.LINK // SOCIAL CHANNELS",
      comingSoon: "THIS CHANNEL IS COMING SOON..."
    }
  }[language]

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    }
  }, [])

  const showComingSoon = () => {
    setToastVisible(true)
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    toastTimerRef.current = setTimeout(() => setToastVisible(false), 3200)
  }

  // Her kanalın kendi hover rengi
  const socials = [
    {
      label: "Instagram",
      icon: <Instagram className="h-5 w-5" />,
      url: "https://www.instagram.com/v3riiteknoloji/",
      hoverBox: "hover:border-fuchsia-500/70 hover:shadow-[0_0_18px_rgba(217,70,239,0.4)]",
      hoverIcon: "group-hover:text-fuchsia-400",
      sweep: "via-fuchsia-400/15"
    },
    {
      label: "LinkedIn",
      icon: <Linkedin className="h-5 w-5" />,
      url: "https://www.linkedin.com/company/v3ri%CC%87i%CC%87-teknoloji%CC%87/",
      hoverBox: "hover:border-sky-500/70 hover:shadow-[0_0_18px_rgba(14,165,233,0.4)]",
      hoverIcon: "group-hover:text-sky-400",
      sweep: "via-sky-400/15"
    },
    {
      label: "X",
      icon: <XLogo className="h-4.5 w-4.5" />,
      url: null, // hesap henüz yok
      hoverBox: "hover:border-amber-400/70 hover:shadow-[0_0_18px_rgba(251,191,36,0.4)]",
      hoverIcon: "group-hover:text-amber-300",
      sweep: "via-amber-400/15"
    },
    {
      label: "Facebook",
      icon: <Facebook className="h-5 w-5" />,
      url: null, // hesap henüz yok
      hoverBox: "hover:border-teal-400/70 hover:shadow-[0_0_18px_rgba(45,212,191,0.4)]",
      hoverIcon: "group-hover:text-teal-300",
      sweep: "via-teal-400/15"
    }
  ]

  return (
    <footer
      className={`relative mt-20 overflow-hidden border-t font-modern ${
        isLight
          ? "border-teal-600/30 bg-white/70"
          : "border-teal-400/25 bg-[#0a0f1a]/80"
      }`}
    >
      <div className="cyber-panel-scanline" />
      {/* Üst kenarda neon çizgi */}
      <div className="absolute top-0 left-1/2 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-teal-400/60 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        {/* Terminal satırı */}
        <div className={`mb-6 text-center font-cyber text-[9px] sm:text-[10px] tracking-[0.3em] uppercase ${isLight ? "text-teal-700" : "text-teal-300/80"}`}>
          {text.statusLine}
          <span className="cyber-caret">▊</span>
        </div>

        {/* SOSYAL İKONLAR */}
        <div className="flex justify-center gap-4 sm:gap-5 mb-7">
          {socials.map((social) => {
            const inner = (
              <>
                <span className={`pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent ${social.sweep} to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700`} />
                <span className={`relative transition-colors duration-300 ${social.hoverIcon} ${isLight ? "text-slate-700" : "text-gray-300"}`}>
                  {social.icon}
                </span>
              </>
            )

            const classes = `group relative grid h-11 w-11 sm:h-12 sm:w-12 place-items-center overflow-hidden border transition-all duration-300 ${social.hoverBox} ${
              isLight ? "border-teal-600/30 bg-white/80" : "border-teal-400/25 bg-white/[0.03]"
            }`
            const clip = { clipPath: "polygon(18% 0, 100% 0, 100% 82%, 82% 100%, 0 100%, 0 18%)" }

            return social.url ? (
              <a
                key={social.label}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className={classes}
                style={clip}
              >
                {inner}
              </a>
            ) : (
              <button
                key={social.label}
                type="button"
                onClick={showComingSoon}
                aria-label={`${social.label} (yakında)`}
                className={classes}
                style={clip}
              >
                {inner}
              </button>
            )
          })}
        </div>

        {/* COPYRIGHT */}
        <div className={`text-center font-cyber text-[10px] sm:text-[11px] tracking-[0.25em] uppercase ${isLight ? "text-slate-600" : "text-gray-500"}`}>
          © 2025 V3RII • {text.rights}
        </div>
      </div>

      {/* ÇOK YAKINDA TERMİNAL BİLDİRİMİ (sağ alt) */}
      <AnimatePresence>
        {toastVisible && (
          <motion.div
            initial={{ opacity: 0, y: 24, x: 12 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.25 }}
            className={`fixed bottom-6 right-6 z-[120] flex items-center gap-3 border px-4 py-3 backdrop-blur-md shadow-[0_0_30px_rgba(45,212,191,0.2)] ${
              isLight ? "bg-white/95 border-teal-600/40" : "bg-[#0a0f1a]/95 border-teal-400/40"
            }`}
            style={{ clipPath: "polygon(6% 0, 100% 0, 100% 70%, 94% 100%, 0 100%, 0 30%)" }}
          >
            <TerminalSquare className="h-4 w-4 shrink-0 text-teal-400" />
            <span className={`font-cyber text-[10px] sm:text-[11px] tracking-[0.2em] uppercase ${isLight ? "text-slate-800" : "text-teal-200"}`}>
              <span className="text-pink-500 mr-1.5">{">"}</span>
              {text.comingSoon}
              <span className="cyber-caret">▊</span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  )
}
