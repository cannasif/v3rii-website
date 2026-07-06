import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Star, ChevronDown } from 'lucide-react'
import type { Language, Theme } from '../../App'
import { sendWebsiteContactRequest } from '../../features/support-chatbot/api/supportRequestApi'
import type { SupportProductKey } from '../../features/support-chatbot/types/support-chatbot.types'

type ContactField = 'name' | 'email' | 'product' | 'message'

type Props = {
  language: Language
  theme: Theme
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
      sectionTitle: 'İletişim',
      sectionDescription: 'Projeleriniz hakkında konuşmak için bizimle iletişime geçin.',
      email: 'E-posta',
      phone: 'Telefon',
      address: 'Adres',
      emailDesc: 'Projeleriniz için detaylı bilgi alın',
      phoneDesc: 'Hızlı destek için bizi arayın',
      addressDesc: 'Teknoloji merkezi lokasyonumuz',
      labels: { name: 'Ad Soyad', email: 'E-posta', product: 'Ürün', message: 'Mesaj' },
      placeholders: {
        name: 'Örn: Ahmet Yılmaz',
        email: 'ornek@eposta.com',
        message: 'Proje detaylarınızı yazınız'
      },
      selectDefault: 'Seçiniz',
      options: [
        { label: 'CRM Sistemi', value: 'crm' },
        { label: 'B2B Platform', value: 'b2b' },
        { label: 'Depo Otomasyonu', value: 'wms' },
        { label: 'UTS Operasyonları', value: 'uts' }
      ],
      sending: 'Gönderiliyor...',
      send: 'Gönder',
      success: 'Mesajınız başarıyla destek talebine dönüştürüldü.',
      ticketLabel: 'Takip numarası',
      error: 'Mesaj gönderilirken bir hata oluştu.',
      feedbackTitle: 'Müşteri Geri Bildirimi',
      feedbackDescription: 'Deneyiminizi puanlayın ve kısa yorum bırakın.',
      feedbackPlaceholder: 'Kısa geri bildiriminizi buraya yazın...',
      feedbackSubmit: 'Geri Bildirim Gönder',
      feedbackSuccess: 'Teşekkürler! Geri bildiriminiz alındı.'
    },
    en: {
      sectionTitle: 'Contact',
      sectionDescription: 'Get in touch to discuss your project.',
      email: 'Email',
      phone: 'Phone',
      address: 'Address',
      emailDesc: 'Get detailed info for your project',
      phoneDesc: 'Call us for quick support',
      addressDesc: 'Our technology center location',
      labels: { name: 'Full Name', email: 'Email', product: 'Product', message: 'Message' },
      placeholders: {
        name: 'Ex: John Doe',
        email: 'example@mail.com',
        message: 'Write your project details'
      },
      selectDefault: 'Select',
      options: [
        { label: 'CRM System', value: 'crm' },
        { label: 'B2B Platform', value: 'b2b' },
        { label: 'Warehouse Automation', value: 'wms' },
        { label: 'UTS Operations', value: 'uts' }
      ],
      sending: 'Sending...',
      send: 'Send',
      success: 'Your message has been converted into a support request.',
      ticketLabel: 'Ticket number',
      error: 'An error occurred while sending your message.',
      feedbackTitle: 'Customer Feedback',
      feedbackDescription: 'Rate your experience and leave a short comment.',
      feedbackPlaceholder: 'Write your short feedback here...',
      feedbackSubmit: 'Send Feedback',
      feedbackSuccess: 'Thank you! Your feedback has been received.'
    }
  }[language]

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
      icon: '📧',
      title: text.email,
      info: 'info@v3rii.com',
      href: 'mailto:info@v3rii.com',
      description: text.emailDesc
    },
    {
      icon: '📞',
      title: text.phone,
      info: '+90 507 710 87 61',
      href: 'tel:+905077108761',
      description: text.phoneDesc
    },
    {
      icon: '📍',
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
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-transparent">
      {/* GLOBAL SCANLINE BG */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.15] bg-[repeating-linear-gradient(180deg,transparent_0px,transparent_2px,#ffffff10_3px,#ffffff10_4px)]"></div>

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              {text.sectionTitle}
            </span>
          </h2>
          <p className={`text-xl max-w-3xl mx-auto ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
            {text.sectionDescription}
          </p>
        </motion.div>

        <div className={`grid md:grid-cols-2 gap-12 rounded-[28px] p-6 sm:p-10 border-l-2 border-r-2 backdrop-blur-xl ${
          isLight ? 'bg-white/65 border-cyan-400/40' : 'bg-white/[0.02] border-purple-500/35'
        }`} style={{ clipPath: 'polygon(3% 0, 100% 0, 100% 96%, 97% 100%, 0 100%, 0 4%)' }}>
          
          {/* LEFT SIDE: CONTACT INFO */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="space-y-6">
              {contactList.map((contact, index) => (
                <motion.div
                  key={index}
                  className={`group relative overflow-hidden flex items-start gap-4 p-6 backdrop-blur-xl border rounded-2xl transition-all duration-300 hover:border-cyan-400 hover:shadow-[0_0_35px_rgba(34,211,238,0.5)] ${
                    isLight ? 'bg-white/70 border-cyan-500/20 hover:bg-white/90' : 'bg-slate-900/60 border-purple-500/25 hover:bg-slate-900/80'
                  }`}
                >
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent translate-x-[-100%] group-hover:animate-[scan_1.8s_linear_infinite]"></div>
                  <div className="text-3xl drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">{contact.icon}</div>
                  <div>
                    <h3 className={`text-xl font-bold mb-1 font-mono ${isLight ? 'text-slate-900' : 'text-white'}`}>{contact.title}</h3>
                    <a href={contact.href} className="text-cyan-400 font-semibold mb-2 hover:underline cursor-pointer break-all font-mono whitespace-pre-line">{contact.info}</a>
                    <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>{contact.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT SIDE: FORM */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
              {(['name', 'email', 'product', 'message'] as ContactField[]).map((field) => (
                <div key={field}>
                  <label className={`block text-sm font-medium mb-1 ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
                    {text.labels[field]}
                  </label>
                  
                  {field === 'message' ? (
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={5}
                      required
                      className={`w-full border rounded-xl px-4 py-3 focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(34,211,238,0.4)] focus:outline-none transition-all duration-300 ${
                        isLight ? 'bg-white/80 border-cyan-500/25 text-slate-900 placeholder-slate-400' : 'bg-slate-900/70 border-purple-500/25 text-white placeholder-gray-500'
                      }`}
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
                        className={`w-full border rounded-xl px-4 py-3 flex items-center justify-between focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(34,211,238,0.4)] focus:outline-none transition-all duration-300 relative z-50 ${
                          isLight ? 'bg-white/80 border-cyan-500/25 text-slate-900' : 'bg-slate-900/70 border-purple-500/25 text-white'
                        }`}
                      >
                        <span className={formData.product ? '' : (isLight ? 'text-slate-400' : 'text-gray-500')}>
                          {text.options.find((option) => option.value === formData.product)?.label || text.selectDefault}
                        </span>
                        <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isProductMenuOpen ? 'rotate-180 text-cyan-400' : 'text-gray-400'}`} />
                      </button>

                      <AnimatePresence>
                        {isProductMenuOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className={`absolute top-full left-0 right-0 mt-2 z-50 rounded-xl border overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)] backdrop-blur-xl ${
                              isLight ? 'bg-white/95 border-cyan-200' : 'bg-[#0a0f1a]/95 border-cyan-500/40'
                            }`}
                          >
                            {text.options.map((option, idx) => (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => { setFormData(prev => ({ ...prev, product: option.value })); setIsProductMenuOpen(false); }}
                                className={`w-full text-left px-4 py-3 text-sm transition-colors ${idx !== 0 ? 'border-t border-white/5' : ''} ${
                                  formData.product === option.value
                                    ? (isLight ? 'bg-cyan-100 text-cyan-800 font-bold' : 'bg-cyan-500/30 text-cyan-300 font-bold') 
                                    : (isLight ? 'hover:bg-cyan-50 text-slate-700' : 'hover:bg-cyan-500/20 text-gray-300 hover:text-cyan-400')
                                }`}
                              >
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
                      className={`w-full border rounded-xl px-4 py-3 focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(34,211,238,0.4)] focus:outline-none transition-all duration-300 ${
                        isLight ? 'bg-white/80 border-cyan-500/25 text-slate-900 placeholder-slate-400' : 'bg-slate-900/70 border-purple-500/25 text-white placeholder-gray-500'
                      }`}
                      placeholder={field === 'name' ? text.placeholders.name : text.placeholders.email}
                    />
                  )}
                </div>
              ))}

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 relative overflow-hidden group border ${
                  isLight ? 'bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-violet-600 border-fuchsia-400/60 text-white' : 'bg-gradient-to-r from-cyan-500 via-purple-500 to-fuchsia-600 border-cyan-400/30 text-white'
                } ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? text.sending : text.send}
              </motion.button>

              {/* NEON SUCCESS/ERROR MESSAGES */}
              {submitStatus === 'success' && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-cyan-400 font-bold drop-shadow-[0_0_10px_rgba(34,211,238,0.8)] flex flex-wrap items-center gap-2">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,211,238,1)]" />
                  {text.success}
                  {ticketNo && <span className="rounded-full border border-cyan-400/40 px-3 py-1 text-xs">{text.ticketLabel}: {ticketNo}</span>}
                </motion.p>
              )}
              {submitStatus === 'error' && (
                <p className="text-red-500 font-bold drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">{text.error}</p>
              )}
            </form>
          </motion.div>
        </div>

        {/* FEEDBACK SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`mt-10 rounded-2xl border-l-2 border-r-2 p-5 sm:p-7 backdrop-blur-xl ${
            isLight ? 'bg-white/70 border-fuchsia-400/45' : 'bg-white/[0.03] border-cyan-500/35'
          }`}
          style={{ clipPath: 'polygon(2% 0, 100% 0, 100% 94%, 98% 100%, 0 100%, 0 6%)' }}
        >
          <h3 className={`text-xl sm:text-2xl font-bold font-cyber mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>{text.feedbackTitle}</h3>
          <p className={`text-sm sm:text-base mb-5 ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>{text.feedbackDescription}</p>

          <form onSubmit={handleFeedbackSubmit} className="space-y-4">
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((value) => {
                const active = value <= (hoverRating || feedbackRating)
                return (
                  <button key={value} type="button" onMouseEnter={() => setHoverRating(value)} onMouseLeave={() => setHoverRating(0)} onClick={() => setFeedbackRating(value)} className="transition-transform duration-200 hover:scale-110">
                    <Star className={`h-6 w-6 ${active ? 'fill-yellow-400 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]' : isLight ? 'text-slate-400' : 'text-gray-500'}`} />
                  </button>
                )
              })}
            </div>
            <textarea
              value={feedbackMessage}
              onChange={(e) => setFeedbackMessage(e.target.value)}
              rows={3}
              placeholder={text.feedbackPlaceholder}
              className={`w-full border rounded-xl px-4 py-3 focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(34,211,238,0.35)] focus:outline-none transition-all duration-300 ${
                isLight ? 'bg-white/80 border-cyan-500/25 text-slate-900 placeholder-slate-400' : 'bg-slate-900/70 border-purple-500/25 text-white placeholder-gray-500'
              }`}
            />
            <button
              type="submit"
              disabled={feedbackRating === 0}
              className={`rounded-xl px-5 py-2.5 font-semibold border transition-all duration-300 ${
                feedbackRating === 0 ? 'opacity-55 cursor-not-allowed' : 'hover:shadow-[0_0_22px_rgba(236,72,153,0.38)]'
              } ${isLight ? 'bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-white border-fuchsia-400/50' : 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white border-cyan-400/30'}`}
            >
              {text.feedbackSubmit}
            </button>
          </form>

          {feedbackSent && (
            <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mt-3 text-fuchsia-400 font-bold text-sm drop-shadow-[0_0_10px_rgba(232,121,249,0.8)] flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-fuchsia-400 rounded-full animate-ping shadow-[0_0_6px_rgba(232,121,249,1)]" />
              {text.feedbackSuccess}
            </motion.p>
          )}
        </motion.div>
      </div>

      <style>{`@keyframes scan { 0% { transform: translateX(-100%); } 100% { transform: translateX(150%); } }`}</style>
    </section>
  )
}
