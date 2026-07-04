import { motion } from 'framer-motion'
import AnimatedButton from '../ui/AnimatedButton'
import FloatingOrbs from '../ui/FloatingOrbs'
import ParticleField from '../ui/ParticleField'
import { fadeInUp, staggerContainer } from '../../utils/animations'
import { useScrollToSection } from '../../hooks/useScrollToSection'
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

  const content = {
    tr: {
      title1: 'Geleceğin',
      title2: 'Yazılım Çözümleri',
      description:
        'İşletmenizi dijital dönüşümde öne çıkaracak, AI destekli ve gelecek odaklı yazılım çözümleri geliştiriyoruz.',
      discover: 'Ürünleri Keşfet',
      demo: 'Demo İzle'
    },
    en: {
      title1: 'Future-Ready',
      title2: 'Software Solutions',
      description:
        'We build AI-powered and future-focused software solutions to accelerate your digital transformation.',
      discover: 'Explore Products',
      demo: 'Watch Demo'
    }
  }[language]

  return (
    <section id="home" className="pt-20 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          className={`text-center rounded-[28px] px-4 sm:px-10 py-12 border-l-2 border-r-2 backdrop-blur-xl ${
            isLight ? 'bg-white/65 border-cyan-400/45' : 'bg-white/[0.02] border-purple-500/35'
          }`}
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.h1
            variants={fadeInUp}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 relative"
          >
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                {content.title1}
              </span>
            </span>
            <br />
            <span className="relative inline-block">
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

        <FloatingOrbs />
        {!isLight && <ParticleField count={30} />}
      </div>

      <VideoModal
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        videoUrl={demoVideo}
      />
    </section>
  )
}