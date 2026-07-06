import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertCircle,
  Bot,
  Building2,
  CheckCircle2,
  Headphones,
  Mail,
  MessageCircle,
  Minimize2,
  PackageCheck,
  Send,
  X
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { Language, Theme } from '../../../App'
import { sendSupportRequest } from '../api/supportRequestApi'
import type {
  ChatMessage,
  SupportIntent,
  SupportLanguage,
  SupportLead,
  SupportProductKey,
  SupportStep
} from '../types/support-chatbot.types'
import { getProductByKeyword, productKeys, productKnowledge } from '../utils/productKnowledge'
import { createId, detectIntent, detectSupportLanguage, isEmail, shouldAskForHuman } from '../utils/supportChatbotFlow'

type Props = {
  language: Language
  theme: Theme
}

type QuickAction = {
  label: string
  value: string
}

const text = {
  tr: {
    title: 'V3RII Destek Asistanı',
    subtitle: 'CRM, B2B, WMS ve UTS için hızlı yönlendirme',
    closedHint: 'Ürün destek asistanı',
    input: 'Sorunuzu veya talebinizi yazın...',
    send: 'Gönder',
    minimize: 'Küçült',
    close: 'Kapat',
    reset: 'Yeni görüşme',
    greeting:
      'Merhaba, ben V3RII yapay zeka destek asistanı. CRM, B2B, WMS ve UTS ürünleri hakkında bilgi verebilir, teknik destek veya demo talebinizi ekibe mail olarak iletebilirim.',
    askProduct: 'Hangi ürün için destek almak istiyorsunuz?',
    askIntent: 'Bu ürün için ne yapmak istersiniz?',
    askName: 'Talebinizi ekibe iletebilmem için adınızı ve soyadınızı paylaşır mısınız?',
    askEmail: 'Size dönüş yapılacak e-posta adresini yazar mısınız?',
    invalidEmail: 'Bu e-posta formatı geçerli görünmüyor. Lütfen örnek@firma.com şeklinde tekrar yazın.',
    askCompany: 'Firma adınızı da paylaşır mısınız? Bireysel talepse “-” yazabilirsiniz.',
    askDetails: 'Talebinizi, hata mesajını veya öğrenmek istediğiniz detayı kısaca yazar mısınız?',
    submitted: 'Talebiniz destek ekibine iletildi. En kısa sürede dönüş yapılacak.',
    savedOffline:
      'Mail servisine ulaşılamadı; talebinizi tarayıcıda güvenli şekilde bekleyen destek kaydı olarak sakladım. Backend çalışınca tekrar gönderilebilir.',
    productSelected: 'Ürün seçildi',
    requestTypeSelected: 'Talep türü seçildi',
    fallback: 'Sizi doğru yönlendirebilmem için ürün seçebilir veya talep türünüzü yazabilirsiniz.',
    human:
      'Canlı temsilci talebinizi destek kaydına ekleyebilirim. Önce ürün ve iletişim bilgilerinizi alayım.',
    productAnswerPrefix: 'Kısa özet',
    idealFor: 'Kimler için uygun',
    keyFeatures: 'Öne çıkan modüller',
    moduleGroups: 'Uygulama içinde gördüğümüz ana modül grupları',
    integrations: 'Entegrasyon ve altyapı',
    parameters: 'Parametrik yapı',
    supportTopics: 'Sık destek konuları',
    portfolio: 'Tüm ürünleri özetle',
    actions: {
      productInfo: 'Ürün bilgisi',
      demo: 'Demo talebi',
      technicalSupport: 'Teknik destek',
      integration: 'Entegrasyon',
      pricing: 'Fiyat/teklif',
      emailSupport: 'Mail ile destek aç',
      restart: 'Yeniden başla'
    }
  },
  en: {
    title: 'V3RII Support Assistant',
    subtitle: 'Fast guidance for CRM, B2B, WMS and UTS',
    closedHint: 'Product support assistant',
    input: 'Type your question or request...',
    send: 'Send',
    minimize: 'Minimize',
    close: 'Close',
    reset: 'New chat',
    greeting:
      'Hello, I am the V3RII AI support assistant. I can explain CRM, B2B, WMS and UTS products, and forward your technical support or demo request to the team by email.',
    askProduct: 'Which product do you need help with?',
    askIntent: 'What would you like to do for this product?',
    askName: 'Please share your full name so I can forward your request.',
    askEmail: 'Please enter the email address where our team can reach you.',
    invalidEmail: 'That email format does not look valid. Please try again like name@company.com.',
    askCompany: 'Could you also share your company name? Type “-” if not applicable.',
    askDetails: 'Please briefly describe your request, error message or question.',
    submitted: 'Your request has been sent to the support team. They will get back to you soon.',
    savedOffline:
      'The mail service could not be reached; I saved the request locally as a pending support record. It can be resent when the backend is available.',
    productSelected: 'Product selected',
    requestTypeSelected: 'Request type selected',
    fallback: 'Please select a product or type your request type so I can route you correctly.',
    human:
      'I can add your live representative request to the support record. Let me first collect the product and contact details.',
    productAnswerPrefix: 'Short summary',
    idealFor: 'Ideal for',
    keyFeatures: 'Key modules',
    moduleGroups: 'Main module groups identified in the apps',
    integrations: 'Integrations and infrastructure',
    parameters: 'Parametric setup',
    supportTopics: 'Common support topics',
    portfolio: 'Summarize all products',
    actions: {
      productInfo: 'Product info',
      demo: 'Request demo',
      technicalSupport: 'Technical support',
      integration: 'Integration',
      pricing: 'Pricing/quote',
      emailSupport: 'Open email ticket',
      restart: 'Restart'
    }
  }
}

