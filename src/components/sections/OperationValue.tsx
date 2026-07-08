import { useMemo, useState } from 'react'
import { BarChart3, Boxes, Building2, Calculator, CheckCircle2, DatabaseZap, FileText, PackageCheck, Send, ShieldCheck, SlidersHorizontal, Users } from 'lucide-react'
import type { Language, Theme } from '../../App'
import type { SupportProductKey } from '../../features/support-chatbot/types/support-chatbot.types'

type Props = {
  language: Language
  theme: Theme
}

type MetricKey = 'orders' | 'quotes' | 'warehouse' | 'dealers'
type ToggleKey = 'erp' | 'compliance' | 'aqua'

const PANEL_CLIP = 'polygon(18px 0, 100% 0, 100% calc(100% - 18px), calc(100% - 18px) 100%, 0 100%, 0 18px)'
const FIELD_CLIP = 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'

const content = {
  tr: {
    eyebrow: '>_ VALUE.CALC // OPERASYON SİNYALİ',
    title: 'Hangi V3RII ürünü operasyonunuza daha yakın?',
    description:
      'B2B yazılım sitelerinde güçlü dönüşüm noktası; ziyaretçinin kendi iş hacmini, entegrasyon ihtiyacını ve operasyon riskini hızlıca görmesidir. Bu mini analiz CRM, B2B, WMS, UTS ve AQUA için ilk yönlendirmeyi çıkarır.',
    sliders: {
      orders: 'Aylık sipariş / talep',
      quotes: 'Aylık teklif / satış fırsatı',
      warehouse: 'Depo hareketi / sevkiyat',
      dealers: 'Bayi / müşteri hesabı'
    },
    toggles: {
      erp: 'Netsis / ERP entegrasyonu gerekli',
      compliance: 'ÜTS / regülasyon takibi var',
      aqua: 'Aquakültür / üretim operasyonu var'
    },
    result: 'Önerilen başlangıç',
    fit: 'Uyum skoru',
    savings: 'Tahmini haftalık manuel iş azalımı',
    trust: 'Güven sinyalleri',
    cta: 'Bu senaryo için demo akışı başlat',
    secondary: 'Ürünleri tekrar incele',
    hours: 'saat',
    signals: [
      'ERP/Netsis bağlantısı ve arka plan job izleme',
      'Rol, yetki, onay ve kapsam bazlı parametrik yapı',
      'Bilgi tabanı, ticket, mail kuyruğu ve lead scoring entegrasyonu',
      'CRM, B2B, WMS, UTS ve AQUA için ortak kurumsal dil'
    ],
    recommendations: {
      crm: 'Satış, teklif, müşteri 360 ve raporlama ağırlıklı bir başlangıç görünüyor.',
      b2b: 'Bayi portalı, katalog, fiyat/stok görünürlüğü ve sipariş akışı öne çıkıyor.',
      wms: 'Depo, barkod, kalite, transfer ve sevkiyat operasyonları baskın.',
      uts: 'ÜTS/UTS mevzuat, üretim/verme/alma ve izlenebilirlik ihtiyacı yüksek.',
      aqua: 'Aquakültür üretim, kafes, yemleme, fire ve hasat planlama sinyali güçlü.'
    }
  },
  en: {
    eyebrow: '>_ VALUE.CALC // OPERATION SIGNAL',
    title: 'Which V3RII product is closest to your operation?',
    description:
      'A strong B2B conversion point is helping visitors see their own volume, integration need and operational risk quickly. This mini analysis gives an initial direction for CRM, B2B, WMS, UTS and AQUA.',
    sliders: {
      orders: 'Monthly orders / requests',
      quotes: 'Monthly quotes / opportunities',
      warehouse: 'Warehouse moves / shipments',
      dealers: 'Dealer / customer accounts'
    },
    toggles: {
      erp: 'Netsis / ERP integration required',
      compliance: 'UTS / regulatory tracking required',
      aqua: 'Aquaculture / production operation'
    },
    result: 'Recommended starting point',
    fit: 'Fit score',
    savings: 'Estimated weekly manual work reduction',
    trust: 'Trust signals',
    cta: 'Start a demo flow for this scenario',
    secondary: 'Review products again',
    hours: 'hours',
    signals: [
      'ERP/Netsis connection and background job monitoring',
      'Parametric roles, permissions, approvals and scopes',
      'Knowledge base, ticketing, mail queue and lead scoring integration',
      'One enterprise language for CRM, B2B, WMS, UTS and AQUA'
    ],
    recommendations: {
      crm: 'Sales, quotes, customer 360 and reporting look like the best starting point.',
      b2b: 'Dealer portal, catalog, price/stock visibility and order flow stand out.',
      wms: 'Warehouse, barcode, quality, transfer and shipment operations dominate.',
      uts: 'UTS compliance, production/issue/return and traceability needs are high.',
      aqua: 'Aquaculture production, cages, feeding, mortality and harvest planning signals are strong.'
    }
  }
}

