import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import MobileMenu from './MobileMenu'
import { useScrollToSection } from '../../hooks/useScrollToSection'
import CyberButton from '../ui/CyberButton'
import CyberLangToggle from '../ui/CyberLangToggle'
import CyberPowerSwitch from '../ui/CyberPowerSwitch'
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

  const scrollToSection = useScrollToSection(scrolled ? 80 : 120)
  const isLight = theme === 'light'
  const navText = {
    tr: { home: 'Ana Sayfa', products: 'Ürünler', about: 'Hakkımızda', contact: 'İletişim' },
    en: { home: 'Home', products: 'Products', about: 'About', contact: 'Contact' }
  }[language]

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`
        cyber-navbar fixed top-0 left-0 right-0 z-50 transition-all duration-300 pt-1.5
        ${scrolled
          ? isLight ? 'cyber-navbar-scrolled-light' : 'cyber-navbar-scrolled-dark'
          : 'bg-transparent'
        }
      `}
    >
      <div className="cyber-navbar-scanline" aria-hidden="true" />

      <div className="w-full px-4 sm:px-6">
        {/*
          Sabit yükseklikli şerit: logo PNG'sinin şeffaf kenarları satırı şişirmesin diye
          logo absolute olarak satırın ortasına oturur, taşan kısım şeffaf olduğu için görünmez.
        */}
        <div className="hidden lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-3 h-16 lg:h-[4.5rem]">

          <div className="flex items-center gap-2 justify-self-start relative z-10">
            <CyberButton scrolled={scrolled} theme={theme} onClick={() => scrollToSection('home')}>
              {navText.home}
            </CyberButton>
            <CyberButton scrolled={scrolled} theme={theme} onClick={() => scrollToSection('products')}>
              {navText.products}
            </CyberButton>
          </div>

          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="logo-hover-fx relative z-30 h-full w-48 lg:w-56 cursor-pointer bg-transparent border-0 p-0 m-0 justify-self-center"
            onClick={() => scrollToSection('home')}
            aria-label="V3RII Home"
          >
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 block leading-none">
              <img
                src={logoImage}
                alt="V3RII Logo"
                className={`logo-hover-image block w-auto max-w-none object-contain pointer-events-none transition-all duration-300 ${scrolled ? 'h-24 lg:h-28' : 'h-40 lg:h-48'}`}
              />
              <img src={logoImage} alt="" aria-hidden="true" className="logo-glitch-layer logo-glitch-cyan absolute inset-0 h-full w-full object-contain pointer-events-none" />
              <img src={logoImage} alt="" aria-hidden="true" className="logo-glitch-layer logo-glitch-red absolute inset-0 h-full w-full object-contain pointer-events-none" />
            </span>
          </motion.button>

          <div className="flex items-center gap-2 justify-self-end relative z-10">
            <CyberButton scrolled={scrolled} theme={theme} onClick={() => scrollToSection('about')}>
              {navText.about}
            </CyberButton>
            <CyberButton scrolled={scrolled} theme={theme} onClick={() => scrollToSection('contact')}>
              {navText.contact}
            </CyberButton>
            {/* Akış içinde: dar ekranda butonların altına binmez, yer kaplar */}
            <div className="cyber-navbar-controls ml-2">
              <CyberLangToggle language={language} onLanguageChange={onLanguageChange} theme={theme} />
              <span className="cyber-navbar-divider" aria-hidden="true" />
              <CyberPowerSwitch theme={theme} language={language} onToggle={onThemeToggle} />
            </div>
          </div>
        </div>

        {/* Mobile */}
        <div className="flex lg:hidden items-center justify-between h-14">
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            className="logo-hover-fx relative z-30 h-full w-36 cursor-pointer bg-transparent border-0 p-0 m-0"
            onClick={() => scrollToSection('home')}
            aria-label="V3RII Home"
          >
            {/* Sola hizalı: geniş PNG ekranın soluna taşıp kırpılmasın */}
            <span className="absolute left-0 top-1/2 -translate-y-1/2 block leading-none">
              <img
                src={logoImage}
                alt="V3RII Logo"
                className={`logo-hover-image block w-auto max-w-none object-contain pointer-events-none transition-all duration-300 ${scrolled ? 'h-20' : 'h-24'}`}
              />
              <img src={logoImage} alt="" aria-hidden="true" className="logo-glitch-layer logo-glitch-cyan absolute inset-0 h-full w-full object-contain pointer-events-none" />
              <img src={logoImage} alt="" aria-hidden="true" className="logo-glitch-layer logo-glitch-red absolute inset-0 h-full w-full object-contain pointer-events-none" />
            </span>
          </motion.button>

          {/* Mobilde LANG + IŞIK hamburger menüsünün içinde */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`cyber-mobile-toggle relative z-30 p-2 ${isLight ? 'text-slate-800' : 'text-cyan-300'}`}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </motion.button>
        </div>

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