const intentLabels: Record<SupportLanguage, Record<SupportIntent, string>> = {
  tr: {
    'product-info': 'Ürün bilgisi',
    demo: 'Demo talebi',
    'technical-support': 'Teknik destek',
    integration: 'Entegrasyon',
    pricing: 'Fiyat/teklif'
  },
  en: {
    'product-info': 'Product info',
    demo: 'Demo request',
    'technical-support': 'Technical support',
    integration: 'Integration',
    pricing: 'Pricing/quote'
  }
}

const initialLead = (language: SupportLanguage): SupportLead => ({ language })

const createInitialMessages = (language: SupportLanguage): ChatMessage[] => [
  { id: createId(), sender: 'bot', text: text[language].greeting },
  { id: createId(), sender: 'bot', text: text[language].askProduct, meta: 'product' }
]

const savePendingRequest = (lead: SupportLead, messages: ChatMessage[]) => {
  const current = JSON.parse(localStorage.getItem('v3riiPendingSupportRequests') || '[]')
  current.unshift({
    id: createId(),
    createdAt: new Date().toISOString(),
    lead,
    transcript: messages
  })
  localStorage.setItem('v3riiPendingSupportRequests', JSON.stringify(current.slice(0, 50)))
}

export default function SupportChatbot({ language, theme }: Props) {
  const initialLanguage: SupportLanguage = language === 'en' ? 'en' : 'tr'
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState<SupportStep>('product')
  const [lead, setLead] = useState<SupportLead>(() => initialLead(initialLanguage))
  const [messages, setMessages] = useState<ChatMessage[]>(() => createInitialMessages(initialLanguage))
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const t = text[lead.language]
  const isLight = theme === 'light'

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, isOpen])

  const addMessage = (sender: ChatMessage['sender'], value: string, meta?: string) => {
    setMessages((prev) => [...prev, { id: createId(), sender, text: value, meta }])
  }

  const reset = (nextLanguage = lead.language) => {
    setStep('product')
    setLead(initialLead(nextLanguage))
    setMessages(createInitialMessages(nextLanguage))
    setInput('')
    setIsSending(false)
  }

  const describeProduct = (productKey: SupportProductKey, activeLanguage = lead.language) => {
    const product = productKnowledge[activeLanguage][productKey]
    return [
      `${product.title}`,
      `${text[activeLanguage].productAnswerPrefix}: ${product.summary}`,
      `${text[activeLanguage].idealFor}: ${product.idealFor}`,
      `${text[activeLanguage].keyFeatures}:\n${product.features.map((item) => `- ${item}`).join('\n')}`,
      `${text[activeLanguage].moduleGroups}:\n${product.modules.map((item) => `- ${item}`).join('\n')}`,
      `${text[activeLanguage].integrations}:\n${product.integrations.map((item) => `- ${item}`).join('\n')}`,
      `${text[activeLanguage].parameters}:\n${product.parameters.map((item) => `- ${item}`).join('\n')}`,
      `${text[activeLanguage].supportTopics}:\n${product.supportTopics.map((item) => `- ${item}`).join('\n')}`
    ].join('\n\n')
  }

  const describePortfolio = (activeLanguage = lead.language) =>
    productKeys
      .map((key) => {
        const product = productKnowledge[activeLanguage][key]
        return `${product.title}: ${product.summary}`
      })
      .join('\n\n')

  const moveToEmailFlow = () => {
    setStep('collect-name')
    addMessage('bot', t.askName)
  }

  const selectProduct = (product: SupportProductKey) => {
    setLead((prev) => ({ ...prev, product }))
    setStep('intent')
    addMessage('system', t.productSelected, productKnowledge[lead.language][product].title)
    addMessage('bot', describeProduct(product))
    addMessage('bot', t.askIntent, 'intent')
  }

  const selectIntent = (intent: SupportIntent) => {
    setLead((prev) => ({ ...prev, intent }))
    addMessage('system', t.requestTypeSelected, intentLabels[lead.language][intent])

    if (intent === 'product-info' && lead.product) {
      setStep('answer')
      addMessage('bot', describeProduct(lead.product))
      addMessage('bot', t.askIntent, 'intent')
      return
    }

    moveToEmailFlow()
  }

  const submitSupportRequest = async (details: string, currentLead: SupportLead) => {
    if (!currentLead.product || !currentLead.intent || !currentLead.name || !currentLead.email) return

    const payload = {
      product: currentLead.product,
      intent: currentLead.intent,
      name: currentLead.name,
      email: currentLead.email,
      company: currentLead.company === '-' ? undefined : currentLead.company,
      details,
      language: currentLead.language,
      transcript: messages
    }

    setIsSending(true)
    try {
      await sendSupportRequest(payload)
      addMessage('system', t.submitted, 'email')
      setStep('submitted')
    } catch {
      savePendingRequest({ ...currentLead, details }, messages)
      addMessage('system', t.savedOffline, 'pending')
      setStep('submitted')
    } finally {
      setIsSending(false)
    }
  }

  const handleFlow = (rawValue: string) => {
    const value = rawValue.trim()
    if (!value) return

    const detectedLanguage = detectSupportLanguage(value, lead.language)
    if (detectedLanguage !== lead.language) {
      setLead((prev) => ({ ...prev, language: detectedLanguage }))
      addMessage('system', detectedLanguage === 'tr' ? 'Dil Türkçe olarak algılandı.' : 'Language detected as English.')
    }

    const activeText = text[detectedLanguage]
    const productFromText = getProductByKeyword(value)
    const intentFromText = detectIntent(value)
    const wantsPortfolio =
      /tüm|hepsi|ürünler|projeler|portfolio|all products|all projects/i.test(value) && !productFromText

    if (shouldAskForHuman(value)) {
      addMessage('bot', activeText.human)
      if (!lead.product && productFromText) {
        selectProduct(productFromText)
        return
      }
      if (!lead.intent) {
        setLead((prev) => ({ ...prev, intent: 'technical-support' }))
      }
      moveToEmailFlow()
      return
    }

    switch (step) {
      case 'product':
        if (wantsPortfolio) {
          addMessage('bot', describePortfolio(detectedLanguage))
          addMessage('bot', activeText.askProduct, 'product')
          return
        }
        if (productFromText) {
          selectProduct(productFromText)
          return
        }
        addMessage('bot', activeText.askProduct, 'product')
        break
      case 'intent':
      case 'answer':
        if (intentFromText) {
          selectIntent(intentFromText)
          return
        }
        addMessage('bot', activeText.fallback)
        break
      case 'collect-name':
        setLead((prev) => ({ ...prev, name: value }))
        setStep('collect-email')
        addMessage('bot', activeText.askEmail)
        break
      case 'collect-email':
        if (!isEmail(value)) {
          addMessage('bot', activeText.invalidEmail)
          return
        }
        setLead((prev) => ({ ...prev, email: value }))
        setStep('collect-company')
        addMessage('bot', activeText.askCompany)
        break
      case 'collect-company':
        setLead((prev) => ({ ...prev, company: value }))
        setStep('collect-details')
        addMessage('bot', activeText.askDetails)
        break
      case 'collect-details': {
        const nextLead = { ...lead, details: value }
        setLead(nextLead)
        void submitSupportRequest(value, nextLead)
        break
      }
      default:
        addMessage('bot', activeText.fallback)
    }
  }

  const submitMessage = (value: string) => {
    const trimmed = value.trim()
    if (!trimmed || isSending) return
    addMessage('user', trimmed)
    setInput('')
    window.setTimeout(() => handleFlow(trimmed), 160)
  }

  const quickActions = useMemo<QuickAction[]>(() => {
    if (step === 'product') {
      return [
        { label: t.portfolio, value: t.portfolio },
        ...productKeys.map((key) => ({
          label: productKnowledge[lead.language][key].shortTitle,
          value: productKnowledge[lead.language][key].shortTitle
        }))
      ]
    }

    if (step === 'intent' || step === 'answer') {
      return [
        { label: t.actions.productInfo, value: t.actions.productInfo },
        { label: t.actions.demo, value: t.actions.demo },
        { label: t.actions.technicalSupport, value: t.actions.technicalSupport },
        { label: t.actions.integration, value: t.actions.integration },
        { label: t.actions.pricing, value: t.actions.pricing }
      ]
    }

    if (step === 'submitted') {
      return [{ label: t.actions.restart, value: t.actions.restart }]
    }

    return []
  }, [lead.language, step, t.actions, t.portfolio])

  const handleQuickAction = (action: QuickAction) => {
    if (step === 'submitted') {
      reset()
      return
    }
    submitMessage(action.value)
  }

  return (
    <div className="fixed bottom-5 left-4 right-4 z-[95] flex justify-end pointer-events-none sm:bottom-7 sm:right-7 sm:left-auto">
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.22 }}
            className={`pointer-events-auto mb-4 flex h-[min(680px,calc(100vh-112px))] w-full max-w-[430px] flex-col overflow-hidden rounded-2xl border backdrop-blur-2xl ${
              isLight
                ? 'border-cyan-300/70 bg-white/92 text-slate-950 shadow-[0_24px_70px_rgba(14,116,144,0.28)]'
                : 'border-cyan-400/35 bg-slate-950/88 text-white shadow-[0_24px_80px_rgba(8,47,73,0.55)]'
            }`}
          >
            <div className={`border-b p-4 ${isLight ? 'border-cyan-200/70' : 'border-cyan-400/20'}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl border ${isLight ? 'border-cyan-300 bg-cyan-50 text-cyan-700' : 'border-cyan-400/40 bg-cyan-400/10 text-cyan-200'}`}>
                    <Bot className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="truncate text-base font-bold">{t.title}</h2>
                    <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>{t.subtitle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => reset()} className={`rounded-lg p-2 ${isLight ? 'hover:bg-slate-100' : 'hover:bg-white/10'}`} title={t.reset}>
                    <PackageCheck className="h-4 w-4" />
                  </button>
                  <button onClick={() => setIsOpen(false)} className={`rounded-lg p-2 ${isLight ? 'hover:bg-slate-100' : 'hover:bg-white/10'}`} title={t.minimize}>
                    <Minimize2 className="h-4 w-4" />
                  </button>
                  <button onClick={() => setIsOpen(false)} className={`rounded-lg p-2 ${isLight ? 'hover:bg-slate-100' : 'hover:bg-white/10'}`} title={t.close}>
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 ${isLight ? 'border-cyan-200 text-slate-600' : 'border-white/10 text-slate-300'}`}>
                  <Building2 className="h-3.5 w-3.5" />
                  CRM / B2B / WMS / UTS
                </span>
                <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 ${isLight ? 'border-fuchsia-200 text-fuchsia-700' : 'border-fuchsia-400/30 text-fuchsia-200'}`}>
                  <Mail className="h-3.5 w-3.5" />
                  Support mail
                </span>
              </div>
            </div>

            <div ref={scrollRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[86%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white'
                        : message.sender === 'system'
                          ? isLight
                            ? 'border border-emerald-200 bg-emerald-50 text-emerald-800'
                            : 'border border-emerald-400/30 bg-emerald-400/10 text-emerald-200'
                          : isLight
                            ? 'border border-slate-200 bg-slate-50 text-slate-800'
                            : 'border border-white/10 bg-white/[0.06] text-slate-100'
                    }`}
                  >
                    {message.sender === 'system' && (
                      <div className="mb-1 flex items-center gap-1 text-xs font-bold">
                        {message.meta === 'pending' ? <AlertCircle className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                        {message.meta}
                      </div>
                    )}
                    {message.text}
                  </div>
                </div>
              ))}
            </div>

            <div className={`border-t p-3 ${isLight ? 'border-cyan-200/70' : 'border-cyan-400/20'}`}>
              {quickActions.length > 0 && (
                <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
                  {quickActions.map((action) => (
                    <button
                      key={`${step}-${action.label}`}
                      onClick={() => handleQuickAction(action)}
                      className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                        isLight
                          ? 'border-cyan-200 bg-cyan-50 text-cyan-800 hover:bg-cyan-100'
                          : 'border-cyan-400/30 bg-cyan-400/10 text-cyan-200 hover:bg-cyan-400/20'
                      }`}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}

              <form
                onSubmit={(event) => {
                  event.preventDefault()
                  submitMessage(input)
                }}
                className="flex items-end gap-2"
              >
                <textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                      event.preventDefault()
                      submitMessage(input)
                    }
                  }}
                  rows={1}
                  disabled={isSending}
                  placeholder={isSending ? 'Gönderiliyor...' : t.input}
                  className={`max-h-28 min-h-11 flex-1 resize-none rounded-xl border px-3 py-2.5 text-sm outline-none transition disabled:opacity-60 ${
                    isLight
                      ? 'border-cyan-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-cyan-400'
                      : 'border-cyan-400/25 bg-slate-900/80 text-white placeholder:text-slate-500 focus:border-cyan-300'
                  }`}
                />
                <button
                  type="submit"
                  disabled={isSending}
                  aria-label={t.send}
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-cyan-300/50 bg-gradient-to-br from-cyan-500 to-fuchsia-500 text-white shadow-[0_0_20px_rgba(34,211,238,0.25)] transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.04, y: -2 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={t.title}
        className={`pointer-events-auto relative grid h-14 w-14 place-items-center rounded-full border sm:h-16 sm:w-16 ${
          isLight
            ? 'border-fuchsia-300 bg-white/90 text-fuchsia-700 shadow-[0_0_28px_rgba(217,70,239,0.36)]'
            : 'border-cyan-300/55 bg-slate-950/82 text-cyan-200 shadow-[0_0_32px_rgba(34,211,238,0.35)]'
        }`}
      >
        <span className="absolute -right-0.5 -top-0.5 grid h-5 w-5 place-items-center rounded-full bg-emerald-400 text-[10px] font-bold text-emerald-950">
          AI
        </span>
        {isOpen ? <Headphones className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </motion.button>

      {!isOpen && (
        <div className={`pointer-events-none absolute bottom-1 right-16 hidden max-w-[220px] rounded-xl border px-3 py-2 text-xs font-semibold backdrop-blur-xl sm:block ${isLight ? 'border-cyan-200 bg-white/86 text-slate-700' : 'border-cyan-400/25 bg-slate-950/78 text-cyan-100'}`}>
          {t.closedHint}
        </div>
      )}
    </div>
  )
}
