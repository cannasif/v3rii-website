import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertCircle,
  Bot,
  Building2,
  CheckCircle2,
  ChevronDown,
  Headphones,
  Mail,
  Mic,
  MicOff,
  Minimize2,
  PackageCheck,
  Send,
  Volume2,
  VolumeX,
  X
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Language, Theme } from '../../../App'
import { askKnowledgeBase, sendSupportRequest, trackChatEvent } from '../api/supportRequestApi'
import type {
  ChatMessage,
  ChatMessageCard,
  SupportIntent,
  SupportLanguage,
  SupportLead,
  SupportProductKey,
  SupportStep
} from '../types/support-chatbot.types'
import { companyKnowledge, getProductByKeyword, productKeys, productKnowledge, recommendProductsByNeed } from '../utils/productKnowledge'
import { createId, detectIntent, detectSupportLanguage, isEmail, shouldAskForHuman } from '../utils/supportChatbotFlow'

type Props = {
  language: Language
  theme: Theme
}

type QuickAction = {
  label: string
  value: string
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance

type SpeechRecognitionInstance = {
  continuous: boolean
  interimResults: boolean
  lang: string
  onresult: ((event: SpeechRecognitionEventLike) => void) | null
  onerror: (() => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
}

type SpeechRecognitionEventLike = {
  results: ArrayLike<{
    isFinal: boolean
    0: {
      transcript: string
    }
  }>
}

type SpeechWindow = Window & {
  SpeechRecognition?: SpeechRecognitionConstructor
  webkitSpeechRecognition?: SpeechRecognitionConstructor
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
    voiceInput: 'Sesli konuş',
    stopVoiceInput: 'Dinlemeyi durdur',
    voiceOutputOn: 'Sesli cevap açık',
    voiceOutputOff: 'Sesli cevap kapalı',
    conversationModeOn: 'Konuşma modu açık',
    conversationModeOff: 'Konuşma modu kapalı',
    listenAnswer: 'Cevabı dinle',
    listening: 'Dinliyorum...',
    speaking: 'Cevap seslendiriliyor...',
    speechNotSupported: 'Tarayıcınız sesli konuşma özelliğini desteklemiyor.',
    greeting:
      'Merhaba, ben V3RII yapay zeka destek asistanı. CRM, B2B, WMS ve UTS ürünleri hakkında bilgi verebilir, teknik destek veya demo talebinizi ekibe mail olarak iletebilirim.',
    askProduct: 'Hangi ürün için destek almak istiyorsunuz?',
    askNeed: 'İsterseniz ihtiyacınızı yazın; size en uygun V3RII ürününü önereyim.',
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
    },
    quickCompany: 'V3RII kimdir?',
    quickRecommend: 'Hangi ürün bana uygun?',
    recommendationTitle: 'İhtiyacınıza göre önerim'
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
    voiceInput: 'Speak',
    stopVoiceInput: 'Stop listening',
    voiceOutputOn: 'Voice replies on',
    voiceOutputOff: 'Voice replies off',
    conversationModeOn: 'Conversation mode on',
    conversationModeOff: 'Conversation mode off',
    listenAnswer: 'Listen to answer',
    listening: 'Listening...',
    speaking: 'Speaking...',
    speechNotSupported: 'Your browser does not support voice chat.',
    greeting:
      'Hello, I am the V3RII AI support assistant. I can explain CRM, B2B, WMS and UTS products, and forward your technical support or demo request to the team by email.',
    askProduct: 'Which product do you need help with?',
    askNeed: 'You can describe your need and I can recommend the most relevant V3RII product.',
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
    },
    quickCompany: 'Who is V3RII?',
    quickRecommend: 'Which product fits me?',
    recommendationTitle: 'My recommendation for your need'
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
  const [productModalOpen, setProductModalOpen] = useState(false)
  const [headerExpanded, setHeaderExpanded] = useState(false)
  const [step, setStep] = useState<SupportStep>('product')
  const [lead, setLead] = useState<SupportLead>(() => initialLead(initialLanguage))
  const [messages, setMessages] = useState<ChatMessage[]>(() => createInitialMessages(initialLanguage))
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voiceOutputEnabled, setVoiceOutputEnabled] = useState(false)
  const [conversationModeEnabled, setConversationModeEnabled] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)
  const sessionIdRef = useRef(createId())
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)
  const isListeningRef = useRef(false)
  const isOpenRef = useRef(false)
  const conversationModeEnabledRef = useRef(false)
  const startListeningRef = useRef<() => void>(() => undefined)
  const submitMessageRef = useRef<(value: string) => void>(() => undefined)
  const voiceTimeoutRef = useRef<number | null>(null)
  const voiceFinalFallbackRef = useRef<number | null>(null)
  const latestTranscriptRef = useRef('')
  const lastSpokenMessageIdRef = useRef<string | null>(null)
  const t = text[lead.language]
  const isLight = theme === 'light'

  const cleanSpeechText = useCallback(
    (value: string) =>
      value
        .replace(/>_/g, '')
        .replace(/V3RII_BOT\s*>/gi, '')
        .replace(/Ticket:/gi, lead.language === 'tr' ? 'Talep numarası:' : 'Ticket number:')
        .replace(/[-•▸]/g, '. ')
        .replace(/\s+/g, ' ')
        .trim(),
    [lead.language]
  )

  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
    setIsSpeaking(false)
  }, [])

  const clearVoiceTimers = useCallback(() => {
    if (voiceTimeoutRef.current) {
      window.clearTimeout(voiceTimeoutRef.current)
      voiceTimeoutRef.current = null
    }
    if (voiceFinalFallbackRef.current) {
      window.clearTimeout(voiceFinalFallbackRef.current)
      voiceFinalFallbackRef.current = null
    }
  }, [])

  const stopListening = useCallback((disableConversationMode = false) => {
    clearVoiceTimers()
    recognitionRef.current?.stop()
    recognitionRef.current = null
    latestTranscriptRef.current = ''
    setIsListening(false)
    if (disableConversationMode) {
      setConversationModeEnabled(false)
    }
  }, [clearVoiceTimers])

  const speak = useCallback((value: string) => {
    if (!('speechSynthesis' in window)) return
    const cleaned = cleanSpeechText(value)
    if (!cleaned) return

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(cleaned)
    utterance.lang = lead.language === 'en' ? 'en-US' : 'tr-TR'
    utterance.rate = 0.96
    utterance.pitch = 1
    utterance.voice =
      availableVoices.find((voice) => voice.lang.toLowerCase().startsWith(lead.language === 'en' ? 'en' : 'tr')) ??
      availableVoices.find((voice) => voice.default) ??
      null
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => {
      setIsSpeaking(false)
      if (conversationModeEnabledRef.current && isOpenRef.current) {
        window.setTimeout(() => startListeningRef.current(), 250)
      }
    }
    utterance.onerror = () => setIsSpeaking(false)
    window.speechSynthesis.speak(utterance)
  }, [availableVoices, cleanSpeechText, lead.language])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, isOpen])

  useEffect(() => {
    const SpeechRecognition = (window as SpeechWindow).SpeechRecognition || (window as SpeechWindow).webkitSpeechRecognition
    setSpeechSupported(Boolean(SpeechRecognition && 'speechSynthesis' in window))
  }, [])

  useEffect(() => {
    if (!('speechSynthesis' in window)) return

    const loadVoices = () => setAvailableVoices(window.speechSynthesis.getVoices())
    loadVoices()
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices)
    return () => window.speechSynthesis.removeEventListener('voiceschanged', loadVoices)
  }, [])

  useEffect(() => {
    isListeningRef.current = isListening
  }, [isListening])

  useEffect(() => {
    isOpenRef.current = isOpen
  }, [isOpen])

  useEffect(() => {
    conversationModeEnabledRef.current = conversationModeEnabled
  }, [conversationModeEnabled])

  useEffect(() => {
    const lastMessage = messages[messages.length - 1]
    if (!isOpen || !voiceOutputEnabled || !lastMessage || lastMessage.sender === 'user') return
    if (lastSpokenMessageIdRef.current === lastMessage.id) return

    lastSpokenMessageIdRef.current = lastMessage.id
    speak(lastMessage.text)
  }, [isOpen, messages, speak, voiceOutputEnabled])

  useEffect(() => {
    if (!isOpen) {
      stopListening(true)
      stopSpeaking()
    }
  }, [isOpen, stopListening, stopSpeaking])

  useEffect(() => () => {
    stopListening(true)
    stopSpeaking()
  }, [stopListening, stopSpeaking])

  // Diğer bileşenler (ör. Yukarı Çık butonu) chatbot durumunu bilsin
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('v3rii-chat-toggle', { detail: { open: isOpen } }))
  }, [isOpen])

  // Ürün modalı açıkken chatbot tamamen gizlenir
  useEffect(() => {
    const onModalToggle = (event: Event) => {
      setProductModalOpen(Boolean((event as CustomEvent<{ open: boolean }>).detail?.open))
    }
    window.addEventListener('v3rii-product-modal-toggle', onModalToggle)
    return () => window.removeEventListener('v3rii-product-modal-toggle', onModalToggle)
  }, [])

  useEffect(() => {
    void trackChatEvent('chat_started', { sessionId: sessionIdRef.current, metadata: { language: initialLanguage } })
  }, [initialLanguage])

  const addMessage = (sender: ChatMessage['sender'], value: string, meta?: string, cards?: ChatMessageCard[]) => {
    setMessages((prev) => [...prev, { id: createId(), sender, text: value, meta, cards }])
  }

  const reset = (nextLanguage = lead.language) => {
    stopListening(true)
    stopSpeaking()
    setStep('product')
    setLead(initialLead(nextLanguage))
    setMessages(createInitialMessages(nextLanguage))
    sessionIdRef.current = createId()
    void trackChatEvent('chat_started', { sessionId: sessionIdRef.current, metadata: { language: nextLanguage } })
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

  const describeCompany = (activeLanguage = lead.language) => {
    const company = companyKnowledge[activeLanguage]
    return [
      `${company.title}`,
      company.summary,
      `${activeLanguage === 'tr' ? 'Güçlü olduğumuz alanlar' : 'Core strengths'}:\n${company.strengths.map((item) => `- ${item}`).join('\n')}`,
      company.positioning
    ].join('\n\n')
  }

  const createCompanyCards = (activeLanguage = lead.language): ChatMessageCard[] => {
    const company = companyKnowledge[activeLanguage]
    return [
      { title: activeLanguage === 'tr' ? 'Kısa tanım' : 'Short profile', body: company.summary },
      { title: activeLanguage === 'tr' ? 'Güçlü alanlar' : 'Core strengths', body: company.strengths.join('\n') },
      { title: activeLanguage === 'tr' ? 'Konumlandırma' : 'Positioning', body: company.positioning }
    ]
  }

  const createRecommendationAnswer = (value: string, activeLanguage = lead.language) => {
    const recommendations = recommendProductsByNeed(value)
    if (recommendations.length === 0) {
      return {
        text:
          activeLanguage === 'tr'
            ? 'İhtiyacınızı biraz daha açarsanız doğru ürünü net önerebilirim. Örneğin satış/teklif, bayi portalı, depo/barkod, ÜTS/UTS ya da aquakültür operasyonu gibi bir süreçten bahsedebilirsiniz.'
            : 'If you describe your need in a bit more detail, I can recommend the right product. For example, sales/quotes, dealer portal, warehouse/barcode, UTS compliance or aquaculture operations.',
        cards: productKeys.map((key) => {
          const product = productKnowledge[activeLanguage][key]
          return { title: product.title, body: product.summary }
        })
      }
    }

    return {
      text: [
        text[activeLanguage].recommendationTitle,
        ...recommendations.map((key, index) => {
          const product = productKnowledge[activeLanguage][key]
          return `${index + 1}. ${product.title}: ${product.summary}`
        }),
        activeLanguage === 'tr'
          ? 'İsterseniz bu ürünlerden biri için demo veya teknik destek talebi açabilirim.'
          : 'I can open a demo or technical support request for any of these products.'
      ].join('\n\n'),
      cards: recommendations.map((key) => {
        const product = productKnowledge[activeLanguage][key]
        return { title: product.title, body: `${product.idealFor}\n\n${product.features.join('\n')}` }
      })
    }
  }

  const createProductCards = (productKey: SupportProductKey, activeLanguage = lead.language): ChatMessageCard[] => {
    const product = productKnowledge[activeLanguage][productKey]
    return [
      { title: text[activeLanguage].productAnswerPrefix, body: product.summary },
      { title: text[activeLanguage].idealFor, body: product.idealFor },
      { title: text[activeLanguage].keyFeatures, body: product.features.join('\n') },
      { title: text[activeLanguage].moduleGroups, body: product.modules.join('\n') },
      { title: text[activeLanguage].integrations, body: product.integrations.join('\n') },
      { title: text[activeLanguage].parameters, body: product.parameters.join('\n') },
      { title: text[activeLanguage].supportTopics, body: product.supportTopics.join('\n') }
    ]
  }

  const answerFromKnowledgeBase = async (question: string, product = lead.product, activeLanguage = lead.language) => {
    try {
      const result = await askKnowledgeBase(product, question, activeLanguage, sessionIdRef.current)
      const cards = result.sources.map((source) => ({
        title: source.title,
        body: `${source.summary}\n\n${source.contentMarkdown}`
      }))
      addMessage('bot', result.answer, result.usedLlm ? 'LLM + RAG' : 'Bilgi tabanı', cards)
    } catch {
      if (product) {
        addMessage('bot', describeProduct(product, activeLanguage), 'offline', createProductCards(product, activeLanguage))
      } else {
        addMessage('bot', describePortfolio(activeLanguage))
      }
    }
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
    addMessage('bot', productKnowledge[lead.language][product].summary, 'knowledge', createProductCards(product))
    void trackChatEvent('product_selected', { product, sessionId: sessionIdRef.current })
    addMessage('bot', t.askIntent, 'intent')
  }

  const selectIntent = (intent: SupportIntent) => {
    setLead((prev) => ({ ...prev, intent }))
    addMessage('system', t.requestTypeSelected, intentLabels[lead.language][intent])

    if (intent === 'product-info' && lead.product) {
      setStep('answer')
      void answerFromKnowledgeBase(lead.product, lead.product)
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
      const result = await sendSupportRequest(payload)
      void trackChatEvent('ticket_created', { product: currentLead.product, intent: currentLead.intent, sessionId: sessionIdRef.current, metadata: { ticketNo: result.ticketNo } })
      addMessage('system', result.ticketNo ? `${t.submitted}\nTicket: ${result.ticketNo}` : t.submitted, 'ticket')
      setStep('submitted')
    } catch {
      savePendingRequest({ ...currentLead, details }, messages)
      void trackChatEvent('drop_off', { product: currentLead.product, intent: currentLead.intent, sessionId: sessionIdRef.current, metadata: { reason: 'ticket_submit_failed' } })
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
    const asksCompany =
      /kimsiniz|siz kimsiniz|v3rii nedir|v3rii kim|firma|şirket|sirket|hakkınızda|hakkinda|who is|about v3rii|company/i.test(value)
    const asksRecommendation =
      /hangi ürün|hangi urun|bana uygun|ne öner|ne oner|ihtiyacım|ihtiyacim|çözüm öner|cozum oner|which product|recommend|fit me|suitable/i.test(value)
    const asksIntegrations =
      /netsis|erp|entegrasyon|integration|api|outlook|whatsapp|power bi|elogo|e-logo|pazar yeri|marketplace/i.test(value)
    const wantsPortfolio =
      /tüm|hepsi|ürünler|projeler|portfolio|all products|all projects/i.test(value) && !productFromText

    if (asksCompany) {
      addMessage('bot', describeCompany(detectedLanguage), 'company', createCompanyCards(detectedLanguage))
      addMessage('bot', activeText.askNeed, 'advisor')
      return
    }

    if (asksRecommendation) {
      const recommendation = createRecommendationAnswer(value, detectedLanguage)
      addMessage('bot', recommendation.text, 'advisor', recommendation.cards)
      return
    }

    if (asksIntegrations && !productFromText) {
      const integrationSummary =
        detectedLanguage === 'tr'
          ? 'V3RII ürün ailesinde entegrasyon omurgası güçlüdür: CRM, B2B, WMS, UTS ve AQUA tarafında Netsis/ERP referansları, mail/SMTP, Outlook, WhatsApp, Power BI, eLogo, pazar yeri ve arka plan job altyapıları ürün ihtiyacına göre kullanılır.'
          : 'The V3RII product family has a strong integration backbone: CRM, B2B, WMS, UTS and AQUA can use Netsis/ERP references, mail/SMTP, Outlook, WhatsApp, Power BI, eLogo, marketplace and background job infrastructure depending on the product need.'
      addMessage('bot', integrationSummary, 'integration', productKeys.map((key) => {
        const product = productKnowledge[detectedLanguage][key]
        return { title: product.title, body: product.integrations.join('\n') }
      }))
      return
    }

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
          void answerFromKnowledgeBase(value, undefined, detectedLanguage)
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
        void answerFromKnowledgeBase(value, lead.product, detectedLanguage)
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
    stopListening(false)
    addMessage('user', trimmed)
    setInput('')
    window.setTimeout(() => handleFlow(trimmed), 160)
  }

  useEffect(() => {
    submitMessageRef.current = submitMessage
  })

  const toggleVoiceOutput = () => {
    setVoiceOutputEnabled((prev) => {
      const next = !prev
      if (!next) {
        setConversationModeEnabled(false)
        stopSpeaking()
      }
      return next
    })
  }

  const startListening = useCallback(() => {
    const SpeechRecognition = (window as SpeechWindow).SpeechRecognition || (window as SpeechWindow).webkitSpeechRecognition

    if (!SpeechRecognition) {
      addMessage('system', t.speechNotSupported, 'voice')
      return
    }

    if (isListeningRef.current || isSending) return

    clearVoiceTimers()
    latestTranscriptRef.current = ''
    stopSpeaking()
    setVoiceOutputEnabled(true)

    const recognition = new SpeechRecognition()
    recognitionRef.current = recognition
    recognition.lang = lead.language === 'en' ? 'en-US' : 'tr-TR'
    recognition.continuous = false
    recognition.interimResults = true
    recognition.onresult = (event) => {
      let transcript = ''
      let finalTranscript = ''

      for (let index = 0; index < event.results.length; index += 1) {
        const result = event.results[index]
        transcript += result[0].transcript
        if (result.isFinal) {
          finalTranscript += result[0].transcript
        }
      }

      const nextInput = transcript.trim()
      latestTranscriptRef.current = nextInput
      setInput(nextInput)

      if (finalTranscript.trim()) {
        stopListening(false)
        submitMessageRef.current(finalTranscript.trim())
        return
      }

      if (nextInput) {
        if (voiceFinalFallbackRef.current) {
          window.clearTimeout(voiceFinalFallbackRef.current)
        }
        voiceFinalFallbackRef.current = window.setTimeout(() => {
          const stableTranscript = latestTranscriptRef.current.trim()
          if (!stableTranscript) {
            stopListening(false)
            return
          }
          stopListening(false)
          submitMessageRef.current(stableTranscript)
        }, 1400)
      }
    }
    recognition.onerror = () => {
      stopListening(true)
    }
    recognition.onend = () => {
      clearVoiceTimers()
      setIsListening(false)
    }

    setIsListening(true)
    recognition.start()
    voiceTimeoutRef.current = window.setTimeout(() => {
      const stableTranscript = latestTranscriptRef.current.trim()
      stopListening(false)
      if (stableTranscript) {
        submitMessageRef.current(stableTranscript)
      }
    }, 12000)
  }, [clearVoiceTimers, isSending, lead.language, stopListening, stopSpeaking, t.speechNotSupported])

  useEffect(() => {
    startListeningRef.current = startListening
  }, [startListening])

  const toggleListening = () => {
    if (isListening) {
      stopListening(true)
      return
    }

    setConversationModeEnabled(true)
    startListening()
  }

  const toggleConversationMode = () => {
    setConversationModeEnabled((prev) => {
      const next = !prev
      setVoiceOutputEnabled(next || voiceOutputEnabled)
      if (next) {
        startListening()
      } else {
        stopListening(false)
      }
      return next
    })
  }

  const quickActions = useMemo<QuickAction[]>(() => {
    if (step === 'product') {
      return [
        { label: t.quickCompany, value: t.quickCompany },
        { label: t.quickRecommend, value: t.quickRecommend },
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
  }, [lead.language, step, t.actions, t.portfolio, t.quickCompany, t.quickRecommend])

  const handleQuickAction = (action: QuickAction) => {
    if (step === 'submitted') {
      reset()
      return
    }
    submitMessage(action.value)
  }

  const PANEL_CLIP = 'polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px)'
  const CHIP_CLIP = 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)'
  const LAUNCHER_CLIP = 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'

  if (productModalOpen) return null

  return (
    <div
      className="fixed left-3 right-3 z-[95] flex justify-end pointer-events-none sm:right-7 sm:left-auto"
      style={{ bottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))' }}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsOpen(false)}
            className={`pointer-events-auto fixed inset-0 backdrop-blur-[3px] sm:hidden ${isLight ? 'bg-white/30' : 'bg-black/50'}`}
          />
        )}
        {isOpen && (
          <motion.aside
            key="chat-panel"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.22 }}
            style={{ clipPath: PANEL_CLIP }}
            className={`pointer-events-auto mb-3 flex h-[min(680px,calc(100dvh-120px))] w-full max-w-[430px] flex-col overflow-hidden border backdrop-blur-2xl ${
              isLight
                ? 'border-pink-400/50 bg-white/94 text-slate-950 shadow-[0_24px_70px_rgba(219,39,119,0.22)]'
                : 'border-pink-500/35 bg-[#060910]/94 text-white shadow-[0_24px_80px_rgba(219,39,119,0.28)]'
            }`}
          >
            {/* Tarama çizgisi dokusu */}
            <div
              className="pointer-events-none absolute inset-0 z-0 opacity-[0.14]"
              style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(34,211,238,0.25) 3px, rgba(34,211,238,0.25) 4px)' }}
            />

            {/* Terminal başlık çubuğu */}
            <div className={`relative z-10 border-b ${isLight ? 'border-pink-300/40 bg-pink-50/70' : 'border-pink-500/25 bg-black/50'}`}>
              <div className="flex items-center justify-between gap-2 px-4 pt-3">
                <div className="flex items-center gap-2 font-cyber text-[10px] uppercase tracking-[0.25em] text-pink-500">
                  <span className="text-cyan-400">&gt;_</span>
                  V3RII_BOT.EXE
                </div>
                <div className="flex items-center gap-1">
                  {/* Sadece mobil: başlık bilgi bloğunu aç/kapa */}
                  <button
                    onClick={() => setHeaderExpanded((prev) => !prev)}
                    className={`p-1.5 text-cyan-400 transition hover:text-pink-400 sm:hidden ${isLight ? 'hover:bg-pink-100' : 'hover:bg-white/10'}`}
                    aria-expanded={headerExpanded}
                    aria-label="Bilgi panelini aç/kapat"
                  >
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${headerExpanded ? 'rotate-180' : ''}`} />
                  </button>
                  <button onClick={() => reset()} className={`p-1.5 text-cyan-400 transition hover:text-pink-400 ${isLight ? 'hover:bg-pink-100' : 'hover:bg-white/10'}`} title={t.reset}>
                    <PackageCheck className="h-4 w-4" />
                  </button>
                  <button
                    onClick={toggleVoiceOutput}
                    className={`p-1.5 transition hover:text-pink-400 ${voiceOutputEnabled ? 'text-emerald-400' : 'text-cyan-400'} ${isLight ? 'hover:bg-pink-100' : 'hover:bg-white/10'}`}
                    title={voiceOutputEnabled ? t.voiceOutputOn : t.voiceOutputOff}
                    aria-pressed={voiceOutputEnabled}
                  >
                    {voiceOutputEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={toggleConversationMode}
                    className={`p-1.5 transition hover:text-pink-400 ${conversationModeEnabled ? 'text-emerald-400' : 'text-cyan-400'} ${isLight ? 'hover:bg-pink-100' : 'hover:bg-white/10'}`}
                    title={conversationModeEnabled ? t.conversationModeOn : t.conversationModeOff}
                    aria-pressed={conversationModeEnabled}
                  >
                    <Headphones className="h-4 w-4" />
                  </button>
                  <button onClick={() => setIsOpen(false)} className={`p-1.5 text-cyan-400 transition hover:text-pink-400 ${isLight ? 'hover:bg-pink-100' : 'hover:bg-white/10'}`} title={t.minimize}>
                    <Minimize2 className="h-4 w-4" />
                  </button>
                  <button onClick={() => setIsOpen(false)} className={`p-1.5 text-pink-500 transition hover:text-white ${isLight ? 'hover:bg-pink-500' : 'hover:bg-pink-500'}`} title={t.close}>
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className={`${headerExpanded ? 'block' : 'hidden'} sm:block`}>
              <div className="flex items-start gap-3 px-4 pb-3 pt-2">
                <div
                  style={{ clipPath: CHIP_CLIP }}
                  className={`relative grid h-11 w-11 shrink-0 place-items-center border ${
                    isLight ? 'border-cyan-400/60 bg-cyan-50 text-cyan-700' : 'border-cyan-400/40 bg-cyan-400/10 text-cyan-300'
                  }`}
                >
                  <Bot className="h-6 w-6" style={{ animation: 'cyberBotEyeBlink 4s infinite' }} />
                </div>
                <div className="min-w-0">
                  <h2 className={`truncate font-cyber text-sm font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {t.title}
                  </h2>
                  <p className={`mt-0.5 text-[11px] leading-snug ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{t.subtitle}</p>
                  <div className="mt-1.5 flex items-center gap-1.5 font-cyber text-[9px] uppercase tracking-[0.22em] text-emerald-400">
                    <span className="h-1.5 w-1.5 animate-pulse bg-emerald-400" />
                    ONLINE
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 px-4 pb-3 text-[10px]">
                <span style={{ clipPath: CHIP_CLIP }} className={`inline-flex items-center gap-1 border px-2.5 py-1 font-cyber uppercase tracking-wider ${isLight ? 'border-cyan-300/60 bg-cyan-50 text-slate-600' : 'border-cyan-400/25 bg-cyan-400/5 text-cyan-200'}`}>
                  <Building2 className="h-3 w-3" />
                  CRM / B2B / WMS / UTS
                </span>
                <span style={{ clipPath: CHIP_CLIP }} className={`inline-flex items-center gap-1 border px-2.5 py-1 font-cyber uppercase tracking-wider ${isLight ? 'border-pink-300/60 bg-pink-50 text-pink-700' : 'border-pink-500/30 bg-pink-500/5 text-pink-300'}`}>
                  <Mail className="h-3 w-3" />
                  Support mail
                </span>
                {speechSupported && (
                  <span style={{ clipPath: CHIP_CLIP }} className={`inline-flex items-center gap-1 border px-2.5 py-1 font-cyber uppercase tracking-wider ${isLight ? 'border-emerald-300/70 bg-emerald-50 text-emerald-700' : 'border-emerald-400/25 bg-emerald-400/5 text-emerald-300'}`}>
                    <Headphones className="h-3 w-3" />
                    Voice ready
                  </span>
                )}
              </div>
              </div>
            </div>

            {/* Mesaj akışı */}
            <div ref={scrollRef} className="custom-scrollbar relative z-10 min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    style={{ clipPath: CHIP_CLIP }}
                    className={`max-w-[88%] whitespace-pre-line px-3.5 py-2.5 text-sm leading-relaxed ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-pink-600 via-orange-500 to-amber-400 text-white shadow-[0_0_16px_rgba(219,39,119,0.25)]'
                        : message.sender === 'system'
                          ? isLight
                            ? 'border border-emerald-300 bg-emerald-50 text-emerald-800'
                            : 'border border-emerald-400/30 bg-emerald-400/[0.07] text-emerald-200'
                          : isLight
                            ? 'border border-pink-200 border-l-2 border-l-pink-500 bg-white/85 text-slate-800'
                            : 'border border-white/10 border-l-2 border-l-pink-500 bg-white/[0.05] text-slate-100'
                    }`}
                  >
                    {message.sender === 'bot' && (
                      <div className="mb-1 flex items-center justify-between gap-2 font-cyber text-[9px] uppercase tracking-[0.22em] text-cyan-400">
                        <span>V3RII_BOT &gt;</span>
                        {'speechSynthesis' in window && (
                          <button
                            type="button"
                            onClick={() => speak(message.text)}
                            className="grid h-6 w-6 place-items-center border border-cyan-400/25 bg-cyan-400/5 text-cyan-300 transition hover:border-pink-400 hover:text-pink-300"
                            title={t.listenAnswer}
                            aria-label={t.listenAnswer}
                            style={{ clipPath: CHIP_CLIP }}
                          >
                            <Volume2 className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    )}
                    {message.sender === 'system' && (
                      <div className="mb-1 flex items-center gap-1 font-cyber text-[10px] uppercase tracking-wider">
                        {message.meta === 'pending' ? <AlertCircle className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                        {message.meta}
                      </div>
                    )}
                    {message.text}
                    {message.cards && message.cards.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {message.cards.map((card) => (
                          <details
                            key={`${message.id}-${card.title}`}
                            style={{ clipPath: CHIP_CLIP }}
                            className={`group border px-3 py-2 ${
                              isLight ? 'border-cyan-200 bg-white/85' : 'border-cyan-400/15 bg-black/45'
                            }`}
                          >
                            <summary className="cursor-pointer list-none font-cyber text-[10px] font-bold uppercase tracking-wider text-cyan-400 transition hover:text-pink-400">
                              ▸ {card.title}
                            </summary>
                            <p className={`mt-2 whitespace-pre-line text-xs leading-relaxed ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                              {card.body}
                            </p>
                          </details>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Giriş alanı */}
            <div className={`relative z-10 border-t p-3 ${isLight ? 'border-pink-300/40 bg-pink-50/50' : 'border-pink-500/25 bg-black/45'}`}>
              {quickActions.length > 0 && (
                <div className="custom-scrollbar mb-3 flex gap-2 overflow-x-auto pb-1">
                  {quickActions.map((action) => (
                    <button
                      key={`${step}-${action.label}`}
                      onClick={() => handleQuickAction(action)}
                      style={{ clipPath: CHIP_CLIP }}
                      className={`shrink-0 border px-3 py-1.5 font-cyber text-[10px] font-semibold uppercase tracking-wider transition ${
                        isLight
                          ? 'border-cyan-300 bg-cyan-50 text-cyan-800 hover:border-pink-400 hover:bg-pink-50 hover:text-pink-700'
                          : 'border-cyan-400/30 bg-cyan-400/5 text-cyan-200 hover:border-pink-500/50 hover:bg-pink-500/10 hover:text-pink-300'
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
                <div className="relative flex-1">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-cyber text-xs text-pink-500">&gt;</span>
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
                    style={{ clipPath: CHIP_CLIP }}
                    className={`max-h-28 min-h-11 w-full resize-none border py-2.5 pl-7 pr-3 text-sm outline-none transition disabled:opacity-60 ${
                      isLight
                        ? 'border-cyan-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-pink-500 focus:shadow-[0_0_14px_rgba(219,39,119,0.2)]'
                        : 'border-cyan-400/25 bg-[#0a0f18] text-white placeholder:text-slate-500 focus:border-pink-500/60 focus:shadow-[0_0_14px_rgba(219,39,119,0.25)]'
                    }`}
                  />
                </div>
                <button
                  type="button"
                  onClick={toggleListening}
                  disabled={isSending}
                  aria-label={isListening ? t.stopVoiceInput : t.voiceInput}
                  title={isListening ? t.stopVoiceInput : t.voiceInput}
                  aria-pressed={isListening}
                  style={{ clipPath: CHIP_CLIP }}
                  className={`grid h-11 w-11 shrink-0 place-items-center border transition disabled:cursor-not-allowed disabled:opacity-60 ${
                    isListening
                      ? 'border-red-400 bg-red-500/15 text-red-300 shadow-[0_0_22px_rgba(248,113,113,0.35)]'
                      : isLight
                        ? 'border-cyan-300 bg-white text-cyan-700 hover:border-pink-500 hover:text-pink-600'
                        : 'border-cyan-400/25 bg-[#0a0f18] text-cyan-300 hover:border-pink-500/60 hover:text-pink-300'
                  }`}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </button>
                <button
                  type="submit"
                  disabled={isSending}
                  aria-label={t.send}
                  style={{ clipPath: CHIP_CLIP }}
                  className="grid h-11 w-11 shrink-0 place-items-center bg-gradient-to-br from-pink-600 via-orange-500 to-amber-400 text-white shadow-[0_0_20px_rgba(219,39,119,0.3)] transition hover:shadow-[0_0_30px_rgba(219,39,119,0.5)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
              {isListening && (
                <div className="mt-2 flex items-center gap-2 font-cyber text-[10px] uppercase tracking-[0.2em] text-emerald-400">
                  <span className="h-1.5 w-1.5 animate-pulse bg-emerald-400" />
                  {t.listening}
                </div>
              )}
              {isSpeaking && (
                <div className="mt-2 flex items-center gap-2 font-cyber text-[10px] uppercase tracking-[0.2em] text-cyan-400">
                  <span className="h-1.5 w-1.5 animate-pulse bg-cyan-400" />
                  {t.speaking}
                </div>
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Robot başlatıcı butonu (mobilde panel açıkken gizlenir, panelin kendi kapatma butonları var) */}
      <div className={`relative shrink-0 ${isOpen ? 'hidden sm:block' : ''}`}>
        {/* Ping halkası (butonun clip-path'i dışında kalması için sarmalayıcıda) */}
        {!isOpen && (
          <span
            className="pointer-events-none absolute inset-0 border border-pink-500/60"
            style={{ clipPath: LAUNCHER_CLIP, animation: 'cyberBotPing 2.4s ease-out infinite' }}
          />
        )}
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={t.title}
          style={{ clipPath: LAUNCHER_CLIP }}
          className={`pointer-events-auto relative grid h-14 w-14 place-items-center border sm:h-16 sm:w-16 ${
            isLight
              ? 'border-pink-500/60 bg-white/92 text-pink-600 shadow-[0_0_26px_rgba(219,39,119,0.35)]'
              : 'border-pink-500/50 bg-[#060910]/90 text-cyan-300 shadow-[0_0_30px_rgba(219,39,119,0.35)]'
          }`}
        >
          {/* Tarama dokusu */}
          <span
            className="pointer-events-none absolute inset-0 opacity-25"
            style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(34,211,238,0.2) 3px, rgba(34,211,238,0.2) 4px)' }}
          />
          {/* Köşe aksanları */}
          <span className="pointer-events-none absolute right-0 top-0 h-2.5 w-2.5 border-r border-t border-cyan-400/80" />
          <span className="pointer-events-none absolute bottom-0 left-0 h-2.5 w-2.5 border-b border-l border-cyan-400/80" />

          <span
            className="absolute right-0.5 top-0.5 grid h-5 w-6 place-items-center bg-gradient-to-r from-pink-600 to-orange-500 font-cyber text-[8px] font-bold text-white"
            style={{ clipPath: 'polygon(3px 0, 100% 0, 100% 100%, 0 100%, 0 3px)' }}
          >
            AI
          </span>
          {isOpen ? (
            <Headphones className="relative h-6 w-6" />
          ) : (
            <Bot className="relative h-7 w-7" style={{ animation: 'cyberBotEyeBlink 4s infinite' }} />
          )}
        </motion.button>
      </div>

      {!isOpen && (
        <div
          style={{ clipPath: CHIP_CLIP }}
          className={`pointer-events-none absolute bottom-1 right-[4.5rem] hidden max-w-[230px] border px-3 py-2 font-cyber text-[10px] uppercase tracking-wider backdrop-blur-xl sm:right-20 sm:block ${
            isLight ? 'border-pink-300/60 bg-white/88 text-slate-700' : 'border-pink-500/30 bg-[#060910]/85 text-cyan-200'
          }`}
        >
          <span className="text-pink-500">&gt;_</span> {t.closedHint}
        </div>
      )}
    </div>
  )
}
