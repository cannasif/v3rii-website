import { motion } from 'framer-motion'
import { BarChart3, Bot, BrainCircuit, CheckCircle2, DatabaseZap, Headphones, MailCheck, ShieldCheck, Workflow } from 'lucide-react'
import type { Language, Theme } from '../../App'
import crmPreview from '../../assets/crm.png'
import wmsPreview from '../../assets/wms.png'
import b2bPreview from '../../assets/b2b.png'

type Props = {
  language: Language
  theme: Theme
}

const content = {
  tr: {
    eyebrow: 'V3RII API ile çalışan yeni operasyon katmanı',
    title: 'Tanıtım sitesi artık destek, bilgi tabanı ve analiz üretiyor',
    description:
      'Web sitesi sadece ürün anlatan bir vitrin değil; CRM, B2B, WMS ve UTS dokümanlarını kullanan destek akışı, ticket yönetimi, mail kuyruğu, analitik ve RAG hazırlığıyla çalışan bir müşteri temas noktası.',
    metrics: [
      { label: 'Ürün aileleri', value: '4' },
      { label: 'Destek akışı', value: 'API' },
      { label: 'Bilgi tabanı', value: 'CMS' },
      { label: 'Analitik', value: 'Canlı' }
    ],
    capabilitiesTitle: 'Yeni sürümde öne çıkanlar',
    capabilities: [
      { icon: Bot, title: 'Chatbot + Ticket', text: 'Müşteri ihtiyacını CRM, B2B, WMS veya UTS olarak ayırır; gerektiğinde takip numarasıyla destek talebi açar.' },
      { icon: BrainCircuit, title: 'RAG hazır bilgi tabanı', text: 'Statik cevap yerine API tarafındaki ürün dokümanları ve bilgi makaleleri üzerinden yanıt üretmeye hazır yapı.' },
      { icon: BarChart3, title: 'Pazarlama analitiği', text: 'En çok sorulan ürün, konu, dönüşüm ve terk etme metrikleri admin tarafında izlenebilir.' },
      { icon: MailCheck, title: 'Mail kuyruğu', text: 'Talep oluşturulduğunda mail operasyonu kuyruk mantığıyla izlenebilir ve tekrar denenebilir.' },
      { icon: Headphones, title: 'Canlı destek hazırlığı', text: 'Sorunlu veya temsilci isteyen görüşmeler ayrı öncelik ve handoff sebebiyle operasyona düşer.' },
      { icon: ShieldCheck, title: 'Daha sıkı backend', text: 'Validasyon, rate-limit, CORS/network kısıtları ve yetkili admin uçları backend tarafında yönetilir.' }
    ],
    flowTitle: 'Ziyaretçiden aksiyona',
    flow: ['Ürün keşfi', 'Chatbot yönlendirme', 'API ticket', 'Admin takip', 'Analitik karar'],
    visualTitle: 'CRM, B2B ve WMS tek omurgada',
    visualText: 'Ürün ailesi aynı kurumsal dilde anlatılır; destek ve iletişim talepleri ise tek API altında toplanır.'
  },
  en: {
    eyebrow: 'New operations layer powered by V3RII API',
    title: 'The website now creates support, knowledge and analytics',
    description:
      'The website is no longer only a product showcase; it is a customer touchpoint with support routing, ticketing, mail queue, analytics and RAG-ready knowledge for CRM, B2B, WMS and UTS.',
    metrics: [
      { label: 'Product lines', value: '4' },
      { label: 'Support flow', value: 'API' },
      { label: 'Knowledge base', value: 'CMS' },
      { label: 'Analytics', value: 'Live' }
    ],
    capabilitiesTitle: 'Highlights in this version',
    capabilities: [
      { icon: Bot, title: 'Chatbot + Ticket', text: 'Classifies the request as CRM, B2B, WMS or UTS and creates a tracked support ticket when needed.' },
      { icon: BrainCircuit, title: 'RAG-ready knowledge', text: 'Prepared to answer from API-managed product documentation and knowledge articles instead of static responses.' },
      { icon: BarChart3, title: 'Marketing analytics', text: 'Top products, topics, conversion and drop-off metrics can be reviewed from the admin side.' },
      { icon: MailCheck, title: 'Mail queue', text: 'Ticket notifications can be monitored and retried through a queue-based operation model.' },
      { icon: Headphones, title: 'Live support ready', text: 'Problematic or human-requested conversations are flagged with priority and handoff reason.' },
      { icon: ShieldCheck, title: 'Stronger backend', text: 'Validation, rate limiting, CORS/network rules and protected admin endpoints are handled in the backend.' }
    ],
    flowTitle: 'From visitor to action',
    flow: ['Product discovery', 'Chatbot routing', 'API ticket', 'Admin follow-up', 'Analytics decision'],
    visualTitle: 'CRM, B2B and WMS on one backbone',
    visualText: 'The product family is presented with one enterprise language while support and contact requests are collected under one API.'
  }
}

