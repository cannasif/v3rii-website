import { Instagram, Facebook, Linkedin, Twitter } from "lucide-react"
import type { Language, Theme } from "../../App"

type Props = {
  language: Language
  theme: Theme
}

export default function Footer({ language, theme }: Props) {
  const isLight = theme === "light"
  const text = {
    tr: "Tüm Hakları Saklıdır",
    en: "All Rights Reserved"
  }[language]

  return (
    <footer className={`mt-20 py-12 border-t ${isLight ? "bg-gradient-to-r from-cyan-50/90 to-fuchsia-50/90 border-cyan-200/60" : "bg-gradient-to-r from-slate-900/60 to-purple-900/60 border-white/10"}`}>
      <div className="max-w-7xl mx-auto px-6">

        {/* ICONS */}
        <div className="flex justify-center gap-6 mb-6">
          {[
            { icon: Instagram, url: "https://instagram.com" },
            { icon: Facebook, url: "https://facebook.com" },
            { icon: Linkedin, url: "https://linkedin.com" },
            { icon: Twitter,  url: "https://x.com" }
          ].map(({ icon: Icon, url }, idx) => (
            <a
              key={idx}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative w-12 h-12 flex items-center justify-center rounded-full border transition-all duration-300 hover:border-cyan-400/40 hover:shadow-[0_0_15px_rgba(34,211,238,0.5)] hover:scale-110 ${isLight ? "border-cyan-300/60 bg-white/70" : "border-white/10"}`}
            >
              {/* Glow ring */}
              <span className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/0 to-purple-500/0 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500" />

              <Icon className={`w-6 h-6 group-hover:text-cyan-400 transition-colors duration-300 ${isLight ? "text-slate-700" : "text-gray-300"}`} />
            </a>
          ))}
        </div>

        {/* COPYRIGHT */}
        <div className={`text-center text-sm tracking-wide ${isLight ? "text-slate-600" : "text-gray-400"}`}>
          © 2025 V3Rİİ • {text}
        </div>
      </div>
    </footer>
  )
}
