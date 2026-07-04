import { motion } from 'framer-motion'
import { Activity } from 'lucide-react'
import type { Language, Theme } from '../../App'

type Props = {
  language: Language
  theme: Theme
}

export default function About({ language, theme }: Props) {
  const isLight = theme === 'light'
  const content = {
    tr: {
      title: 'Hakkımızda',
      intro:
        'V3RII Yazılım olarak, 2025’ten bu yana alanının en iyilerinden oluşan mühendislik kadromuz ve son teknoloji yapay zeka, CRM, ERP ve WMS sistemlerimizle; işletmelerin tüm süreçlerini dijitalleştirip hızlandırıyor, verimliliği zirveye taşıyor ve kurumların geleceğin rekabetinde fark yaratan güç olmasını sağlıyoruz.',
      visionTitle: 'Vizyonumuz',
      visionText:
        'Teknolojinin sınırlarını aşarak işletmelerin gerçek potansiyelini açığa çıkaran, geleceği şekillendiren yapay zeka odaklı çözümler geliştirmek. Her projede yenilikçi bakış açımız, mühendislik gücümüz ve kusursuz teknoloji yaklaşımımızla sektöre yön veriyor, işletmelerin dijital dönüşümünde ölçülebilir fark yaratıyoruz.',
      stackTitle: 'Teknoloji Yığınımız',
      build: 'Build_Sequence: 2026_MAR_27',
      visionStats: ['7/24 Teknik Destek', '%99.9 Uptime']
    },
    en: {
      title: 'About',
      intro:
        'At V3RII Software, since 2025 our elite engineering team and advanced AI, CRM, ERP and WMS systems have been helping companies digitize and accelerate operations, maximize efficiency, and gain a competitive edge for the future.',
      visionTitle: 'Our Vision',
      visionText:
        'To build AI-first solutions that unlock real business potential and shape the future. In every project, we lead digital transformation with innovation, strong engineering execution, and measurable outcomes.',
      stackTitle: 'Our Tech Stack',
      build: 'Build_Sequence: 2026_MAR_27',
      visionStats: ['24/7 Technical Support', '99.9% Uptime']
    }
  }[language]
  const techStack = ['React & Next.js', 'Node.js & Python', 'AWS & Azure', 'MongoDB & PostgreSQL', 'Docker & Kubernetes', 'AI/ML Frameworks']

  return (
    <section id="about" className="py-24 relative overflow-hidden bg-transparent font-modern">
      
      {/* ARKA PLAN DEKORASYONU VE RENKLERİ KALDIRILDI - MEVCUT ARKA PLAN KALACAK */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ÜST BÖLÜM: Başlık ve Giriş (Metinler Senin Kodundan, Stil Fütüristik) */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.6 }} 
          className="text-center mb-24"
        >
          <h2 className="text-5xl sm:text-7xl font-bold font-cyber mb-8 tracking-[0.1em]">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 uppercase">
              {content.title}
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto mb-8 shadow-[0_0_10px_rgba(219,39,119,0.5)]" />
          <p className={`max-w-4xl mx-auto text-lg sm:text-xl font-modern leading-relaxed px-4 ${isLight ? 'text-slate-700' : 'text-gray-400'}`}>
            {content.intro}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          
          {/* SOL TARAF: Vizyonumuz (Senin Metinlerin, Marka Renkleriyle) */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-1 bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.6)]" />
              <h3 className={`text-3xl sm:text-4xl font-bold font-cyber uppercase tracking-widest ${isLight ? 'text-slate-900' : 'text-white'}`}>{content.visionTitle}</h3>
            </div>
            
            <p className={`mb-10 leading-relaxed text-base sm:text-lg font-modern ${isLight ? 'text-slate-700' : 'text-gray-400'}`}>
              {content.visionText}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {content.visionStats.map((stat, index) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, x: -20 }} 
                  whileInView={{ opacity: 1, x: 0 }} 
                  viewport={{ once: true }} 
                  transition={{ duration: 0.4, delay: index * 0.1 }} 
                  className="flex items-center gap-4 group cursor-default"
                >
                  {/* Neon Parlamalı Nokta Göstergesi */}
                  <div className="w-3 h-3 rounded-full bg-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.8)] group-hover:scale-125 transition-transform duration-300" />
                  <span className={`font-cyber tracking-widest text-base group-hover:text-pink-400 transition-colors uppercase ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
                    {stat}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* SAĞ TARAF: Teknoloji Yığınımız (Siberpunk Neo-Edge Kart) */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.6, delay: 0.2 }} 
            className="relative"
          >
            <div 
              className={`relative p-8 sm:p-10 border-l-2 border-r-2 backdrop-blur-xl group hover:border-pink-500/50 transition-colors duration-500 ${
                isLight ? 'bg-white/70 border-cyan-500/40' : 'bg-white/[0.03] border-purple-600/50'
              }`}
              style={{ clipPath: 'polygon(5% 0, 100% 0, 100% 95%, 95% 100%, 0 100%, 0 5%)' }}
            >
              <h3 className={`text-2xl font-bold font-cyber mb-10 uppercase tracking-[0.2em] border-b border-white/10 pb-4 text-center lg:text-left ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {content.stackTitle}
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                {techStack.map((tech, index) => (
                  <motion.div 
                    key={index} 
                    initial={{ opacity: 0, scale: 0.8 }} 
                    whileInView={{ opacity: 1, scale: 1 }} 
                    viewport={{ once: true }} 
                    transition={{ duration: 0.3, delay: index * 0.05 }} 
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.05)" }} 
                    className={`border rounded-xl p-4 text-center font-cyber tracking-widest uppercase text-xs sm:text-sm hover:border-pink-500/40 transition-all duration-300 shadow-[0_4px_15px_rgba(0,0,0,0.3)] ${
                      isLight
                        ? 'bg-white border-cyan-100 text-slate-700 hover:text-slate-900'
                        : 'bg-white/[0.02] border-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    {tech}
                  </motion.div>
                ))}
              </div>

              {/* Dekoratif Siber Detaylar */}
              <div className="mt-10 flex justify-end gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                <div className="w-1 h-4 bg-pink-500 transform skew-x-12" />
                <div className="w-1 h-4 bg-pink-500 transform skew-x-12 shadow-[0_0_8px_rgba(219,39,119,0.5)]" />
              </div>
            </div>
            
            {/* Holografik Kare Animasyonu (Arka Plan Değil, Kutu Üstünde Bir Detay) */}
            <motion.div 
              animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }} 
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} 
              className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl opacity-10 blur-xl pointer-events-none" 
            />
          </motion.div>
        </div>

        {/* ALT BİLGİ: Terminal Satırı (Yeri Görseldeki Gibi En Altta) */}
        <div className={`mt-24 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6 font-cyber text-[10px] tracking-[0.4em] uppercase ${isLight ? 'text-slate-500' : 'text-gray-600'}`}>
          <div className="flex items-center gap-3">
            <Activity className="w-3 h-3 text-pink-500 animate-pulse" />
            <span>Verii_Intelligence_Network_V2.2</span>
          </div>
          <div className="flex gap-8">
            <span className="hidden sm:inline">{content.build}</span>
            <span className="text-pink-500/50">{new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </section>
  )
}