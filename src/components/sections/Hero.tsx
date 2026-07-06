import { motion } from 'framer-motion'
import AnimatedButton from '../ui/AnimatedButton'
import { fadeInUp, staggerContainer } from '../../utils/animations'
import { useScrollToSection } from '../../hooks/useScrollToSection'
import { useGlitchPulse } from '../../hooks/useGlitchPulse'
import { useState } from 'react'
import VideoModal from '../ui/VideoModal'
import type { Language, Theme } from '../../App'

// DOĞRU İSİM: veri-tanitim.mp4 (Tire eklendi)
import demoVideo from '../../assets/veri-tanitim.mp4'

type Props = {
  language: Language
  theme: Theme
}

export default function Hero({ language, theme }: Props) {
  const scrollToSection = useScrollToSection(80)
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const isLight = theme === 'light'
  // 20 saniyede bir tüm hero kartı glitch yapar
  const cardGlitch = useGlitchPulse(20000, 550)

  const content = {
    tr: {
      // Font (Bruno Ace SC) harfleri büyük gösterdiği için Türkçe İ/ı doğru çıksın diye
      // başlıklar elle büyük harf yazılıyor (otomatik uppercase İ'yi I yapar)
      title1: 'GELECEĞİN',
      title2: 'YAZILIM ÇÖZÜMLERİ',
      description:
        'Yapay zeka destekli sistemlerle iş süreçlerinizi otomatikleştiriyor, verinizi değere dönüştürüyoruz. Geleceğin teknolojisi, bugünden işletmenizde.',
      discover: 'Ürünleri Keşfet',
      demo: 'Demo İzle'
    },
    en: {
      title1: 'Future-Ready',
      title2: 'Software Solutions',
      description:
        'We automate your workflows with AI-powered systems and turn your data into value — bringing tomorrow\'s technology to your business today.',
      discover: 'Explore Products',
      demo: 'Watch Demo'
    }
  }[language]

  return (
    <section id="home" className="pt-28 sm:pt-32 lg:pt-36 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Karıncalanma (statik parazit) efekti — uçuşan baloncukların yerine */}
      <div className="cyber-noise" aria-hidden="true" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          className={`relative text-center px-4 sm:px-10 py-12 border backdrop-blur-xl overflow-hidden ${
            isLight ? 'bg-white/65 border-cyan-400/45' : 'bg-white/[0.02] border-cyan-500/20'
          } ${cardGlitch ? 'cyber-card-glitch-active' : ''}`}
          style={{ clipPath: 'polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 22px 100%, 0 calc(100% - 22px))' }}
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {/* Terminal köşe çerçeveleri */}
          <span className="cyber-frame-corner cyber-frame-corner-tl" aria-hidden="true" />
          <span className="cyber-frame-corner cyber-frame-corner-tr" aria-hidden="true" />
          <span className="cyber-frame-corner cyber-frame-corner-bl" aria-hidden="true" />
          <span className="cyber-frame-corner cyber-frame-corner-br" aria-hidden="true" />

          {/* Scanline dokusu */}
          <div className="cyber-panel-scanline" aria-hidden="true" />

          {/* Terminal başlık satırı */}
          <motion.div
            variants={fadeInUp}
            className={`font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase mb-6 flex items-center justify-center gap-2 ${
              isLight ? 'text-cyan-700/80' : 'text-cyan-400/70'
            }`}
          >
            <span className="text-pink-500">{'>_'}</span>
            <span>SYS.BOOT // V3RII</span>
            <span className="cyber-caret" aria-hidden="true">▊</span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="font-cyber text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 relative tracking-wide"
          >
            <span className="relative inline-block">
              {/* Logo renkleri: magenta → turuncu → altın sarısı */}
              <span className="bg-gradient-to-r from-pink-500 via-orange-400 to-amber-400 bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(236,72,153,0.35)]">
                {content.title1}
              </span>
            </span>
            <br />
            <span className="relative inline-block mt-2">
              <span className={isLight ? 'text-slate-900' : 'text-white'}>{content.title2}</span>
            </span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className={`text-base sm:text-lg md:text-xl mb-8 max-w-3xl mx-auto ${
              isLight ? 'text-slate-700' : 'text-gray-300'
            }`}
          >
            {content.description}
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center items-center"
          >
            <AnimatedButton
              label={content.discover}
              theme={theme}
              onClick={() => scrollToSection('products')}
            />

            <AnimatedButton
              label={content.demo}
              variant="outline"
              theme={theme}
              onClick={() => setIsVideoOpen(true)}
            />
          </motion.div>
        </motion.div>
      </div>

      <VideoModal
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        videoUrl={demoVideo}
      />
    </section>
  )
}