const productLabels: Record<SupportProductKey, string> = {
  crm: 'V3RII CRM',
  b2b: 'V3RII B2B',
  wms: 'V3RII WMS',
  uts: 'V3RII UTS',
  aqua: 'V3RII AQUA'
}

export default function OperationValue({ language, theme }: Props) {
  const [metrics, setMetrics] = useState<Record<MetricKey, number>>({
    orders: 450,
    quotes: 120,
    warehouse: 320,
    dealers: 35
  })
  const [toggles, setToggles] = useState<Record<ToggleKey, boolean>>({
    erp: true,
    compliance: false,
    aqua: false
  })

  const isLight = theme === 'light'
  const t = content[language]

  const analysis = useMemo(() => {
    const scores: Record<SupportProductKey, number> = {
      crm: Math.round(metrics.quotes * 0.32 + metrics.orders * 0.08 + (toggles.erp ? 18 : 0)),
      b2b: Math.round(metrics.dealers * 2.4 + metrics.orders * 0.18 + (toggles.erp ? 12 : 0)),
      wms: Math.round(metrics.warehouse * 0.38 + metrics.orders * 0.08 + (toggles.erp ? 10 : 0)),
      uts: Math.round((toggles.compliance ? 90 : 0) + metrics.orders * 0.07 + metrics.warehouse * 0.08),
      aqua: Math.round((toggles.aqua ? 110 : 0) + metrics.warehouse * 0.08 + (toggles.erp ? 10 : 0))
    }

    const recommended = (Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0] || 'crm') as SupportProductKey
    const rawScore = scores[recommended]
    const fitScore = Math.min(98, Math.max(42, Math.round(rawScore / 2.2)))
    const weeklyHours = Math.max(6, Math.round((metrics.orders * 0.025 + metrics.quotes * 0.06 + metrics.warehouse * 0.035 + metrics.dealers * 0.18) * (toggles.erp ? 1.16 : 1)))

    return {
      recommended,
      fitScore,
      weeklyHours,
      scores
    }
  }, [metrics, toggles])

  const startDemoFlow = () => {
    window.dispatchEvent(new CustomEvent('v3rii-chat-command', {
      detail: {
        open: true,
        product: analysis.recommended,
        intent: 'demo',
        message:
          language === 'tr'
            ? `${productLabels[analysis.recommended]} için demo görüşmesi planlamak istiyorum. Operasyon analizinde uyum skoru ${analysis.fitScore}, tahmini haftalık kazanım ${analysis.weeklyHours} saat çıktı.`
            : `I want to plan a demo for ${productLabels[analysis.recommended]}. The operation analysis showed a ${analysis.fitScore} fit score and an estimated weekly gain of ${analysis.weeklyHours} hours.`
      }
    }))
  }

  const scrollToProducts = () => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <section id="value-calculator" className="relative z-10 scroll-mt-32 overflow-hidden px-4 py-20 font-modern sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <div
            style={{ clipPath: PANEL_CLIP }}
            className={`relative overflow-hidden border p-6 sm:p-8 ${
              isLight ? 'border-cyan-300/70 bg-white/80 text-slate-950' : 'border-cyan-400/30 bg-white/[0.035] text-white'
            }`}
          >
            <div className="pointer-events-none absolute inset-0 opacity-[0.12] bg-[repeating-linear-gradient(180deg,transparent_0px,transparent_4px,#22d3ee_5px,#22d3ee_6px)]" />
            <div className="relative">
              <div className={`mb-4 flex items-center gap-2 font-cyber text-xs font-black uppercase tracking-[0.28em] ${isLight ? 'text-cyan-700' : 'text-cyan-300'}`}>
                <Calculator className="h-4 w-4" />
                {t.eyebrow}
              </div>
              <h2 className="font-cyber text-3xl font-black uppercase leading-tight sm:text-4xl lg:text-5xl">
                {t.title}
              </h2>
              <p className={`mt-5 text-base leading-relaxed sm:text-lg ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                {t.description}
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {t.signals.map((signal, index) => (
                  <div key={signal} className={`border p-3 ${isLight ? 'border-cyan-200 bg-white/70' : 'border-cyan-400/15 bg-black/25'}`} style={{ clipPath: FIELD_CLIP }}>
                    <div className="mb-2 flex items-center gap-2">
                      {[DatabaseZap, ShieldCheck, FileText, Building2][index] && (() => {
                        const Icon = [DatabaseZap, ShieldCheck, FileText, Building2][index]
                        return <Icon className="h-4 w-4 text-pink-400" />
                      })()}
                      <span className="font-cyber text-[10px] font-bold uppercase tracking-wider text-cyan-400">SYS.0{index + 1}</span>
                    </div>
                    <p className={`text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{signal}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            style={{ clipPath: PANEL_CLIP }}
            className={`border p-5 sm:p-6 lg:p-7 ${
              isLight ? 'border-pink-300/60 bg-slate-950 text-white' : 'border-pink-500/30 bg-black/50 text-white'
            }`}
          >
            <div className="grid gap-5 xl:grid-cols-[1fr_0.82fr]">
              <div className="space-y-4">
                {(Object.keys(t.sliders) as MetricKey[]).map((key) => (
                  <label key={key} className="block">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <span className="flex items-center gap-2 font-cyber text-[11px] font-bold uppercase tracking-wider text-cyan-300">
                        {key === 'orders' && <PackageCheck className="h-4 w-4" />}
                        {key === 'quotes' && <FileText className="h-4 w-4" />}
                        {key === 'warehouse' && <Boxes className="h-4 w-4" />}
                        {key === 'dealers' && <Users className="h-4 w-4" />}
                        {t.sliders[key]}
                      </span>
                      <strong className="font-cyber text-sm text-pink-300">{metrics[key]}</strong>
                    </div>
                    <input
                      type="range"
                      min={key === 'dealers' ? 0 : 10}
                      max={key === 'dealers' ? 250 : 1200}
                      step={key === 'dealers' ? 5 : 10}
                      value={metrics[key]}
                      onChange={(event) => setMetrics((prev) => ({ ...prev, [key]: Number(event.target.value) }))}
                      className="w-full accent-pink-500"
                    />
                  </label>
                ))}

                <div className="grid gap-2 sm:grid-cols-3">
                  {(Object.keys(t.toggles) as ToggleKey[]).map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setToggles((prev) => ({ ...prev, [key]: !prev[key] }))}
                      className={`border px-3 py-3 text-left text-xs font-bold leading-relaxed transition ${
                        toggles[key]
                          ? 'border-emerald-400/50 bg-emerald-400/10 text-emerald-200'
                          : 'border-cyan-400/20 bg-cyan-400/5 text-slate-300 hover:border-pink-400/45'
                      }`}
                      style={{ clipPath: FIELD_CLIP }}
                    >
                      <CheckCircle2 className={`mb-2 h-4 w-4 ${toggles[key] ? 'text-emerald-300' : 'text-slate-500'}`} />
                      {t.toggles[key]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border border-cyan-400/20 bg-cyan-400/[0.04] p-4" style={{ clipPath: PANEL_CLIP }}>
                <div className="mb-4 flex items-center gap-2 font-cyber text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-300">
                  <BarChart3 className="h-4 w-4" />
                  {t.result}
                </div>
                <div className="font-cyber text-3xl font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-fuchsia-400 to-cyan-300">
                  {productLabels[analysis.recommended]}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                  {t.recommendations[analysis.recommended]}
                </p>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="border border-white/10 bg-black/25 p-3">
                    <p className="font-cyber text-[9px] uppercase tracking-wider text-slate-400">{t.fit}</p>
                    <strong className="mt-2 block text-3xl text-pink-300">{analysis.fitScore}</strong>
                  </div>
                  <div className="border border-white/10 bg-black/25 p-3">
                    <p className="font-cyber text-[9px] uppercase tracking-wider text-slate-400">{t.savings}</p>
                    <strong className="mt-2 block text-3xl text-cyan-300">{analysis.weeklyHours}</strong>
                    <span className="text-xs text-slate-400">{t.hours}</span>
                  </div>
                </div>

                <div className="mt-5 space-y-2">
                  <button
                    type="button"
                    onClick={startDemoFlow}
                    className="inline-flex w-full items-center justify-center gap-2 bg-gradient-to-r from-pink-600 via-orange-500 to-amber-400 px-4 py-3 font-cyber text-[11px] font-black uppercase tracking-[0.18em] text-white transition hover:brightness-110"
                    style={{ clipPath: FIELD_CLIP }}
                  >
                    <Send className="h-4 w-4" />
                    {t.cta}
                  </button>
                  <button
                    type="button"
                    onClick={scrollToProducts}
                    className="inline-flex w-full items-center justify-center gap-2 border border-cyan-400/25 px-4 py-3 font-cyber text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-200 transition hover:border-cyan-300 hover:bg-cyan-400/10"
                    style={{ clipPath: FIELD_CLIP }}
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    {t.secondary}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
