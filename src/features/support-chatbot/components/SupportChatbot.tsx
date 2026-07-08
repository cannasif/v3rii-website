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
  Upload,
  ThumbsDown,
  ThumbsUp,
  Volume2,
  VolumeX,
  X
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Language, Theme } from '../../../App'
import { askKnowledgeBase, sendSupportRequest, synthesizeVoice, trackChatEvent, transcribeVoice } from '../api/supportRequestApi'
import type {
  ChatMessage,
  ChatMessageCard,
  KnowledgeArticle,
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

type VoicePersona = 'female' | 'male'

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance

type SpeechRecognitionInstance = {
  continuous: boolean
  interimResults: boolean
  lang: string
  onresult: ((event: SpeechRecognitionEventLike) => void) | null
  onerror: ((event?: { error?: string }) => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
}

type SpeechRecognitionEventLike = {
  resultIndex: number
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
  webkitAudioContext?: typeof AudioContext
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
    voiceSessionTitle: 'AI sesli görüşme',
    voiceSessionSubtitle: 'Konuşun, ben dinleyip yanıtı seslendireyim.',
    iosVoiceTitle: 'iPhone sesli görüşme',
    iosVoiceHint:
      'iPhone’da ses kaydınızı seçin; V3RII API güvenli şekilde metne çevirip cevabı hazırlar.',
    iosVoiceAction: 'Ses kaydı gönder',
    iosVoiceInputHint: 'iPhone ses kaydı ekranı açılır. Kaydı bitirip onayladığınızda cevabı hazırlayayım.',
    iosVoiceFallbackAction: 'Ses dosyası kaydet/seç',
    stopRecording: 'Konuşmayı bitir',
    transcribing: 'Düşünüyorum...',
    transcriptionUnavailable:
      'Sizi dinledim fakat sunucuda sesli yanıt motoru henüz aktif değil. Lütfen şimdilik mesajınızı yazarak gönderin.',
    transcriptionFailed: 'Ses algılanamadı. Lütfen 2-3 saniye net konuşup tekrar deneyin veya mesajınızı yazın.',
    startConversation: 'Konuşmaya başla',
    closeConversation: 'Konuşmayı kapat',
    femaleVoice: 'Kadın sesi',
    maleVoice: 'Erkek sesi',
    voiceWaiting: 'Hazırım. Konuşmaya başla dediğinizde dinlerim.',
    voiceListeningDetail: 'Konuşabilirsiniz, sizi dinliyorum.',
    voiceSpeakingDetail: 'Yanıtı seslendiriyorum; bitince tekrar dinlemeye geçebilirim.',
    voiceManualContinue: 'Ses alamadım. Tekrar konuşmak için devam et’e dokunun.',
    voiceTapToSpeak: 'Cevap hazır. iOS Safari’de sesi duymak için cevabı sesli okuya dokunun.',
    speakAnswer: 'Cevabı sesli oku',
    continueListening: 'Devam et ve dinle',
    enableAudio: 'Sesi etkinleştir',
    audioBlocked: 'Mobil tarayıcı sesi kilitledi. Cevabı sesli okuya bir kez dokunun.',
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
    recommendationTitle: 'İhtiyacınıza göre önerim',
    contextReady: 'Bu ürün bağlamında yardımcı olabilirim',
    compareTitle: 'Ürün karşılaştırması',
    advisorNeeds: {
      dealer: 'Bayi ağım var',
      warehouse: 'Depo ve barkod yönetiyorum',
      sales: 'Satış/teklif sürecim var',
      compliance: 'UTS/ÜTS sürecim var'
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
    voiceInput: 'Speak',
    stopVoiceInput: 'Stop listening',
    voiceOutputOn: 'Voice replies on',
    voiceOutputOff: 'Voice replies off',
    conversationModeOn: 'Conversation mode on',
    conversationModeOff: 'Conversation mode off',
    voiceSessionTitle: 'AI voice session',
    voiceSessionSubtitle: 'Speak naturally; I will listen and read the answer.',
    iosVoiceTitle: 'iPhone voice session',
    iosVoiceHint:
      'On iPhone, choose a voice recording; the V3RII API securely transcribes it and prepares the answer.',
    iosVoiceAction: 'Send voice recording',
    iosVoiceInputHint: 'The iPhone voice recorder opens. When you approve the recording, I will prepare the answer.',
    iosVoiceFallbackAction: 'Record/select audio',
    stopRecording: 'Finish speaking',
    transcribing: 'Thinking...',
    transcriptionUnavailable:
      'I listened, but the server-side voice engine is not enabled yet. Please type your message for now.',
    transcriptionFailed: 'I could not detect speech. Please speak clearly for 2-3 seconds and try again or type your message.',
    startConversation: 'Start speaking',
    closeConversation: 'Close voice',
    femaleVoice: 'Female voice',
    maleVoice: 'Male voice',
    voiceWaiting: 'Ready. Press start speaking and I will listen.',
    voiceListeningDetail: 'You can speak now; I am listening.',
    voiceSpeakingDetail: 'I am reading the answer; I can listen again afterwards.',
    voiceManualContinue: 'I could not hear you. Tap continue to speak again.',
    voiceTapToSpeak: 'Answer is ready. On iOS Safari, tap read answer aloud to hear it.',
    speakAnswer: 'Read answer aloud',
    continueListening: 'Continue listening',
    enableAudio: 'Enable audio',
    audioBlocked: 'Your mobile browser blocked audio. Tap read answer aloud once.',
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
    recommendationTitle: 'My recommendation for your need',
    contextReady: 'I can help in this product context',
    compareTitle: 'Product comparison',
    advisorNeeds: {
      dealer: 'I have a dealer network',
      warehouse: 'I manage warehouse and barcode',
      sales: 'I manage sales/quote flows',
      compliance: 'I need UTS compliance'
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

const SILENT_WAV_DATA_URL = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA'

const createInitialMessages = (language: SupportLanguage): ChatMessage[] => [
  { id: createId(), sender: 'bot', text: text[language].greeting },
  { id: createId(), sender: 'bot', text: text[language].askProduct, meta: 'product' }
]

const normalizeProductKey = (value: unknown): SupportProductKey | null => {
  if (typeof value !== 'string') return null
  const normalized = value.toLowerCase()
  return productKeys.find((key) => normalized === key || normalized.includes(key)) ?? null
}

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

const splitSpeechIntoChunks = (value: string, maxLength = 180) => {
  const normalized = value.replace(/\s+/g, ' ').trim()
  if (!normalized) return []

  const sentences = normalized.match(/[^.!?;:]+[.!?;:]?/g) ?? [normalized]
  const chunks: string[] = []
  let current = ''

  sentences.forEach((sentence) => {
    const nextSentence = sentence.trim()
    if (!nextSentence) return

    if ((current + ' ' + nextSentence).trim().length <= maxLength) {
      current = (current + ' ' + nextSentence).trim()
      return
    }

    if (current) {
      chunks.push(current)
      current = ''
    }

    if (nextSentence.length <= maxLength) {
      current = nextSentence
      return
    }

    for (let index = 0; index < nextSentence.length; index += maxLength) {
      chunks.push(nextSentence.slice(index, index + maxLength).trim())
    }
  })

  if (current) {
    chunks.push(current)
  }

  return chunks
}

const writeString = (view: DataView, offset: number, value: string) => {
  for (let index = 0; index < value.length; index += 1) {
    view.setUint8(offset + index, value.charCodeAt(index))
  }
}

const encodeMonoWav = (samples: Float32Array, sampleRate: number) => {
  const buffer = new ArrayBuffer(44 + samples.length * 2)
  const view = new DataView(buffer)

  writeString(view, 0, 'RIFF')
  view.setUint32(4, 36 + samples.length * 2, true)
  writeString(view, 8, 'WAVE')
  writeString(view, 12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, 1, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * 2, true)
  view.setUint16(32, 2, true)
  view.setUint16(34, 16, true)
  writeString(view, 36, 'data')
  view.setUint32(40, samples.length * 2, true)

  let offset = 44
  for (let index = 0; index < samples.length; index += 1) {
    const sample = Math.max(-1, Math.min(1, samples[index]))
    view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true)
    offset += 2
  }

  return new Blob([view], { type: 'audio/wav' })
}

const convertRecordedAudioToWav = async (audio: Blob) => {
  if (audio.type.includes('wav')) return audio

  const AudioContextConstructor = window.AudioContext || (window as SpeechWindow).webkitAudioContext
  if (!AudioContextConstructor || !('OfflineAudioContext' in window)) return audio

  const sourceContext = new AudioContextConstructor()
  try {
    const audioBuffer = await sourceContext.decodeAudioData(await audio.arrayBuffer())
    const targetSampleRate = 16000
    const frameCount = Math.max(1, Math.ceil(audioBuffer.duration * targetSampleRate))
    const offlineContext = new OfflineAudioContext(1, frameCount, targetSampleRate)
    const source = offlineContext.createBufferSource()
    source.buffer = audioBuffer
    source.connect(offlineContext.destination)
    source.start(0)

    const rendered = await offlineContext.startRendering()
    return encodeMonoWav(rendered.getChannelData(0), targetSampleRate)
  } finally {
    void sourceContext.close()
  }
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
  const [voicePersona, setVoicePersona] = useState<VoicePersona>('female')
  const [messageFeedback, setMessageFeedback] = useState<Record<string, 'positive' | 'negative'>>({})
  const [audioUnlocked, setAudioUnlocked] = useState(false)
  const [voicePlaybackBlocked, setVoicePlaybackBlocked] = useState(false)
  const [awaitingVoiceContinue, setAwaitingVoiceContinue] = useState(false)
  const [awaitingTapToSpeak, setAwaitingTapToSpeak] = useState(false)
  const [requiresManualVoiceTurn, setRequiresManualVoiceTurn] = useState(false)
  const [isRecordingVoice, setIsRecordingVoice] = useState(false)
  const [isTranscribingVoice, setIsTranscribingVoice] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const nativeVoiceInputRef = useRef<HTMLInputElement>(null)
  const sessionIdRef = useRef(createId())
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)
  const isListeningRef = useRef(false)
  const isOpenRef = useRef(false)
  const conversationModeEnabledRef = useRef(false)
  const requiresManualVoiceTurnRef = useRef(false)
  const isMobileVoiceInputRef = useRef(false)
  const manualSpeechUnlockedRef = useRef(false)
  const suppressRecognitionRestartRef = useRef(false)
  const startListeningRef = useRef<() => void>(() => undefined)
  const submitMessageRef = useRef<(value: string) => void>(() => undefined)
  const voiceTimeoutRef = useRef<number | null>(null)
  const voiceFinalFallbackRef = useRef<number | null>(null)
  const speechKeepAliveRef = useRef<number | null>(null)
  const speechWatchdogRef = useRef<number | null>(null)
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const speechRunIdRef = useRef(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const mediaChunksRef = useRef<Blob[]>([])
  const voiceRecordingTimeoutRef = useRef<number | null>(null)
  const latestTranscriptRef = useRef('')
  const lastSpokenMessageIdRef = useRef<string | null>(null)
  const lastSpokenTextRef = useRef('')
  const lastProductContextRef = useRef<SupportProductKey | null>(null)
  const announcedProductContextRef = useRef<SupportProductKey | null>(null)
  const outputAudioRef = useRef<HTMLAudioElement | null>(null)
  const t = text[lead.language]
  const isLight = theme === 'light'

  const cleanSpeechText = useCallback(
    (value: string) =>
      value
        .replace(/>_/g, '')
        .replace(/V3RII_BOT\s*>/gi, '')
        .replace(/Ticket:/gi, lead.language === 'tr' ? 'Talep numarası:' : 'Ticket number:')
        .replace(/([\p{L}\d._%+-]+)@([\p{L}\d.-]+)\.([a-z]{2,})/giu, (_match, user, domain, extension) =>
          lead.language === 'tr'
            ? `${user} at ${domain} nokta ${extension}`
            : `${user} at ${domain} dot ${extension}`
        )
        .replace(/[•▸]/g, '. ')
        .replace(/\s[-–—]\s/g, '. ')
        .replace(/\s+/g, ' ')
        .trim(),
    [lead.language]
  )

  const clearSpeechKeepAlive = useCallback(() => {
    if (speechKeepAliveRef.current) {
      window.clearInterval(speechKeepAliveRef.current)
      speechKeepAliveRef.current = null
    }
    if (speechWatchdogRef.current) {
      window.clearTimeout(speechWatchdogRef.current)
      speechWatchdogRef.current = null
    }
  }, [])

  const stopSpeaking = useCallback(() => {
    clearSpeechKeepAlive()
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
    speechRunIdRef.current += 1
    activeUtteranceRef.current = null
    outputAudioRef.current?.pause()
    outputAudioRef.current?.removeAttribute('src')
    setIsSpeaking(false)
  }, [clearSpeechKeepAlive])

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

  const clearVoiceRecordingTimer = useCallback(() => {
    if (voiceRecordingTimeoutRef.current) {
      window.clearTimeout(voiceRecordingTimeoutRef.current)
      voiceRecordingTimeoutRef.current = null
    }
  }, [])

  const stopMediaStream = useCallback(() => {
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop())
    mediaStreamRef.current = null
  }, [])

  const selectRecordingMimeType = useCallback(() => {
    if (!('MediaRecorder' in window)) return ''

    const candidates = [
      'audio/mp4',
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/aac',
      'audio/wav'
    ]

    return candidates.find((mimeType) => MediaRecorder.isTypeSupported(mimeType)) ?? ''
  }, [])

  const selectPreferredVoice = useCallback((persona = voicePersona) => {
    const languagePrefix = lead.language === 'en' ? 'en' : 'tr'
    const localizedVoices = availableVoices.filter((voice) => voice.lang.toLowerCase().startsWith(languagePrefix))
    const femaleSignals = /female|woman|zira|seda|yelda|aylin|filiz|elif|google türkçe|google turkce/i
    const maleSignals = /male|man|cem|tolga|murat|kaan|ahmet|mehmet|emre|erkek/i
    const personaSignals = persona === 'female' ? femaleSignals : maleSignals

    return (
      localizedVoices.find((voice) => personaSignals.test(voice.name)) ??
      localizedVoices[persona === 'male' ? 1 : 0] ??
      localizedVoices[0] ??
      availableVoices.find((voice) => voice.default) ??
      null
    )
  }, [availableVoices, lead.language, voicePersona])

  const getVoiceProfile = useCallback((persona = voicePersona) => {
    if (persona === 'male') {
      return { pitch: 0.68, rate: 0.91 }
    }

    return { pitch: 1.08, rate: 0.98 }
  }, [voicePersona])

  const unlockAudioPlayback = useCallback(async () => {
    if (audioUnlocked) return true

    const audio = outputAudioRef.current ?? new Audio()
    outputAudioRef.current = audio

    try {
      audio.pause()
      audio.src = SILENT_WAV_DATA_URL
      audio.preload = 'auto'
      audio.volume = 0
      await audio.play()
      audio.pause()
      audio.currentTime = 0
      audio.volume = 1

      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(' ')
        utterance.volume = 0
        window.speechSynthesis.cancel()
        window.speechSynthesis.speak(utterance)
        window.speechSynthesis.cancel()
      }

      setAudioUnlocked(true)
      manualSpeechUnlockedRef.current = true
      setVoicePlaybackBlocked(false)
      return true
    } catch {
      audio.volume = 1
      setAudioUnlocked(false)
      setVoicePlaybackBlocked(true)
      return false
    }
  }, [audioUnlocked])

  const stopListening = useCallback((disableConversationMode = false) => {
    clearVoiceTimers()
    suppressRecognitionRestartRef.current = true
    recognitionRef.current?.stop()
    recognitionRef.current = null
    latestTranscriptRef.current = ''
    setIsListening(false)
    if (disableConversationMode) {
      setConversationModeEnabled(false)
      setAwaitingVoiceContinue(false)
      setAwaitingTapToSpeak(false)
    }
  }, [clearVoiceTimers])

  const continueVoiceConversation = useCallback(() => {
    setAwaitingVoiceContinue(false)
    setAwaitingTapToSpeak(false)
    setVoicePlaybackBlocked(false)
    setConversationModeEnabled(true)
    setVoiceOutputEnabled(true)
    manualSpeechUnlockedRef.current = true
    void unlockAudioPlayback()
    startListeningRef.current()
  }, [unlockAudioPlayback])

  const finishVoiceTurn = useCallback(() => {
    setIsSpeaking(false)
    setVoicePlaybackBlocked(false)
    setAwaitingVoiceContinue(false)
    setAwaitingTapToSpeak(false)

    if (!conversationModeEnabledRef.current || !isOpenRef.current) return

    window.setTimeout(() => startListeningRef.current(), requiresManualVoiceTurnRef.current ? 650 : 250)
  }, [])

  const speakWithBrowser = useCallback((value: string, persona = voicePersona) => {
    if (!('speechSynthesis' in window)) {
      setIsSpeaking(false)
      return
    }
    const cleaned = cleanSpeechText(value)
    if (!cleaned) {
      setIsSpeaking(false)
      return
    }

    clearSpeechKeepAlive()
    window.speechSynthesis.cancel()
    activeUtteranceRef.current = null
    const runId = speechRunIdRef.current + 1
    speechRunIdRef.current = runId
    const voiceProfile = getVoiceProfile(persona)
    const chunks = cleaned.length <= 240 ? [cleaned] : splitSpeechIntoChunks(cleaned, 170)
    const selectedVoice = selectPreferredVoice(persona)
    let chunkIndex = 0

    const isCurrentRun = () => speechRunIdRef.current === runId

    const finishRun = () => {
      if (!isCurrentRun()) return
      activeUtteranceRef.current = null
      clearSpeechKeepAlive()
      finishVoiceTurn()
    }

    const armWatchdog = (chunk: string) => {
      if (speechWatchdogRef.current) {
        window.clearTimeout(speechWatchdogRef.current)
      }
      const expectedMs = Math.max(3500, Math.min(18000, chunk.length * 95))
      speechWatchdogRef.current = window.setTimeout(() => {
        if (!isCurrentRun()) return
        activeUtteranceRef.current = null
        chunkIndex += 1
        if (chunks[chunkIndex]) {
          speakNextChunk()
          return
        }
        finishRun()
      }, expectedMs)
    }

    const speakNextChunk = () => {
      if (!isCurrentRun()) return
      const chunk = chunks[chunkIndex]
      if (!chunk) {
        finishRun()
        return
      }

      const utterance = new SpeechSynthesisUtterance(chunk)
      utterance.lang = lead.language === 'en' ? 'en-US' : 'tr-TR'
      utterance.rate = voiceProfile.rate
      utterance.pitch = voiceProfile.pitch
      utterance.voice = selectedVoice
      utterance.onstart = () => {
        if (!isCurrentRun()) return
        activeUtteranceRef.current = utterance
        manualSpeechUnlockedRef.current = true
        setAwaitingTapToSpeak(false)
        setVoicePlaybackBlocked(false)
        setIsSpeaking(true)
        armWatchdog(chunk)
        if (chunk.length > 220 && !speechKeepAliveRef.current) {
          speechKeepAliveRef.current = window.setInterval(() => {
            if (isCurrentRun()) {
              window.speechSynthesis.resume()
            }
          }, 9000)
        }
      }
      utterance.onend = () => {
        if (!isCurrentRun()) return
        if (speechWatchdogRef.current) {
          window.clearTimeout(speechWatchdogRef.current)
          speechWatchdogRef.current = null
        }
        activeUtteranceRef.current = null
        chunkIndex += 1
        window.setTimeout(speakNextChunk, 180)
      }
      utterance.onerror = (event) => {
        if (!isCurrentRun()) return
        if (speechWatchdogRef.current) {
          window.clearTimeout(speechWatchdogRef.current)
          speechWatchdogRef.current = null
        }
        activeUtteranceRef.current = null

        const errorName = typeof event === 'object' && event && 'error' in event ? String(event.error) : ''
        if (errorName === 'interrupted' || errorName === 'canceled') {
          finishRun()
          return
        }

        chunkIndex += 1
        if (chunks[chunkIndex]) {
          window.setTimeout(speakNextChunk, 220)
          return
        }

        finishRun()
      }
      activeUtteranceRef.current = utterance
      window.setTimeout(() => {
        if (!isCurrentRun()) return
        window.speechSynthesis.speak(utterance)
      }, 40)
    }

    speakNextChunk()
  }, [clearSpeechKeepAlive, cleanSpeechText, finishVoiceTurn, getVoiceProfile, lead.language, selectPreferredVoice, voicePersona])

  const speak = useCallback(async (value: string, persona = voicePersona) => {
    const cleaned = cleanSpeechText(value)
    if (!cleaned) return

    const runId = speechRunIdRef.current + 1
    speechRunIdRef.current = runId
    window.speechSynthesis?.cancel()
    outputAudioRef.current?.pause()
    outputAudioRef.current?.removeAttribute('src')
    lastSpokenTextRef.current = value

    if (requiresManualVoiceTurnRef.current && !manualSpeechUnlockedRef.current) {
      setIsSpeaking(false)
      setVoicePlaybackBlocked(false)
      if (conversationModeEnabledRef.current && isOpenRef.current) {
        window.setTimeout(() => startListeningRef.current(), 250)
      } else {
        setAwaitingTapToSpeak(true)
      }
      return
    }

    if (requiresManualVoiceTurnRef.current) {
      speakWithBrowser(value, persona)
      return
    }

    try {
      const result = await synthesizeVoice(cleaned, lead.language, persona)
      if (speechRunIdRef.current !== runId) return
      if (result.enabled && result.audioBase64) {
        const audio = outputAudioRef.current ?? new Audio()
        outputAudioRef.current = audio
        audio.pause()
        audio.src = `data:${result.contentType || 'audio/mpeg'};base64,${result.audioBase64}`
        audio.onplay = () => {
          if (speechRunIdRef.current !== runId) return
          setIsSpeaking(true)
          setVoicePlaybackBlocked(false)
          setAwaitingTapToSpeak(false)
        }
        audio.onended = () => {
          if (speechRunIdRef.current !== runId) return
          finishVoiceTurn()
        }
        audio.onerror = () => {
          if (speechRunIdRef.current !== runId) return
          speakWithBrowser(value, persona)
        }
        await audio.play()
        return
      }
    } catch {
      // Browser TTS remains the free/local fallback when API synthesis is disabled or unreachable.
    }

    if (speechRunIdRef.current !== runId) return
    speakWithBrowser(value, persona)
  }, [cleanSpeechText, finishVoiceTurn, lead.language, speakWithBrowser, voicePersona])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, isOpen])

  useEffect(() => {
    const SpeechRecognition = (window as SpeechWindow).SpeechRecognition || (window as SpeechWindow).webkitSpeechRecognition
    setSpeechSupported(Boolean(SpeechRecognition && 'speechSynthesis' in window))

    const userAgent = window.navigator.userAgent
    const isIos = /iPad|iPhone|iPod/.test(userAgent) || (userAgent.includes('Mac') && navigator.maxTouchPoints > 1)
    const isMobileVoiceInput =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(userAgent) ||
      (userAgent.includes('Mac') && navigator.maxTouchPoints > 1)
    isMobileVoiceInputRef.current = isMobileVoiceInput
    setRequiresManualVoiceTurn(isIos)
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
    requiresManualVoiceTurnRef.current = requiresManualVoiceTurn
  }, [requiresManualVoiceTurn])

  useEffect(() => {
    const lastMessage = messages[messages.length - 1]
    if (!isOpen || !voiceOutputEnabled || !lastMessage || lastMessage.sender !== 'bot') return
    if (lastSpokenMessageIdRef.current === lastMessage.id) return

    lastSpokenMessageIdRef.current = lastMessage.id
    lastSpokenTextRef.current = lastMessage.text
    setAwaitingTapToSpeak(false)
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
      const detail = (event as CustomEvent<{ open: boolean; productKey?: string; title?: string }>).detail
      setProductModalOpen(Boolean(detail?.open))

      const contextProduct = normalizeProductKey(detail?.productKey || detail?.title)
      if (!contextProduct || contextProduct === lastProductContextRef.current) return

      lastProductContextRef.current = contextProduct
      setLead((prev) => ({ ...prev, product: contextProduct }))
      setStep((prev) => (prev === 'product' ? 'intent' : prev))
      void trackChatEvent('product_context_detected', {
        product: contextProduct,
        sessionId: sessionIdRef.current,
        metadata: { source: 'product-modal', title: detail?.title }
      })
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

  useEffect(() => {
    const onChatCommand = (event: Event) => {
      const detail = (event as CustomEvent<{ open?: boolean; product?: string; intent?: SupportIntent; message?: string }>).detail
      if (!detail) return

      if (detail.open) {
        setIsOpen(true)
      }

      const commandProduct = normalizeProductKey(detail.product)
      if (commandProduct) {
        setLead((prev) => ({ ...prev, product: commandProduct, intent: detail.intent ?? prev.intent }))
        setStep(detail.intent === 'demo' ? 'collect-name' : 'intent')
        addMessage('system', lead.language === 'tr' ? 'Web sitesi analizinden ürün bağlamı alındı.' : 'Product context received from website analysis.', productKnowledge[lead.language][commandProduct].title)
      }

      if (detail.message) {
        addMessage('user', detail.message)
        addMessage('bot', detail.intent === 'demo' ? t.askName : t.askIntent, detail.intent ?? 'intent')
        void trackChatEvent('calculator_demo_requested', {
          product: commandProduct ?? lead.product,
          intent: detail.intent ?? 'demo',
          sessionId: sessionIdRef.current,
          metadata: {
            source: 'operation-value-calculator',
            message: detail.message
          }
        })
      }
    }

    window.addEventListener('v3rii-chat-command', onChatCommand)
    return () => window.removeEventListener('v3rii-chat-command', onChatCommand)
  }, [addMessage, lead.language, lead.product, t.askIntent, t.askName])

  const submitAnswerFeedback = (message: ChatMessage, rating: 'positive' | 'negative') => {
    setMessageFeedback((prev) => ({ ...prev, [message.id]: rating }))
    const messageIndex = messages.findIndex((item) => item.id === message.id)
    const previousQuestion = [...messages.slice(0, messageIndex)]
      .reverse()
      .find((item) => item.sender === 'user')?.text ?? '-'

    void trackChatEvent('answer_feedback', {
      product: lead.product,
      intent: lead.intent || 'product-info',
      sessionId: sessionIdRef.current,
      metadata: {
        rating,
        question: previousQuestion,
        answer: message.text,
        language: lead.language,
        meta: message.meta,
        sourceCount: message.cards?.length ?? 0
      }
    })

    if (rating === 'negative') {
      void trackChatEvent('unanswered_question', {
        product: lead.product,
        intent: lead.intent || 'product-info',
        sessionId: sessionIdRef.current,
        metadata: {
          question: previousQuestion,
          language: lead.language,
          reason: 'negative_answer_feedback'
        }
      })
    }
  }

  useEffect(() => {
    const contextProduct = lastProductContextRef.current
    if (!isOpen || !contextProduct || announcedProductContextRef.current === contextProduct) return

    announcedProductContextRef.current = contextProduct
    const product = productKnowledge[lead.language][contextProduct]
    addMessage(
      'bot',
      `${t.contextReady}: ${product.title}. ${product.summary}`,
      'context',
      createProductCards(contextProduct, lead.language).slice(0, 4)
    )
    addMessage('bot', t.askIntent, 'intent')
  }, [isOpen, lead.language, t.askIntent, t.contextReady])

  const reset = (nextLanguage = lead.language) => {
    stopListening(true)
    stopSpeaking()
    setAwaitingVoiceContinue(false)
    setAwaitingTapToSpeak(false)
    setVoicePlaybackBlocked(false)
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

  const createComparisonAnswer = (first: SupportProductKey, second: SupportProductKey, activeLanguage = lead.language) => {
    const firstProduct = productKnowledge[activeLanguage][first]
    const secondProduct = productKnowledge[activeLanguage][second]
    const labels = activeLanguage === 'tr'
      ? {
          focus: 'Odak',
          bestFor: 'En uygun kullanım',
          modules: 'Modül ağırlığı',
          integration: 'Entegrasyon',
          result: 'Kısa karar'
        }
      : {
          focus: 'Focus',
          bestFor: 'Best fit',
          modules: 'Module emphasis',
          integration: 'Integration',
          result: 'Short decision'
        }

    const decision =
      activeLanguage === 'tr'
        ? `${firstProduct.shortTitle} daha çok ${firstProduct.idealFor.toLocaleLowerCase('tr-TR')} için; ${secondProduct.shortTitle} ise ${secondProduct.idealFor.toLocaleLowerCase('tr-TR')} için konumlanır.`
        : `${firstProduct.shortTitle} is positioned for ${firstProduct.idealFor.toLowerCase()}; ${secondProduct.shortTitle} is positioned for ${secondProduct.idealFor.toLowerCase()}.`

    return {
      text: `${text[activeLanguage].compareTitle}: ${firstProduct.shortTitle} vs ${secondProduct.shortTitle}\n\n${decision}`,
      cards: [
        {
          title: firstProduct.title,
          body: `${labels.focus}: ${firstProduct.summary}\n\n${labels.bestFor}: ${firstProduct.idealFor}\n\n${labels.modules}:\n${firstProduct.modules.slice(0, 4).join('\n')}\n\n${labels.integration}:\n${firstProduct.integrations.join('\n')}`
        },
        {
          title: secondProduct.title,
          body: `${labels.focus}: ${secondProduct.summary}\n\n${labels.bestFor}: ${secondProduct.idealFor}\n\n${labels.modules}:\n${secondProduct.modules.slice(0, 4).join('\n')}\n\n${labels.integration}:\n${secondProduct.integrations.join('\n')}`
        },
        {
          title: labels.result,
          body:
            activeLanguage === 'tr'
              ? `Satış, teklif, müşteri ve raporlama diyorsanız CRM; bayi portalı, katalog, müşteri fiyat/stok görünürlüğü diyorsanız B2B; depo/barkod/kalite diyorsanız WMS; UTS/ÜTS mevzuat listeleri diyorsanız UTS daha doğru başlangıçtır.`
              : `Choose CRM for sales, quotes, customers and reporting; B2B for dealer portal, catalog and customer price/stock visibility; WMS for warehouse, barcode and quality; UTS for product-tracking compliance lists.`
        }
      ]
    }
  }

  const detectComparisonProducts = (value: string): [SupportProductKey, SupportProductKey] | null => {
    const normalized = value.toLocaleLowerCase('tr-TR')
    const mentioned = productKeys.filter((key) => {
      if (normalized.includes(key)) return true
      const product = productKnowledge.tr[key]
      return normalized.includes(product.shortTitle.toLocaleLowerCase('tr-TR'))
    })

    const unique = Array.from(new Set(mentioned))
    if (unique.length >= 2 && /vs|karşılaştır|karsilastir|fark|farkı|farki|compare|difference/i.test(value)) {
      return [unique[0], unique[1]]
    }

    if (/crm.*b2b|b2b.*crm/i.test(value)) return ['crm', 'b2b']
    if (/wms.*uts|uts.*wms|wms.*üts|üts.*wms/i.test(value)) return ['wms', 'uts']
    if (/crm.*wms|wms.*crm/i.test(value)) return ['crm', 'wms']
    if (/b2b.*wms|wms.*b2b/i.test(value)) return ['b2b', 'wms']
    return null
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

  const formatKnowledgeProduct = (product: string) => {
    const normalized = normalizeProductKey(product)
    return normalized ? productKnowledge[lead.language][normalized].shortTitle : product
  }

  const createKnowledgeSourceCards = (sources: KnowledgeArticle[], activeLanguage = lead.language): ChatMessageCard[] =>
    sources.slice(0, 5).map((source, index) => {
      const labels = activeLanguage === 'tr'
        ? { source: 'Kaynak', product: 'Ürün', summary: 'Özet', content: 'İçerik', tags: 'Etiketler' }
        : { source: 'Source', product: 'Product', summary: 'Summary', content: 'Content', tags: 'Tags' }

      return {
        title: `${labels.source} ${index + 1} // ${source.title}`,
        body: [
          `${labels.product}: ${formatKnowledgeProduct(source.product)}`,
          source.summary ? `${labels.summary}: ${source.summary}` : '',
          source.contentMarkdown ? `${labels.content}:\n${source.contentMarkdown}` : '',
          source.tags ? `${labels.tags}: ${source.tags}` : ''
        ].filter(Boolean).join('\n\n')
      }
    })

  const answerFromKnowledgeBase = async (question: string, product = lead.product, activeLanguage = lead.language) => {
    try {
      const result = await askKnowledgeBase(product, question, activeLanguage, sessionIdRef.current)
      const cards = createKnowledgeSourceCards(result.sources, activeLanguage)
      if (!result.hasDirectMatch) {
        void trackChatEvent('unanswered_question', {
          product,
          intent: 'product-info',
          sessionId: sessionIdRef.current,
          metadata: {
            question,
            language: activeLanguage,
            reason: result.sources.length > 0 ? 'fallback_sources_only' : 'no_source'
          }
        })
      } else {
        void trackChatEvent('knowledge_answered', {
          product,
          intent: 'product-info',
          sessionId: sessionIdRef.current,
          metadata: {
            question,
            language: activeLanguage,
            sourceCount: result.sources.length,
            usedLlm: result.usedLlm
          }
        })
      }
      addMessage('bot', result.answer, result.usedLlm ? 'LLM + RAG' : 'Bilgi tabanı', cards)
    } catch {
      void trackChatEvent('unanswered_question', {
        product,
        intent: 'product-info',
        sessionId: sessionIdRef.current,
        metadata: {
          question,
          language: activeLanguage,
          reason: 'knowledge_api_failed'
        }
      })
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
      transcript: messages,
      leadSignals: {
        sessionId: sessionIdRef.current,
        language: currentLead.language,
        messageCount: messages.length,
        hasCompany: Boolean(currentLead.company && currentLead.company !== '-'),
        requestedProduct: currentLead.product,
        requestedIntent: currentLead.intent,
        productContext: lastProductContextRef.current,
        detailsLength: details.length,
        mentioned: {
          netsisOrErp: /netsis|erp|logo|sap|entegrasyon|integration/i.test(details),
          pricing: /fiyat|teklif|pricing|quote|bütçe|budget/i.test(details),
          demo: /demo|görüşme|meeting|sunum|presentation/i.test(details),
          warehouse: /depo|barkod|sevkiyat|warehouse|barcode/i.test(details),
          dealer: /bayi|portal|katalog|dealer|b2b/i.test(details),
          compliance: /uts|üts|ut s|mevzuat|compliance/i.test(details),
          urgent: /acil|urgent|kritik|çalışmıyor|error|hata/i.test(details)
        }
      }
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
    const asksCompany = !productFromText &&
      /kimsiniz|siz kimsiniz|v3rii nedir|v3rii kim|firma|şirket|sirket|hakkınızda|hakkinda|who is|about v3rii|company/i.test(value)
    const asksRecommendation =
      /hangi ürün|hangi urun|bana uygun|ne öner|ne oner|ihtiyacım|ihtiyacim|çözüm öner|cozum oner|which product|recommend|fit me|suitable/i.test(value)
    const asksIntegrations =
      /netsis|erp|entegrasyon|integration|api|outlook|whatsapp|power bi|elogo|e-logo|pazar yeri|marketplace/i.test(value)
    const wantsPortfolio =
      /tüm|hepsi|ürünler|projeler|portfolio|all products|all projects/i.test(value) && !productFromText
    const comparisonProducts = detectComparisonProducts(value)

    if (asksCompany) {
      addMessage('bot', describeCompany(detectedLanguage), 'company', createCompanyCards(detectedLanguage))
      addMessage('bot', activeText.askNeed, 'advisor')
      return
    }

    if (comparisonProducts) {
      const comparison = createComparisonAnswer(comparisonProducts[0], comparisonProducts[1], detectedLanguage)
      void trackChatEvent('product_compared', {
        product: comparisonProducts[0],
        intent: 'product-info',
        sessionId: sessionIdRef.current,
        metadata: { comparedWith: comparisonProducts[1], question: value }
      })
      addMessage('bot', comparison.text, 'comparison', comparison.cards)
      addMessage('bot', activeText.askNeed, 'advisor')
      return
    }

    if (asksRecommendation) {
      const recommendation = createRecommendationAnswer(value, detectedLanguage)
      void trackChatEvent('product_recommendation_requested', {
        product: productFromText ?? undefined,
        intent: 'product-info',
        sessionId: sessionIdRef.current,
        metadata: { question: value }
      })
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
      } else {
        manualSpeechUnlockedRef.current = true
        void unlockAudioPlayback()
      }
      return next
    })
  }

  const stopRecordedVoiceInput = useCallback(() => {
    clearVoiceRecordingTimer()
    const recorder = mediaRecorderRef.current
    if (recorder && recorder.state !== 'inactive') {
      try {
        recorder.requestData()
      } catch {
        // Some browsers do not support flushing recorder data explicitly.
      }
      window.setTimeout(() => {
        if (mediaRecorderRef.current === recorder && recorder.state !== 'inactive') {
          recorder.stop()
        }
      }, 120)
      return
    }

    mediaRecorderRef.current = null
    stopMediaStream()
    setIsRecordingVoice(false)
  }, [clearVoiceRecordingTimer, stopMediaStream])

  const processVoiceAudio = useCallback((audio: Blob, source: 'media-recorder' | 'native-capture') => {
    if (audio.size < 1200) {
      void trackChatEvent('voice_upload_skipped_empty', { sessionId: sessionIdRef.current, metadata: { source } })
      addMessage('system', t.transcriptionFailed, 'voice')
      return
    }

    setIsTranscribingVoice(true)
    const shouldUseOriginalAudio =
      source === 'native-capture' ||
      requiresManualVoiceTurnRef.current ||
      /mp4|m4a|aac|mpeg|ogg/i.test(audio.type)

    Promise.resolve(shouldUseOriginalAudio ? audio : convertRecordedAudioToWav(audio))
      .catch(() => audio)
      .then((preparedAudio) => {
        void trackChatEvent('voice_upload_start', {
          sessionId: sessionIdRef.current,
          metadata: {
            source,
            originalType: audio.type,
            originalSize: audio.size,
            uploadType: preparedAudio.type,
            uploadSize: preparedAudio.size
          }
        })
        return transcribeVoice(preparedAudio, lead.language)
      })
      .then((result) => {
        void trackChatEvent(result.success ? 'voice_upload_success' : 'voice_upload_failed', {
          sessionId: sessionIdRef.current,
          metadata: { source, enabled: result.enabled, hasText: Boolean(result.text?.trim()), message: result.message }
        })
        const transcript = result.text?.trim()
        if (result.success && transcript) {
          setInput(transcript)
          submitMessageRef.current(transcript)
          return
        }

        addMessage('system', result.enabled ? result.message || t.transcriptionFailed : t.transcriptionUnavailable, 'voice')
      })
      .catch((error) => {
        void trackChatEvent('voice_upload_exception', {
          sessionId: sessionIdRef.current,
          metadata: { source, message: error instanceof Error ? error.message : String(error) }
        })
        addMessage('system', t.transcriptionFailed, 'voice')
      })
      .finally(() => setIsTranscribingVoice(false))
  }, [lead.language, t.transcriptionFailed, t.transcriptionUnavailable])

  const startRecordedVoiceInput = useCallback(async () => {
    if (isRecordingVoice) {
      stopRecordedVoiceInput()
      return
    }

    if (requiresManualVoiceTurnRef.current) {
      setConversationModeEnabled(true)
      setVoiceOutputEnabled(true)
      setAwaitingVoiceContinue(false)
      setAwaitingTapToSpeak(false)
      setVoicePlaybackBlocked(false)
      manualSpeechUnlockedRef.current = true
      stopSpeaking()
      void unlockAudioPlayback()
      void trackChatEvent('voice_native_capture_open', {
        sessionId: sessionIdRef.current,
        metadata: { reason: 'ios-primary', userAgent: window.navigator.userAgent }
      })
      nativeVoiceInputRef.current?.click()
      return
    }

    if (!navigator.mediaDevices?.getUserMedia || !('MediaRecorder' in window)) {
      void trackChatEvent('voice_record_unsupported', {
        sessionId: sessionIdRef.current,
        metadata: { userAgent: window.navigator.userAgent }
      })
      nativeVoiceInputRef.current?.click()
      return
    }

    setConversationModeEnabled(true)
    setVoiceOutputEnabled(true)
    setAwaitingVoiceContinue(false)
    setAwaitingTapToSpeak(false)
    setVoicePlaybackBlocked(false)
    manualSpeechUnlockedRef.current = true
    mediaChunksRef.current = []
    stopSpeaking()
    void unlockAudioPlayback()

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      })
      const mimeType = selectRecordingMimeType()
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined)
      void trackChatEvent('voice_record_start', {
        sessionId: sessionIdRef.current,
        metadata: {
          mimeType: recorder.mimeType || mimeType || 'browser-default',
          userAgent: window.navigator.userAgent
        }
      })

      mediaStreamRef.current = stream
      mediaRecorderRef.current = recorder

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          mediaChunksRef.current.push(event.data)
        }
      }

      recorder.onerror = () => {
        void trackChatEvent('voice_record_error', {
          sessionId: sessionIdRef.current,
          metadata: { mimeType: recorder.mimeType || mimeType || 'unknown' }
        })
        clearVoiceRecordingTimer()
        stopMediaStream()
        mediaRecorderRef.current = null
        setIsRecordingVoice(false)
        addMessage('system', t.transcriptionFailed, 'voice')
      }

      recorder.onstop = () => {
        clearVoiceRecordingTimer()
        stopMediaStream()
        mediaRecorderRef.current = null
        setIsRecordingVoice(false)

        const chunks = mediaChunksRef.current
        mediaChunksRef.current = []
        const audioType = recorder.mimeType || mimeType || 'audio/mp4'
        const audio = new Blob(chunks, { type: audioType })
        void trackChatEvent('voice_record_stop', {
          sessionId: sessionIdRef.current,
          metadata: { chunkCount: chunks.length, size: audio.size, type: audio.type || audioType }
        })
        processVoiceAudio(audio, 'media-recorder')
      }

      recorder.start(1000)
      setIsRecordingVoice(true)
      voiceRecordingTimeoutRef.current = window.setTimeout(() => {
        if (mediaRecorderRef.current?.state === 'recording') {
          mediaRecorderRef.current.stop()
        }
      }, 10000)
    } catch {
      void trackChatEvent('voice_permission_or_start_error', {
        sessionId: sessionIdRef.current,
        metadata: { userAgent: window.navigator.userAgent }
      })
      clearVoiceRecordingTimer()
      stopMediaStream()
      mediaRecorderRef.current = null
      setIsRecordingVoice(false)
      nativeVoiceInputRef.current?.click()
    }
  }, [
    clearVoiceRecordingTimer,
    isRecordingVoice,
    processVoiceAudio,
    selectRecordingMimeType,
    stopMediaStream,
    stopRecordedVoiceInput,
    stopSpeaking,
    t.transcriptionFailed,
    unlockAudioPlayback
  ])

  const startListening = useCallback(() => {
    if (requiresManualVoiceTurnRef.current) {
      void startRecordedVoiceInput()
      return
    }

    const SpeechRecognition = (window as SpeechWindow).SpeechRecognition || (window as SpeechWindow).webkitSpeechRecognition

    if (!SpeechRecognition) {
      addMessage('system', t.speechNotSupported, 'voice')
      return
    }

    if (isListeningRef.current || isSending) return

    clearVoiceTimers()
    suppressRecognitionRestartRef.current = false
    setAwaitingVoiceContinue(false)
    setAwaitingTapToSpeak(false)
    setVoicePlaybackBlocked(false)
    latestTranscriptRef.current = ''
    stopSpeaking()
    void unlockAudioPlayback()
    lastSpokenMessageIdRef.current = messages[messages.length - 1]?.id ?? lastSpokenMessageIdRef.current
    setVoiceOutputEnabled(true)

    const recognition = new SpeechRecognition()
    recognitionRef.current = recognition
    recognition.lang = lead.language === 'en' ? 'en-US' : 'tr-TR'
    recognition.continuous = !isMobileVoiceInputRef.current
    recognition.interimResults = true
    recognition.onresult = (event) => {
      let transcript = ''
      let finalTranscript = ''

      if (isMobileVoiceInputRef.current) {
        const lastIndex = event.results.length - 1
        if (lastIndex >= 0) {
          const lastResult = event.results[lastIndex]
          transcript = lastResult[0].transcript
          if (lastResult.isFinal) {
            finalTranscript = lastResult[0].transcript
          }
        }
      } else {
        for (let index = 0; index < event.results.length; index += 1) {
          const result = event.results[index]
          transcript += result[0].transcript
          if (result.isFinal) {
            finalTranscript += result[0].transcript
          }
        }
      }

      const nextInput = transcript.trim()
      latestTranscriptRef.current = nextInput
      setInput(nextInput)

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
        }, finalTranscript.trim() ? 900 : 1500)
      }
    }
    recognition.onerror = (event) => {
      clearVoiceTimers()
      recognitionRef.current = null
      setIsListening(false)

      const stableTranscript = latestTranscriptRef.current.trim()
      if (stableTranscript) {
        latestTranscriptRef.current = ''
        submitMessageRef.current(stableTranscript)
        return
      }

      if (event?.error === 'not-allowed' || event?.error === 'service-not-allowed') {
        latestTranscriptRef.current = ''
        stopListening(true)
        return
      }

      if (conversationModeEnabledRef.current && isOpenRef.current) {
        setAwaitingVoiceContinue(true)
      }
    }
    recognition.onend = () => {
      clearVoiceTimers()
      setIsListening(false)
      recognitionRef.current = null

      const stableTranscript = latestTranscriptRef.current.trim()
      if (stableTranscript) {
        latestTranscriptRef.current = ''
        submitMessageRef.current(stableTranscript)
        return
      }

      if (suppressRecognitionRestartRef.current) {
        suppressRecognitionRestartRef.current = false
        return
      }

      if (conversationModeEnabledRef.current && isOpenRef.current && !latestTranscriptRef.current.trim()) {
        setAwaitingVoiceContinue(true)
      }
    }

    try {
      recognition.start()
      setIsListening(true)
    } catch {
      recognitionRef.current = null
      setIsListening(false)
      setVoicePlaybackBlocked(true)
      if (conversationModeEnabledRef.current && isOpenRef.current) {
        setAwaitingVoiceContinue(true)
      }
      return
    }
    voiceTimeoutRef.current = window.setTimeout(() => {
      const stableTranscript = latestTranscriptRef.current.trim()
      stopListening(false)
      if (stableTranscript) {
        submitMessageRef.current(stableTranscript)
      }
    }, 12000)
  }, [
    clearVoiceTimers,
    isSending,
    lead.language,
    messages,
    startRecordedVoiceInput,
    stopListening,
    stopSpeaking,
    t.speechNotSupported,
    unlockAudioPlayback
  ])

  useEffect(() => {
    startListeningRef.current = startListening
  }, [startListening])

  const toggleListening = () => {
    if (isListening) {
      const stableTranscript = latestTranscriptRef.current.trim() || input.trim()
      stopListening(false)
      if (stableTranscript) {
        submitMessageRef.current(stableTranscript)
      }
      return
    }

    setConversationModeEnabled(true)
    manualSpeechUnlockedRef.current = true
    if (requiresManualVoiceTurnRef.current) {
      void startRecordedVoiceInput()
      return
    }
    startListening()
  }

  const speakLastAnswerFromUserGesture = () => {
    const lastAnswer = lastSpokenTextRef.current.trim()
    if (!lastAnswer) return

    setVoiceOutputEnabled(true)
    setConversationModeEnabled(true)
    manualSpeechUnlockedRef.current = true
    setAwaitingTapToSpeak(false)
    setVoicePlaybackBlocked(false)
    void speak(lastAnswer)
  }

  const changeVoicePersona = (persona: VoicePersona) => {
    setVoicePersona(persona)
    manualSpeechUnlockedRef.current = true
    void unlockAudioPlayback()

    if (isSpeaking && lastSpokenTextRef.current) {
      window.setTimeout(() => speak(lastSpokenTextRef.current, persona), 80)
    }
  }

  const closeConversationMode = () => {
    stopListening(false)
    stopRecordedVoiceInput()
    stopSpeaking()
    setVoiceOutputEnabled(false)
    setConversationModeEnabled(false)
    manualSpeechUnlockedRef.current = false
    setAwaitingVoiceContinue(false)
    setAwaitingTapToSpeak(false)
    setVoicePlaybackBlocked(false)
  }

  const toggleConversationMode = () => {
    if (conversationModeEnabled) {
      closeConversationMode()
      return
    }

    setConversationModeEnabled(true)
    lastSpokenMessageIdRef.current = messages[messages.length - 1]?.id ?? lastSpokenMessageIdRef.current
    setVoiceOutputEnabled(true)
    manualSpeechUnlockedRef.current = true
    void unlockAudioPlayback()
    if (requiresManualVoiceTurnRef.current) {
      void startRecordedVoiceInput()
      return
    }
    startListening()
  }

  const quickActions = useMemo<QuickAction[]>(() => {
    if (step === 'product') {
      return [
        { label: t.quickCompany, value: t.quickCompany },
        { label: t.quickRecommend, value: t.quickRecommend },
        {
          label: t.advisorNeeds.dealer,
          value: lead.language === 'tr' ? 'Bayi ağım var, müşteri portalı ve katalog için hangi ürün uygun?' : 'I have a dealer network, customer portal and catalog need. Which product fits?'
        },
        {
          label: t.advisorNeeds.warehouse,
          value: lead.language === 'tr' ? 'Depo, barkod, sevkiyat ve stok sayımı için hangi ürün uygun?' : 'Which product fits warehouse, barcode, shipment and stock count?'
        },
        {
          label: t.advisorNeeds.sales,
          value: lead.language === 'tr' ? 'Satış, teklif, müşteri ve raporlama için hangi ürün uygun?' : 'Which product fits sales, quotes, customers and reporting?'
        },
        {
          label: t.advisorNeeds.compliance,
          value: lead.language === 'tr' ? 'UTS ve ÜTS süreçleri için hangi ürün uygun?' : 'Which product fits UTS compliance workflows?'
        },
        { label: 'CRM vs B2B', value: lead.language === 'tr' ? 'CRM ile B2B farkı nedir?' : 'Compare CRM and B2B' },
        { label: 'WMS vs UTS', value: lead.language === 'tr' ? 'WMS ile UTS farkı nedir?' : 'Compare WMS and UTS' },
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
  }, [lead.language, step, t.actions, t.advisorNeeds, t.portfolio, t.quickCompany, t.quickRecommend])

  const handleQuickAction = (action: QuickAction) => {
    if (step === 'submitted') {
      reset()
      return
    }
    submitMessage(action.value)
  }

  const handleNativeVoiceFile = (file: File | undefined) => {
    if (!file) return

    setConversationModeEnabled(true)
    setVoiceOutputEnabled(true)
    setAwaitingVoiceContinue(false)
    setAwaitingTapToSpeak(false)
    setVoicePlaybackBlocked(false)
    void trackChatEvent('voice_file_selected', {
      sessionId: sessionIdRef.current,
      metadata: { name: file.name, type: file.type, size: file.size, userAgent: window.navigator.userAgent }
    })
    processVoiceAudio(file, 'native-capture')
  }

  const PANEL_CLIP = 'polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px)'
  const CHIP_CLIP = 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)'
  const LAUNCHER_CLIP = 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
  const voiceSessionVisible =
    conversationModeEnabled || isListening || isSpeaking || isRecordingVoice || isTranscribingVoice || awaitingVoiceContinue || awaitingTapToSpeak
  const voiceStatusText = voicePlaybackBlocked
    ? t.audioBlocked
    : isTranscribingVoice
      ? t.transcribing
    : isRecordingVoice
      ? t.voiceListeningDetail
    : awaitingTapToSpeak
      ? t.voiceTapToSpeak
    : awaitingVoiceContinue
      ? t.voiceManualContinue
      : isSpeaking
        ? t.voiceSpeakingDetail
        : isListening
          ? t.voiceListeningDetail
          : t.voiceWaiting

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

            {voiceSessionVisible && (
              <div className={`relative z-10 border-b px-4 py-3 ${isLight ? 'border-cyan-200/70 bg-cyan-50/70' : 'border-cyan-400/20 bg-cyan-400/[0.04]'}`}>
                <div
                  style={{ clipPath: CHIP_CLIP }}
                  className={`relative overflow-hidden border p-3 ${
                    isLight
                      ? 'border-cyan-300/70 bg-white/88 shadow-[0_0_24px_rgba(34,211,238,0.16)]'
                      : 'border-cyan-400/25 bg-[#070d15]/90 shadow-[0_0_28px_rgba(34,211,238,0.14)]'
                  }`}
                >
                  <div
                    className="pointer-events-none absolute inset-0 opacity-20"
                    style={{ backgroundImage: 'linear-gradient(90deg, rgba(34,211,238,0.18), transparent 36%, rgba(236,72,153,0.14))' }}
                  />
                  <div className="relative flex items-start gap-3">
                    <div className="relative grid h-14 w-14 shrink-0 place-items-center">
                      <span
                        className={`absolute inset-0 border ${isListening ? 'border-emerald-400/60' : isSpeaking ? 'border-cyan-400/60' : 'border-pink-400/50'}`}
                        style={{ clipPath: 'circle(50%)', animation: 'cyberBotPing 1.8s ease-out infinite' }}
                      />
                      <span
                        className={`absolute inset-2 border ${isListening ? 'border-emerald-400/45' : isSpeaking ? 'border-cyan-400/45' : 'border-pink-400/35'}`}
                        style={{ clipPath: 'circle(50%)', animation: 'cyberBotPing 2.4s ease-out infinite' }}
                      />
                      <div
                        className={`relative grid h-11 w-11 place-items-center border ${
                          isLight
                            ? 'border-cyan-300 bg-white text-cyan-700'
                            : 'border-cyan-400/35 bg-cyan-400/10 text-cyan-200'
                        }`}
                        style={{ clipPath: 'circle(50%)' }}
                      >
                        <Headphones className="h-5 w-5" />
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-cyber text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-400">
                            {requiresManualVoiceTurn ? t.iosVoiceTitle : t.voiceSessionTitle}
                          </p>
                          <p className={`mt-1 text-xs leading-snug ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                            {requiresManualVoiceTurn ? t.iosVoiceHint : t.voiceSessionSubtitle}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={closeConversationMode}
                          className={`shrink-0 border px-2 py-1 font-cyber text-[9px] uppercase tracking-wider transition ${
                            isLight
                              ? 'border-pink-300 bg-pink-50 text-pink-700 hover:bg-pink-100'
                              : 'border-pink-500/35 bg-pink-500/10 text-pink-300 hover:bg-pink-500/20'
                          }`}
                          style={{ clipPath: CHIP_CLIP }}
                        >
                          {t.closeConversation}
                        </button>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-2">
                        {(['female', 'male'] as VoicePersona[]).map((persona) => (
                          <button
                            key={persona}
                            type="button"
                            onClick={() => changeVoicePersona(persona)}
                            className={`border px-2 py-1.5 font-cyber text-[10px] uppercase tracking-wider transition ${
                              voicePersona === persona
                                ? 'border-emerald-400 bg-emerald-400/12 text-emerald-300 shadow-[0_0_16px_rgba(52,211,153,0.16)]'
                                : isLight
                                  ? 'border-cyan-200 bg-white text-slate-600 hover:border-pink-300 hover:text-pink-700'
                                  : 'border-cyan-400/20 bg-black/25 text-cyan-200 hover:border-pink-500/40 hover:text-pink-300'
                            }`}
                            style={{ clipPath: CHIP_CLIP }}
                            aria-pressed={voicePersona === persona}
                          >
                            {persona === 'female' ? t.femaleVoice : t.maleVoice}
                          </button>
                        ))}
                      </div>

                      <div className="mt-3 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (isListening) {
                              const stableTranscript = latestTranscriptRef.current.trim() || input.trim()
                              stopListening(false)
                              if (stableTranscript) {
                                submitMessageRef.current(stableTranscript)
                              }
                              return
                            }
                            if (awaitingVoiceContinue) {
                              continueVoiceConversation()
                              return
                            }
                            if (awaitingTapToSpeak) {
                              speakLastAnswerFromUserGesture()
                              return
                            }
                            setConversationModeEnabled(true)
                            manualSpeechUnlockedRef.current = true
                            if (requiresManualVoiceTurnRef.current) {
                              void startRecordedVoiceInput()
                              return
                            }
                            startListening()
                          }}
                          disabled={(!speechSupported && !requiresManualVoiceTurn) || isSending || isTranscribingVoice}
                          className={`min-h-10 flex-1 border px-3 py-2 font-cyber text-[10px] font-bold uppercase tracking-wider transition disabled:cursor-not-allowed disabled:opacity-55 ${
                            isListening
                              ? 'border-red-400 bg-red-500/15 text-red-300'
                              : 'border-cyan-400/45 bg-cyan-400/10 text-cyan-200 hover:border-pink-500/60 hover:text-pink-300'
                          }`}
                          style={{ clipPath: CHIP_CLIP }}
                        >
                          {isRecordingVoice
                            ? t.stopRecording
                            : isTranscribingVoice
                              ? t.transcribing
                              : isListening
                            ? t.stopVoiceInput
                            : awaitingTapToSpeak
                              ? t.speakAnswer
                              : awaitingVoiceContinue
                                ? t.continueListening
                                : requiresManualVoiceTurn
                                  ? t.iosVoiceAction
                                  : t.startConversation}
                        </button>
                        <div className="flex h-10 items-end gap-1 px-1" aria-hidden="true">
                          {[0, 1, 2, 3, 4].map((bar) => (
                            <span
                              key={bar}
                              className={`w-1.5 ${isListening ? 'bg-emerald-400' : isSpeaking ? 'bg-cyan-400' : 'bg-pink-400/60'}`}
                              style={{
                                transformOrigin: 'bottom',
                                height: `${12 + (bar % 3) * 7}px`,
                                animation: voiceSessionVisible ? `cyberVoiceBar ${0.9 + bar * 0.12}s ease-in-out infinite` : undefined,
                                animationDelay: `${bar * 80}ms`
                              }}
                            />
                          ))}
                        </div>
                      </div>

                      {requiresManualVoiceTurn && (
                        <button
                          type="button"
                          onClick={() => {
                            void trackChatEvent('voice_native_capture_open', {
                              sessionId: sessionIdRef.current,
                              metadata: { userAgent: window.navigator.userAgent }
                            })
                            nativeVoiceInputRef.current?.click()
                          }}
                          disabled={isSending || isRecordingVoice || isTranscribingVoice}
                          className={`mt-2 flex min-h-9 w-full items-center justify-center gap-2 border px-3 py-2 font-cyber text-[10px] font-bold uppercase tracking-wider transition disabled:cursor-not-allowed disabled:opacity-55 ${
                            isLight
                              ? 'border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              : 'border-emerald-400/35 bg-emerald-400/[0.08] text-emerald-300 hover:bg-emerald-400/[0.14]'
                          }`}
                          style={{ clipPath: CHIP_CLIP }}
                        >
                          <Upload className="h-3.5 w-3.5" />
                          {t.iosVoiceFallbackAction}
                        </button>
                      )}

                      <div className={`mt-2 flex items-center gap-2 font-cyber text-[10px] uppercase tracking-[0.18em] ${isListening ? 'text-emerald-400' : isSpeaking ? 'text-cyan-400' : 'text-pink-400'}`}>
                        <span className="h-1.5 w-1.5 animate-pulse bg-current" />
                        {voiceStatusText}
                      </div>
                      {voicePlaybackBlocked && (
                        <button
                          type="button"
                          onClick={() => {
                            speakLastAnswerFromUserGesture()
                          }}
                          className={`mt-2 border px-3 py-1.5 font-cyber text-[10px] font-bold uppercase tracking-wider transition ${
                            isLight
                              ? 'border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              : 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/20'
                          }`}
                          style={{ clipPath: CHIP_CLIP }}
                        >
                          {t.speakAnswer}
                        </button>
                      )}
                      {awaitingTapToSpeak && !voicePlaybackBlocked && (
                        <button
                          type="button"
                          onClick={speakLastAnswerFromUserGesture}
                          className={`mt-2 border px-3 py-1.5 font-cyber text-[10px] font-bold uppercase tracking-wider transition ${
                            isLight
                              ? 'border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              : 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/20'
                          }`}
                          style={{ clipPath: CHIP_CLIP }}
                        >
                          {t.speakAnswer}
                        </button>
                      )}
                      {awaitingVoiceContinue && !voicePlaybackBlocked && (
                        <button
                          type="button"
                          onClick={continueVoiceConversation}
                          className={`mt-2 border px-3 py-1.5 font-cyber text-[10px] font-bold uppercase tracking-wider transition ${
                            isLight
                              ? 'border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              : 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/20'
                          }`}
                          style={{ clipPath: CHIP_CLIP }}
                        >
                          {t.continueListening}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

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
                            onClick={() => {
                              setVoiceOutputEnabled(true)
                              manualSpeechUnlockedRef.current = true
                              lastSpokenTextRef.current = message.text
                              if (requiresManualVoiceTurnRef.current) {
                                setAwaitingTapToSpeak(false)
                                setVoicePlaybackBlocked(false)
                                void speak(message.text)
                                return
                              }
                              void unlockAudioPlayback().finally(() => speak(message.text))
                            }}
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
                    {message.sender === 'bot' && message.meta !== 'product' && (
                      <div className="mt-3 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => submitAnswerFeedback(message, 'positive')}
                          disabled={Boolean(messageFeedback[message.id])}
                          className={`grid h-7 w-7 place-items-center border transition ${
                            messageFeedback[message.id] === 'positive'
                              ? 'border-emerald-400 bg-emerald-400/15 text-emerald-300'
                              : isLight
                                ? 'border-cyan-200 bg-white/70 text-cyan-700 hover:border-emerald-400 hover:text-emerald-600'
                                : 'border-cyan-400/20 bg-cyan-400/5 text-cyan-300 hover:border-emerald-400 hover:text-emerald-300'
                          } disabled:cursor-default`}
                          title={lead.language === 'tr' ? 'Yanıt faydalıydı' : 'Helpful answer'}
                          aria-label={lead.language === 'tr' ? 'Yanıt faydalıydı' : 'Helpful answer'}
                          style={{ clipPath: CHIP_CLIP }}
                        >
                          <ThumbsUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => submitAnswerFeedback(message, 'negative')}
                          disabled={Boolean(messageFeedback[message.id])}
                          className={`grid h-7 w-7 place-items-center border transition ${
                            messageFeedback[message.id] === 'negative'
                              ? 'border-pink-400 bg-pink-500/15 text-pink-300'
                              : isLight
                                ? 'border-cyan-200 bg-white/70 text-cyan-700 hover:border-pink-400 hover:text-pink-600'
                                : 'border-cyan-400/20 bg-cyan-400/5 text-cyan-300 hover:border-pink-400 hover:text-pink-300'
                          } disabled:cursor-default`}
                          title={lead.language === 'tr' ? 'Yanıt yetersizdi' : 'Not helpful'}
                          aria-label={lead.language === 'tr' ? 'Yanıt yetersizdi' : 'Not helpful'}
                          style={{ clipPath: CHIP_CLIP }}
                        >
                          <ThumbsDown className="h-3.5 w-3.5" />
                        </button>
                        {messageFeedback[message.id] && (
                          <span className={`font-cyber text-[9px] uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                            {lead.language === 'tr' ? 'Geri bildirim alındı' : 'Feedback saved'}
                          </span>
                        )}
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
                <input
                  ref={nativeVoiceInputRef}
                  type="file"
                  accept="audio/*"
                  capture
                  className="hidden"
                  onChange={(event) => {
                    handleNativeVoiceFile(event.target.files?.[0])
                    event.target.value = ''
                  }}
                />
                <div className="relative flex-1">
                  {requiresManualVoiceTurn && conversationModeEnabled && (
                    <div
                      className={`mb-2 border px-3 py-2 font-cyber text-[10px] uppercase leading-relaxed tracking-wider ${
                        isLight
                          ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                          : 'border-emerald-400/30 bg-emerald-400/[0.08] text-emerald-300'
                      }`}
                      style={{ clipPath: CHIP_CLIP }}
                    >
                      {t.iosVoiceInputHint}
                    </div>
                  )}
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-cyber text-xs text-pink-500">&gt;</span>
                  <textarea
                    ref={inputRef}
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
                  disabled={isSending || isTranscribingVoice}
                  aria-label={isRecordingVoice ? t.stopRecording : isListening ? t.stopVoiceInput : requiresManualVoiceTurn ? t.iosVoiceAction : t.voiceInput}
                  title={isRecordingVoice ? t.stopRecording : isListening ? t.stopVoiceInput : requiresManualVoiceTurn ? t.iosVoiceAction : t.voiceInput}
                  aria-pressed={isListening || isRecordingVoice}
                  style={{ clipPath: CHIP_CLIP }}
                  className={`grid h-11 w-11 shrink-0 place-items-center border transition disabled:cursor-not-allowed disabled:opacity-60 ${
                    isListening || isRecordingVoice
                      ? 'border-red-400 bg-red-500/15 text-red-300 shadow-[0_0_22px_rgba(248,113,113,0.35)]'
                      : isLight
                        ? 'border-cyan-300 bg-white text-cyan-700 hover:border-pink-500 hover:text-pink-600'
                        : 'border-cyan-400/25 bg-[#0a0f18] text-cyan-300 hover:border-pink-500/60 hover:text-pink-300'
                  }`}
                >
                  {isListening || isRecordingVoice ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
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
              {isListening && !voiceSessionVisible && (
                <div className="mt-2 flex items-center gap-2 font-cyber text-[10px] uppercase tracking-[0.2em] text-emerald-400">
                  <span className="h-1.5 w-1.5 animate-pulse bg-emerald-400" />
                  {t.listening}
                </div>
              )}
              {isSpeaking && !voiceSessionVisible && (
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
