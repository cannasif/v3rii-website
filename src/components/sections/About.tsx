import { motion } from 'framer-motion'
import { BrainCircuit, Headphones, Network, ShieldCheck, TerminalSquare } from 'lucide-react'
import { useGlitchPulse } from '../../hooks/useGlitchPulse'
import type { Language, Theme } from '../../App'

type Props = {
  language: Language
  theme: Theme
}

export default function About({ language, theme }: Props) {
  const isLight = theme === 'light'
  const cardGlitch = useGlitchPulse(30000, 550)

  const content = {
    tr: {
      terminalLine: '>_ SYS.ABOUT // V3RII KURUMSAL PROFİL',
      title: 'HAKKIMIZDA',
      intro:
        'V3RII Yazılım, işletmelerin dijital dönüşüm yolculuğunda güvenilir teknoloji ortağıdır. Alanında deneyimli ve işine tutkuyla bağlı mühendis kadromuzla; satıştan üretime, depodan mevzuat takibine kadar her ihtiyaca yönelik kurumsal yazılımlar geliştiriyoruz. Tüm çözümlerimiz yapay zeka destekli çalışır, ERP sistemleriyle uçtan uca entegre olur ve 7/24 teknik destek güvencesiyle her an yanınızda olur.',
      visionTitle: 'VİZYONUMUZ',
      visionText:
        'Teknolojiyi işletmeniz için gerçek bir güce dönüştürmek istiyoruz. Veriyi yapay zeka ile anlamlandırıyor, karmaşık süreçleri sadeleştiriyor ve her kararı ölçülebilir hale getiriyoruz. Bizim için başarı; birlikte çalıştığımız her işletmenin daha hızlı karar alması, daha verimli çalışması ve kendi sektöründe bir adım öne geçmesidir.',
      pillars: [
        {
          icon: BrainCircuit,
          title: 'Yapay Zekâ Destekli',
          text: 'Tüm çözümlerimizde yapay zeka destekli karar katmanı standarttır; verinizden içgörü, tahmin ve öneri üretir.'
        },
        {
          icon: Headphones,
          title: '7/24 Teknik Destek',
          text: 'Chatbot, ticket ve canlı destek akışıyla kesintisiz operasyon; kritik süreçleriniz asla yalnız kalmaz.'
        },
        {
          icon: Network,
          title: 'ERP Entegrasyonu',
          text: 'ERP sistemleriyle çift yönlü senkronizasyon: cari, stok, depo ve belge akışları tek omurgada birleşir.'
        },
        {
          icon: ShieldCheck,
          title: 'Kurumsal Güvenlik',
          text: 'Rol bazlı erişim, izin grupları, validasyon ve denetlenebilir kayıt yapısı tüm ürünlerde yerleşiktir.'
        }
      ],
      stackTitle: 'TEKNOLOJİ YIĞINIMIZ',
      stackSub: '// ürün ailemizin üzerinde koştuğu altyapı',
      visionStats: ['7/24 TEKNİK DESTEK', '%99.9 UPTIME', '5 ÜRÜN TEK OMURGA', 'AI DESTEKLİ KARAR KATMANI']
    },
    en: {
      terminalLine: '>_ SYS.ABOUT // V3RII CORPORATE PROFILE',
      title: 'ABOUT US',
      intro:
        'V3RII Software is a trusted technology partner on the digital transformation journey. With our experienced and passionate engineering team, we build enterprise software for every need — from sales to production, from warehousing to regulatory tracking. All our solutions are AI-powered, integrate end to end with ERP systems and are backed by 24/7 technical support.',
      visionTitle: 'OUR VISION',
      visionText:
        'We want to turn technology into real power for your business. We make sense of data with AI, simplify complex processes and make every decision measurable. For us, success means every business we work with decides faster, operates more efficiently and moves one step ahead in its industry.',
      pillars: [
        {
          icon: BrainCircuit,
          title: 'AI Powered',
          text: 'An AI-powered decision layer is standard across all our solutions; it turns your data into insights, forecasts and recommendations.'
        },
        {
          icon: Headphones,
          title: '24/7 Technical Support',
          text: 'Uninterrupted operations with chatbot, ticketing and live support flows; your critical processes are never left alone.'
        },
        {
          icon: Network,
          title: 'ERP Integration',
          text: 'Two-way synchronization with ERP systems: customers, stock, warehouses and document flows unite on one backbone.'
        },
        {
          icon: ShieldCheck,
          title: 'Enterprise Security',
          text: 'Role-based access, permission groups, validation and auditable records are built into every product.'
        }
      ],
      stackTitle: 'OUR TECH STACK',
      stackSub: '// the infrastructure our product family runs on',
      visionStats: ['24/7 TECHNICAL SUPPORT', '99.9% UPTIME', '5 PRODUCTS ONE BACKBONE', 'AI DECISION LAYER']
    }
  }[language]

  const techStack = [
    { name: '.NET Core & C#', tag: 'BACKEND' },
    { name: 'React & TypeScript', tag: 'FRONTEND' },
    { name: 'SQL Server & PostgreSQL', tag: 'DATA' },
    { name: 'ERP Entegrasyonu', tag: 'ERP' },
    { name: 'Yapay Zeka & Makine Öğrenmesi', tag: 'AI' },
    { name: 'Power BI & Raporlama', tag: 'BI' },
    { name: 'e-Fatura / e-Arşiv', tag: 'E-DOC' },
    { name: 'Web API & Entegrasyonlar', tag: 'API' },
    { name: 'Docker & CI/CD', tag: 'DEVOPS' },
    { name: 'Bulut Altyapı (Azure)', tag: 'CLOUD' },
    { name: 'Barkod & Mobil Terminal', tag: 'FIELD' },
    { name: 'Güvenlik & Yetkilendirme', tag: 'SECURITY' }
  ]

  return (
    <section id="about" className="py-24 relative overflow-hidden bg-transparent font-modern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ÜST BÖLÜM: Terminal satırı + Başlık + Kurumsal giriş */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 sm:mb-20"
        >
          <div className={`mb-4 font-cyber text-[10px] sm:text-xs tracking-[0.3em] uppercase ${isLight ? 'text-teal-700' : 'text-teal-300'}`}>
            {content.terminalLine}
            <span className="cyber-caret">▊</span>
          </div>

          <h2 className="text-[1.7rem] sm:text-6xl lg:text-7xl font-bold font-cyber mb-6 tracking-[0.04em] sm:tracking-[0.08em]">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-orange-400 to-amber-400">
              {content.title}
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-500 via-orange-400 to-amber-400 mx-auto mb-8 shadow-[0_0_10px_rgba(219,39,119,0.5)]" />

          <div
            className={`relative mx-auto max-w-4xl overflow-hidden border px-5 py-6 sm:px-8 sm:py-7 backdrop-blur-md ${
              cardGlitch ? 'cyber-card-glitch-active' : ''
            } ${
              isLight ? 'bg-white/80 border-teal-600/30' : 'bg-[#0a0f1a]/70 border-teal-400/25'
            }`}
            style={{ clipPath: 'polygon(3% 0, 100% 0, 100% 88%, 97% 100%, 0 100%, 0 12%)' }}
          >
            <div className="cyber-panel-scanline" />
            <div className="cyber-frame-corner cyber-frame-corner-tl" />
            <div className="cyber-frame-corner cyber-frame-corner-br" />
            <p className={`relative z-10 font-modern text-base sm:text-lg leading-relaxed ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
              {content.intro}
            </p>
          </div>
        </motion.div>

        {/* KURUMSAL SÜTUNLAR: AI, 7/24 Destek, ERP, Güvenlik */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 mb-16 sm:mb-24"
        >
          {content.pillars.map((pillar, index) => {
            const Icon = pillar.icon
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className={`group relative overflow-hidden border p-5 backdrop-blur-md transition-colors duration-300 hover:border-pink-500/60 ${
                  isLight ? 'bg-white/80 border-cyan-300/60' : 'bg-white/[0.03] border-cyan-400/20'
                }`}
                style={{ clipPath: 'polygon(8% 0, 100% 0, 100% 88%, 92% 100%, 0 100%, 0 12%)' }}
              >
                <div className="cyber-panel-scanline" />
                <div className="relative z-10">
                  <div className={`mb-3 inline-grid h-11 w-11 place-items-center border transition-colors duration-300 group-hover:border-pink-500/50 group-hover:bg-pink-500/10 ${
                    isLight ? 'border-teal-500/40 bg-teal-50' : 'border-teal-400/30 bg-teal-400/5'
                  }`}>
                    <Icon className="h-5 w-5 text-teal-400 transition-colors duration-300 group-hover:text-pink-400" />
                  </div>
                  <h4 className={`mb-2 font-cyber text-sm sm:text-base font-bold uppercase tracking-widest ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {pillar.title}
                  </h4>
                  <p className={`font-modern text-xs sm:text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
                    {pillar.text}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* SOL TARAF: Vizyonumuz */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="min-w-0"
          >
            <div className="flex items-center gap-3 sm:gap-4 mb-8 min-w-0">
              <div className="w-8 sm:w-12 h-1 shrink-0 bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.6)]" />
              <h3 className={`min-w-0 text-xl sm:text-4xl font-bold font-cyber uppercase tracking-[0.12em] sm:tracking-widest ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {content.visionTitle}
              </h3>
            </div>

            <p className={`mb-10 font-modern leading-relaxed text-base sm:text-lg ${isLight ? 'text-slate-700' : 'text-gray-400'}`}>
              {content.visionText}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {content.visionStats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className={`group flex items-center gap-3 border px-3 py-2.5 cursor-default transition-colors duration-300 hover:border-pink-500/50 ${
                    isLight ? 'bg-white/70 border-teal-500/30' : 'bg-white/[0.03] border-teal-400/20'
                  }`}
                  style={{ clipPath: 'polygon(4% 0, 100% 0, 100% 75%, 96% 100%, 0 100%, 0 25%)' }}
                >
                  <div className="h-2 w-2 shrink-0 bg-pink-500 shadow-[0_0_12px_rgba(236,72,153,0.8)] group-hover:scale-125 transition-transform duration-300" />
                  <span className={`min-w-0 font-cyber tracking-[0.12em] sm:tracking-[0.15em] text-[10px] sm:text-xs group-hover:text-pink-400 transition-colors uppercase ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
                    {stat}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* SAĞ TARAF: Teknoloji Yığınımız */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative min-w-0"
          >
            <div
              className={`relative p-6 sm:p-8 border-l-2 border-r-2 backdrop-blur-xl group hover:border-pink-500/50 transition-colors duration-500 ${
                isLight ? 'bg-white/70 border-cyan-500/40' : 'bg-white/[0.03] border-teal-400/30'
              }`}
              style={{ clipPath: 'polygon(5% 0, 100% 0, 100% 95%, 95% 100%, 0 100%, 0 5%)' }}
            >
              <div className="cyber-panel-scanline" />

              <div className="relative z-10">
                <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-2 min-w-0">
                  <TerminalSquare className="h-5 w-5 shrink-0 text-pink-500" />
                  <h3 className={`min-w-0 text-base sm:text-2xl font-bold font-cyber uppercase tracking-[0.1em] sm:tracking-[0.15em] ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {content.stackTitle}
                  </h3>
                </div>
                <p className={`mb-6 font-cyber text-[9px] sm:text-[10px] tracking-[0.25em] uppercase ${isLight ? 'text-teal-700' : 'text-teal-400/80'}`}>
                  {content.stackSub}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {techStack.map((tech, index) => (
                    <motion.div
                      key={tech.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.04 }}
                      className={`group/item flex items-center justify-between gap-2 border px-3 py-2.5 transition-all duration-300 hover:border-pink-500/40 ${
                        isLight
                          ? 'bg-white border-cyan-100 text-slate-700 hover:text-slate-900'
                          : 'bg-white/[0.02] border-white/5 text-gray-400 hover:text-white'
                      }`}
                      style={{ clipPath: 'polygon(3% 0, 100% 0, 100% 70%, 97% 100%, 0 100%, 0 30%)' }}
                    >
                      <span className="min-w-0 font-cyber tracking-wider uppercase text-[10px] sm:text-[11px] leading-tight">
                        {tech.name}
                      </span>
                      <span className={`shrink-0 border px-1.5 py-0.5 font-cyber text-[8px] tracking-widest transition-colors duration-300 group-hover/item:border-pink-500/40 group-hover/item:text-pink-400 ${
                        isLight ? 'border-teal-500/40 text-teal-700' : 'border-teal-400/30 text-teal-400'
                      }`}>
                        {tech.tag}
                      </span>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 flex justify-end gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                  <div className="w-1 h-4 bg-pink-500 transform skew-x-12" />
                  <div className="w-1 h-4 bg-pink-500 transform skew-x-12 shadow-[0_0_8px_rgba(219,39,119,0.5)]" />
                </div>
              </div>
            </div>

            <motion.div
              animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-pink-500 to-orange-400 rounded-2xl opacity-10 blur-xl pointer-events-none"
            />
          </motion.div>
        </div>

      </div>
    </section>
  )
}
