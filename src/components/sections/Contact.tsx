import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Mail, MapPin, Phone, Send, Star, type LucideIcon } from 'lucide-react'
import type { Language, Theme } from '../../App'
import { sendWebsiteContactRequest } from '../../features/support-chatbot/api/supportRequestApi'
import type { SupportProductKey } from '../../features/support-chatbot/types/support-chatbot.types'

type ContactField = 'name' | 'email' | 'product' | 'message'

type Props = {
  language: Language
  theme: Theme
}

const FIELD_CLIP = 'polygon(2.5% 0, 100% 0, 100% 70%, 97.5% 100%, 0 100%, 0 30%)'
// Sağ alt köşesi düz: textarea'nın resize tutamacı kırpılmasın
const RESIZE_FIELD_CLIP = 'polygon(0 0, 97.5% 0, 100% 30%, 100% 100%, 2.5% 100%, 0 70%)'
const CARD_CLIP = 'polygon(5% 0, 100% 0, 100% 85%, 95% 100%, 0 100%, 0 15%)'

type InfoCardProps = {
  icon: LucideIcon
  title: string
  info: string
  href: string
  description: string
  isLight: boolean
}

// Üzerinde 10 sn durulunca (ve durulmaya devam ettikçe her 10 sn'de) hafif glitch yapan bilgi kartı
function ContactInfoCard({ icon: Icon, title, info, href, description, isLight }: InfoCardProps) {
  const [glitch, setGlitch] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const stopTimers = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    intervalRef.current = null
    timeoutRef.current = null
    setGlitch(false)
  }

  const startTimers = () => {
    stopTimers()
    intervalRef.current = setInterval(() => {
      setGlitch(true)
      timeoutRef.current = setTimeout(() => setGlitch(false), 550)
    }, 10000)
  }

  useEffect(() => stopTimers, [])

  return (
    <div
      onMouseEnter={startTimers}
      onMouseLeave={stopTimers}
      className={`group relative overflow-hidden flex items-start gap-4 p-5 sm:p-6 border transition-all duration-300 hover:border-pink-500/60 ${
        glitch ? 'cyber-card-glitch-soft' : ''
      } ${
        isLight ? 'bg-white/80 border-teal-600/25 hover:bg-white' : 'bg-white/[0.03] border-teal-400/20 hover:bg-white/[0.06]'
      }`}
      style={{ clipPath: CARD_CLIP }}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-teal-400/10 to-transparent translate-x-[-100%] group-hover:animate-[scan_1.8s_linear_infinite]" />

      <div className={`grid h-11 w-11 shrink-0 place-items-center border transition-colors duration-300 group-hover:border-pink-500/50 group-hover:bg-pink-500/10 ${
        isLight ? 'border-teal-500/40 bg-teal-50' : 'border-teal-400/30 bg-teal-400/5'
      }`}>
        <Icon className="h-5 w-5 text-teal-400 transition-colors duration-300 group-hover:text-pink-400" />
      </div>

      <div className="min-w-0">
        <h3 className={`mb-1 font-cyber text-sm sm:text-base font-bold uppercase tracking-widest ${isLight ? 'text-slate-900' : 'text-white'}`}>
          {title}
        </h3>
        <a
          href={href}
          className="font-mono text-sm text-cyan-400 font-semibold hover:text-pink-400 hover:underline cursor-pointer break-all whitespace-pre-line transition-colors"
        >
          {info}
        </a>
        <p className={`mt-1.5 text-xs sm:text-sm ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
          {description}
        </p>
      </div>
    </div>
  )
}

export default function Contact({ language, theme }: Props) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    product: '',
    message: ''
  })

  // Ürün seçim menüsü kontrolü
  const [isProductMenuOpen, setIsProductMenuOpen] = useState(false)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [ticketNo, setTicketNo] = useState<string | undefined>()
  const [feedbackRating, setFeedbackRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [feedbackSent, setFeedbackSent] = useState(false)
  const isLight = theme === 'light'

  const text = {
    tr: {
      terminalLine: '>_ SYS.CONTACT // BAĞLANTI KANALI AÇIK',
      sectionTitle: 'İLETİŞİM',
      sectionDescription: 'Projeleriniz hakkında konuşmak için bizimle iletişime geçin.',
      email: 'E-posta',
      phone: 'Telefon',
      address: 'Adres',
      emailDesc: 'Projeleriniz için detaylı bilgi alın',
      phoneDesc: 'Hızlı destek için bizi arayın',
      addressDesc: 'Teknoloji merkezi lokasyonumuz',
      formTitle: 'MESAJ GÖNDER',
      labels: { name: 'AD SOYAD', email: 'E-POSTA', product: 'ÜRÜN', message: 'MESAJ' },
      placeholders: {
        name: 'Örn: Sertunç Direkçi',
        email: 'ornek@eposta.com',
        message: 'Proje detaylarınızı yazınız'
      },
      selectDefault: 'Seçiniz',
      options: [
        { label: 'V3RII CRM', value: 'crm' },
        { label: 'V3RII AQUA', value: 'aqua' },
        { label: 'V3RII B2B', value: 'b2b' },
        { label: 'V3RII WMS', value: 'wms' },
        { label: 'V3RII UTS', value: 'uts' }
      ],
      sending: 'GÖNDERİLİYOR...',
      send: 'GÖNDER',
      success: 'Mesajınız başarıyla destek talebine dönüştürüldü.',
      ticketLabel: 'Takip numarası',
      error: 'Mesaj gönderilirken bir hata oluştu.',
      feedbackTitle: 'MÜŞTERİ GERİ BİLDİRİMİ',
      feedbackDescription: 'Deneyiminizi puanlayın ve kısa yorum bırakın.',
      feedbackPlaceholder: 'Kısa geri bildiriminizi buraya yazın...',
      feedbackSubmit: 'GERİ BİLDİRİM GÖNDER',
      feedbackSuccess: 'Teşekkürler! Geri bildiriminiz alındı.'
    },
    en: {
      terminalLine: '>_ SYS.CONTACT // CHANNEL OPEN',
      sectionTitle: 'CONTACT',
      sectionDescription: 'Get in touch to discuss your project.',
      email: 'Email',
      phone: 'Phone',
      address: 'Address',
      emailDesc: 'Get detailed info for your project',
      phoneDesc: 'Call us for quick support',
      addressDesc: 'Our technology center location',
      formTitle: 'SEND MESSAGE',
      labels: { name: 'FULL NAME', email: 'EMAIL', product: 'PRODUCT', message: 'MESSAGE' },
      placeholders: {
        name: 'Ex: John Doe',
        email: 'example@mail.com',
        message: 'Write your project details'
      },
      selectDefault: 'Select',
      options: [
        { label: 'V3RII CRM', value: 'crm' },
        { label: 'V3RII AQUA', value: 'aqua' },
        { label: 'V3RII B2B', value: 'b2b' },
        { label: 'V3RII WMS', value: 'wms' },
        { label: 'V3RII UTS', value: 'uts' }
      ],
      sending: 'SENDING...',
      send: 'SEND',
      success: 'Your message has been converted into a support request.',
      ticketLabel: 'Ticket number',
      error: 'An error occurred while sending your message.',
      feedbackTitle: 'CUSTOMER FEEDBACK',
      feedbackDescription: 'Rate your experience and leave a short comment.',
      feedbackPlaceholder: 'Write your short feedback here...',
      feedbackSubmit: 'SEND FEEDBACK',
      feedbackSuccess: 'Thank you! Your feedback has been received.'
    }
  }[language]

  const inputClass = `w-full border px-4 py-3 font-modern text-sm focus:outline-none transition-all duration-300 focus:border-pink-500 ${
    isLight
      ? 'bg-white/85 border-teal-600/30 text-slate-900 placeholder-slate-400 focus:bg-white'
      : 'bg-[#0a0f1a]/80 border-teal-400/25 text-white placeholder-gray-500 focus:bg-[#0d1424]'
  }`

  const labelClass = `mb-1.5 flex items-center gap-1.5 font-cyber text-[10px] sm:text-[11px] tracking-[0.25em] uppercase ${
    isLight ? 'text-teal-700' : 'text-teal-300'
  }`

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setTicketNo(undefined)

    try {
      const result = await sendWebsiteContactRequest({
        product: (formData.product || 'crm') as SupportProductKey,
        name: formData.name,
        email: formData.email,
        message: formData.message,
        language
      })

      setSubmitStatus('success')
      setTicketNo(result.ticketNo)
      setFormData({ name: '', email: '', product: '', message: '' })
    } catch {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactList = [
    {
      icon: Mail,
      title: text.email,
      info: 'info@v3rii.com',
      href: 'mailto:info@v3rii.com',
      description: text.emailDesc
    },
    {
      icon: Phone,
      title: text.phone,
      info: '+90 507 710 87 61',
      href: 'tel:+905077108761',
      description: text.phoneDesc
    },
    {
      icon: MapPin,
      title: text.address,
      info: '1479. Sk.\nAlsancak, 35220 Konak/İzmir',
      href: 'https://maps.app.goo.gl/p6BYKBfv9ZBi4eBA6',
      description: text.addressDesc
    }
  ]

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (feedbackRating === 0) return
    setFeedbackSent(true)
    setTimeout(() => setFeedbackSent(false), 2600)
    setFeedbackMessage('')
    setFeedbackRating(0)
    setHoverRating(0)
  }

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-transparent font-modern">
      <div className="cyber-noise" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* BAŞLIK */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 sm:mb-16"
        >
          <div className={`mb-3 font-cyber text-[10px] sm:text-xs tracking-[0.3em] uppercase ${isLight ? 'text-teal-700' : 'text-teal-300'}`}>
            {text.terminalLine}
            <span className="cyber-caret">▊</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold font-cyber tracking-wider mb-5">
            <span className="bg-gradient-to-r from-pink-500 via-orange-400 to-amber-400 bg-clip-text text-transparent">
              {text.sectionTitle}
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-500 via-orange-400 to-amber-400 mx-auto mb-6 shadow-[0_0_10px_rgba(219,39,119,0.5)]" />
          <p className={`text-base sm:text-lg max-w-3xl mx-auto ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
            {text.sectionDescription}
          </p>
        </motion.div>

        {/* ANA PANEL */}
        <div
          className={`relative grid md:grid-cols-2 gap-10 lg:gap-14 p-6 sm:p-10 border backdrop-blur-xl overflow-hidden ${
            isLight ? 'bg-white/70 border-teal-600/30' : 'bg-[#0a0f1a]/70 border-teal-400/25'
          }`}
          style={{ clipPath: 'polygon(3% 0, 100% 0, 100% 96%, 97% 100%, 0 100%, 0 4%)' }}
        >
          <div className="cyber-panel-scanline" />
          <div className="cyber-frame-corner cyber-frame-corner-tl" />
          <div className="cyber-frame-corner cyber-frame-corner-br" />

          {/* SOL: İLETİŞİM BİLGİLERİ */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative z-10 space-y-5"
          >
            {contactList.map((contact, index) => (
              <ContactInfoCard
                key={index}
                icon={contact.icon}
                title={contact.title}
                info={contact.info}
                href={contact.href}
                description={contact.description}
                isLight={isLight}
              />
            ))}
          </motion.div>

          {/* SAĞ: FORM */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative z-10"
          >
            <div className={`mb-5 flex items-center gap-2 font-cyber text-[11px] sm:text-xs tracking-[0.3em] uppercase ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              <span className="text-pink-500">{'>'}</span>
              {text.formTitle}
              <span className="cyber-caret">▊</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
              {(['name', 'email', 'product', 'message'] as ContactField[]).map((field) => (
                <div key={field}>
                  <label className={labelClass}>
                    <span className="text-pink-500/80">{'//'}</span>
                    {text.labels[field]}
                  </label>

                  {field === 'message' ? (
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={5}
                      required
                      className={inputClass}
                      style={{ clipPath: FIELD_CLIP }}
                      placeholder={text.placeholders.message}
                    />
                  ) : field === 'product' ? (
                    <div className="relative">
                      {isProductMenuOpen && (
                        <div className="fixed inset-0 z-40" onClick={() => setIsProductMenuOpen(false)} />
                      )}

                      <button
                        type="button"
                        onClick={() => setIsProductMenuOpen(!isProductMenuOpen)}
                        className={`${inputClass} relative z-50 flex items-center justify-between text-left`}
                        style={{ clipPath: FIELD_CLIP }}
                      >
                        <span className={formData.product ? '' : (isLight ? 'text-slate-400' : 'text-gray-500')}>
                          {text.options.find((option) => option.value === formData.product)?.label || text.selectDefault}
                        </span>
                        <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isProductMenuOpen ? 'rotate-180 text-pink-500' : 'text-gray-400'}`} />
                      </button>

                      <AnimatePresence>
                        {isProductMenuOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className={`absolute top-full left-0 right-0 mt-2 z-50 border overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)] backdrop-blur-xl ${
                              isLight ? 'bg-white/95 border-teal-600/40' : 'bg-[#0a0f1a]/95 border-teal-400/40'
                            }`}
                            style={{ clipPath: 'polygon(1.5% 0, 100% 0, 100% 92%, 98.5% 100%, 0 100%, 0 8%)' }}
                          >
                            {text.options.map((option, idx) => (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => { setFormData(prev => ({ ...prev, product: option.value })); setIsProductMenuOpen(false); }}
                                className={`w-full text-left px-4 py-3 text-sm transition-colors ${idx !== 0 ? 'border-t border-white/5' : ''} ${
                                  formData.product === option.value
                                    ? (isLight ? 'bg-pink-100 text-pink-800 font-bold' : 'bg-pink-500/25 text-pink-300 font-bold')
                                    : (isLight ? 'hover:bg-teal-50 text-slate-700' : 'hover:bg-teal-500/15 text-gray-300 hover:text-teal-300')
                                }`}
                              >
                                <span className={`mr-2 font-cyber text-[9px] ${formData.product === option.value ? 'text-pink-400' : 'text-teal-500/60'}`}>
                                  {`0${idx + 1}`}
                                </span>
                                {option.label}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <input
                      name={field}
                      type={field === 'email' ? 'email' : 'text'}
                      required
                      autoComplete="new-password"
                      value={formData[field]}
                      onChange={handleInputChange}
                      className={inputClass}
                      style={{ clipPath: FIELD_CLIP }}
                      placeholder={field === 'name' ? text.placeholders.name : text.placeholders.email}
                    />
                  )}
                </div>
              ))}

              {/* GÖNDER BUTONU */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                disabled={isSubmitting}
                className={`group relative w-full overflow-hidden bg-gradient-to-r from-pink-600 via-orange-500 to-amber-400 py-3.5 font-cyber text-xs sm:text-sm font-bold uppercase tracking-[0.3em] text-white shadow-[0_0_20px_rgba(219,39,119,0.35)] transition-all duration-300 hover:shadow-[0_0_36px_rgba(219,39,119,0.55)] ${
                  isSubmitting ? 'opacity-60 cursor-not-allowed' : ''
                }`}
                style={{ clipPath: 'polygon(3% 0, 100% 0, 100% 65%, 97% 100%, 0 100%, 0 35%)' }}
              >
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent translate-x-[-120%] group-hover:animate-[scan_1.4s_linear_infinite]" />
                <span className="relative inline-flex items-center justify-center gap-2">
                  {isSubmitting ? text.sending : text.send}
                  <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </motion.button>

              {/* NEON SUCCESS/ERROR MESSAGES */}
              {submitStatus === 'success' && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-teal-400 font-bold text-sm drop-shadow-[0_0_10px_rgba(45,212,191,0.8)] flex flex-wrap items-center gap-2">
                  <span className="w-2 h-2 bg-teal-400 animate-pulse shadow-[0_0_8px_rgba(45,212,191,1)]" />
                  {text.success}
                  {ticketNo && <span className="border border-teal-400/40 px-3 py-1 font-cyber text-xs tracking-widest">{text.ticketLabel}: {ticketNo}</span>}
                </motion.p>
              )}
              {submitStatus === 'error' && (
                <p className="text-red-500 font-bold text-sm drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">{text.error}</p>
              )}
            </form>
          </motion.div>
        </div>

        {/* FEEDBACK SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`relative mt-10 border p-5 sm:p-7 backdrop-blur-xl overflow-hidden ${
            isLight ? 'bg-white/70 border-teal-600/30' : 'bg-white/[0.03] border-teal-400/25'
          }`}
          style={{ clipPath: 'polygon(2% 0, 100% 0, 100% 94%, 98% 100%, 0 100%, 0 6%)' }}
        >
          <div className="cyber-panel-scanline" />

          <div className="relative z-10">
            <h3 className={`font-cyber text-lg sm:text-xl font-bold uppercase tracking-widest mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {text.feedbackTitle}
            </h3>
            <p className={`text-sm sm:text-base mb-5 ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>{text.feedbackDescription}</p>

            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((value) => {
                  const active = value <= (hoverRating || feedbackRating)
                  return (
                    <button key={value} type="button" onMouseEnter={() => setHoverRating(value)} onMouseLeave={() => setHoverRating(0)} onClick={() => setFeedbackRating(value)} className="transition-transform duration-200 hover:scale-110">
                      <Star className={`h-6 w-6 ${active ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]' : isLight ? 'text-slate-400' : 'text-gray-500'}`} />
                    </button>
                  )
                })}
              </div>
              <textarea
                value={feedbackMessage}
                onChange={(e) => setFeedbackMessage(e.target.value)}
                rows={3}
                placeholder={text.feedbackPlaceholder}
                className={`${inputClass} resize-y min-h-[88px] max-h-[280px]`}
                style={{ clipPath: RESIZE_FIELD_CLIP }}
              />
              <button
                type="submit"
                disabled={feedbackRating === 0}
                className={`bg-gradient-to-r from-pink-600 via-orange-500 to-amber-400 px-6 py-2.5 font-cyber text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] text-white transition-all duration-300 ${
                  feedbackRating === 0 ? 'opacity-55 cursor-not-allowed' : 'shadow-[0_0_18px_rgba(219,39,119,0.3)] hover:shadow-[0_0_30px_rgba(219,39,119,0.5)]'
                }`}
                style={{ clipPath: 'polygon(6% 0, 100% 0, 100% 65%, 94% 100%, 0 100%, 0 35%)' }}
              >
                {text.feedbackSubmit}
              </button>
            </form>

            {feedbackSent && (
              <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mt-3 text-pink-400 font-bold text-sm drop-shadow-[0_0_10px_rgba(236,72,153,0.8)] flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-pink-400 animate-ping shadow-[0_0_6px_rgba(236,72,153,1)]" />
                {text.feedbackSuccess}
              </motion.p>
            )}
          </div>
        </motion.div>
      </div>

      <style>{`@keyframes scan { 0% { transform: translateX(-100%); } 100% { transform: translateX(150%); } }`}</style>
    </section>
  )
}
