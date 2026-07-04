import { motion, AnimatePresence } from 'framer-motion'
import { Globe, Menu, Moon, Sun, X, ChevronDown } from 'lucide-react' // ChevronDown eklendi
import { useState, useEffect } from 'react'
import MobileMenu from './MobileMenu'
import { useScrollToSection } from '../../hooks/useScrollToSection'
import CyberButton from '../ui/CyberButton'
import logoImage from '../../assets/logo-20260329.png'
import type { Language, Theme } from '../../App'

type Props = {
  language: Language
  onLanguageChange: (language: Language) => void
  theme: Theme
  onThemeToggle: () => void
}

export default function Navbar({ language, onLanguageChange, theme, onThemeToggle }: Props) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false) // Özel dil menüsü için state
  
  const scrollToSection = useScrollToSection(80)
  const isLight = theme === 'light'
  const navText = {
    tr: { home: 'Ana Sayfa', products: 'Ürünler', about: 'Hakkımızda', contact: 'İletişim' },
    en: { home: 'Home', products: 'Products', about: 'About', contact: 'Contact' }
  }[language]

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) setScrolled(true)
      else setScrolled(false)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-500
        ${scrolled ? (isLight ? 'bg-white/80 backdrop-blur-xl border-b border-cyan-200/60' : 'bg-slate-900/60 backdrop-blur-xl') : 'bg-transparent'}
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
        <div className="relative flex items-center justify-between">

          {/* LEFT BUTTONS */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="hidden lg:flex space-x-3"
          >
            <CyberButton scrolled={scrolled} theme={theme} onClick={() => scrollToSection('home')}>
              {navText.home}
            </CyberButton>

            <CyberButton scrolled={scrolled} theme={theme} onClick={() => scrollToSection('products')}>
              {navText.products}
            </CyberButton>
          </motion.div>

          {/* LOGO */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.04, y: -2 }}
            className="logo-hover-fx absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
          >
            <img
              src={logoImage}
              alt="V3RII Logo"
              className="logo-hover-image h-36 sm:h-40 lg:h-48 xl:h-56 object-contain"
            />
            <img src={logoImage} alt="" aria-hidden="true" className="logo-glitch-layer logo-glitch-cyan absolute inset-0 h-full w-full object-contain" />
            <img src={logoImage} alt="" aria-hidden="true" className="logo-glitch-layer logo-glitch-red absolute inset-0 h-full w-full object-contain" />
          </motion.div>

          {/* RIGHT SIDE */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="hidden lg:flex items-center gap-3 lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2"
          >
            <CyberButton scrolled={scrolled} theme={theme} onClick={() => scrollToSection('about')}>
              {navText.about}
            </CyberButton>

            <CyberButton scrolled={scrolled} theme={theme} onClick={() => scrollToSection('contact')}>
              {navText.contact}
            </CyberButton>

            {/* --- ÖZEL TASARIM DİL SEÇİCİ --- */}
            <div className="relative">
              {/* Menü açıkken dışarı tıklanırsa kapanması için görünmez alan */}
              {isLangMenuOpen && (
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsLangMenuOpen(false)} 
                />
              )}
              
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className={`relative z-50 flex items-center gap-2 rounded-xl border px-3 py-2 transition-all duration-300 ${
                  isLight 
                    ? 'bg-white border-cyan-200 text-slate-700 hover:bg-slate-50' 
                    : 'bg-slate-900/70 border-cyan-500/30 text-cyan-200 hover:bg-slate-800 hover:border-cyan-400/50 hover:shadow-[0_0_10px_rgba(34,211,238,0.2)]'
                }`}
              >
                <Globe size={16} className={isLangMenuOpen ? "text-cyan-400" : ""} />
                <span className="text-sm font-bold uppercase tracking-wider">{language}</span>
                <ChevronDown size={14} className={`transition-transform duration-300 ${isLangMenuOpen ? 'rotate-180 text-cyan-400' : ''}`} />
              </button>

              <AnimatePresence>
                {isLangMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className={`absolute top-full right-0 mt-2 w-24 rounded-xl border overflow-hidden shadow-xl z-50 ${
                      isLight 
                        ? 'bg-white border-cyan-200' 
                        : 'bg-[#0a0f1a]/95 backdrop-blur-md border-cyan-500/30 shadow-[0_0_15px_rgba(0,255,255,0.1)]'
                    }`}
                  >
                    {['tr', 'en'].map((lang) => (
                      <button
                        key={lang}
                        onClick={() => {
                          onLanguageChange(lang as Language);
                          setIsLangMenuOpen(false); // Seçimden sonra menüyü kapat
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm uppercase tracking-wider transition-colors duration-200 flex items-center gap-2 ${
                          language === lang 
                            ? (isLight ? 'bg-cyan-50 text-cyan-700 font-bold' : 'bg-cyan-500/20 text-cyan-400 font-bold border-l-2 border-cyan-400') 
                            : (isLight ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-300 hover:bg-slate-800 hover:text-cyan-200 border-l-2 border-transparent')
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {/* --- ÖZEL TASARIM DİL SEÇİCİ BİTTİ --- */}

            <button
              onClick={onThemeToggle}
              className={`rounded-xl border p-2 transition ${isLight ? 'bg-white border-cyan-200 text-slate-700 hover:bg-slate-100' : 'bg-slate-900/70 border-cyan-500/30 text-cyan-200 hover:bg-slate-800'}`}
              aria-label="Toggle theme"
            >
              {isLight ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </motion.div>

          {/* MOBILE MENU BUTTON */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden p-2 ${isLight ? 'text-slate-800' : 'text-white/90'}`}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>

        </div>

        {/* MOBILE MENU */}
        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          scrollToSection={scrollToSection}
          language={language}
          theme={theme}
          onLanguageChange={onLanguageChange}
          onThemeToggle={onThemeToggle}
        />

      </div>
    </nav>
  )
}