export default function PlatformLayer({ language, theme }: Props) {
  const isLight = theme === 'light'
  const t = content[language]

  return (
    <section id="platform" className="scroll-mt-40 py-20 sm:py-24 px-4 sm:px-6 lg:px-8 relative z-10 overflow-hidden font-modern">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="grid lg:grid-cols-[1.02fr_0.98fr] gap-8 lg:gap-12 items-stretch"
        >
          <div
            className={`relative overflow-hidden border-l-2 border-r-2 p-6 sm:p-8 lg:p-10 backdrop-blur-xl ${
              isLight ? 'bg-white/75 border-cyan-300/70' : 'bg-white/[0.035] border-cyan-400/35'
            }`}
            style={{ clipPath: 'polygon(4% 0, 100% 0, 100% 94%, 96% 100%, 0 100%, 0 6%)' }}
          >
            <div className="flex items-center gap-3 mb-5">
              <DatabaseZap className="h-5 w-5 text-cyan-400" />
              <span className={`text-xs sm:text-sm font-black uppercase tracking-[0.28em] ${isLight ? 'text-cyan-700' : 'text-cyan-300'}`}>
                {t.eyebrow}
              </span>
            </div>

            <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold font-cyber uppercase leading-tight mb-5 ${isLight ? 'text-slate-950' : 'text-white'}`}>
              {t.title}
            </h2>
            <p className={`text-base sm:text-lg leading-relaxed mb-7 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              {t.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              {t.metrics.map((metric) => (
                <div key={metric.label} className={`rounded-xl border p-3 min-h-[82px] ${isLight ? 'bg-white/80 border-cyan-200' : 'bg-slate-950/45 border-white/10'}`}>
                  <div className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
                    {metric.value}
                  </div>
                  <div className={`mt-1 text-[10px] sm:text-xs font-bold uppercase tracking-wide leading-tight ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    {metric.label}
                  </div>
                </div>
              ))}
            </div>

            <h3 className={`text-lg sm:text-xl font-bold font-cyber uppercase tracking-[0.18em] mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {t.capabilitiesTitle}
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {t.capabilities.map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.title} className={`rounded-xl border p-4 ${isLight ? 'bg-white/70 border-fuchsia-200' : 'bg-white/[0.035] border-fuchsia-400/15'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="h-4 w-4 text-fuchsia-400" />
                      <h4 className={`text-sm font-black uppercase tracking-wide ${isLight ? 'text-slate-900' : 'text-white'}`}>{item.title}</h4>
                    </div>
                    <p className={`text-xs sm:text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{item.text}</p>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="grid gap-5">
            <div
              className={`relative min-h-[360px] overflow-hidden border-l-2 border-r-2 p-5 sm:p-6 backdrop-blur-xl ${
                isLight ? 'bg-slate-950 border-fuchsia-400/55' : 'bg-black/55 border-fuchsia-400/35'
              }`}
              style={{ clipPath: 'polygon(7% 0, 100% 0, 100% 93%, 93% 100%, 0 100%, 0 7%)' }}
            >
              <div className="absolute inset-0 opacity-25 bg-[repeating-linear-gradient(180deg,transparent_0px,transparent_5px,#22d3ee18_6px,#22d3ee18_7px)]" />
              <div className="relative z-10 flex h-full flex-col justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 text-cyan-300 text-xs font-black uppercase tracking-[0.25em] mb-4">
                    <Workflow className="h-4 w-4" />
                    {t.flowTitle}
                  </div>
                  <div className="space-y-3">
                    {t.flow.map((step, index) => (
                      <div key={step} className="flex items-center gap-3">
                        <div className="h-8 w-8 shrink-0 rounded-full border border-cyan-400/50 bg-cyan-400/10 text-cyan-200 flex items-center justify-center text-xs font-black">
                          {index + 1}
                        </div>
                        <div className="h-px w-8 bg-gradient-to-r from-cyan-400 to-fuchsia-500 hidden sm:block" />
                        <span className="text-white text-sm sm:text-base font-bold">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[crmPreview, b2bPreview, wmsPreview].map((image, index) => (
                    <div key={image} className="relative aspect-[4/3] overflow-hidden rounded-xl border border-cyan-400/25 bg-white/5">
                      <img src={image} alt="" className="h-full w-full object-cover opacity-75" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <span className="absolute bottom-2 left-2 text-[10px] font-black text-white tracking-widest">0{index + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={`rounded-2xl border p-5 sm:p-6 ${isLight ? 'bg-white/75 border-cyan-200' : 'bg-white/[0.035] border-cyan-400/20'}`}>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 shrink-0 text-cyan-400 mt-1" />
                <div>
                  <h3 className={`text-xl font-bold font-cyber uppercase tracking-wide mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {t.visualTitle}
                  </h3>
                  <p className={`text-sm sm:text-base leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    {t.visualText}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
