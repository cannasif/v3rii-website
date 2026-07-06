import type { SupportIntent, SupportLanguage } from '../types/support-chatbot.types'

export const createId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`

export const detectSupportLanguage = (value: string, fallback: SupportLanguage): SupportLanguage => {
  const text = value.toLocaleLowerCase('tr-TR')
  const englishSignals = /\b(hello|hi|support|demo|pricing|integration|technical|problem|help|mail|email)\b/i
  const turkishSignals = /\b(merhaba|selam|destek|demo|fiyat|entegrasyon|teknik|sorun|yardım|mail|eposta|e-posta)\b/i

  if (englishSignals.test(text) && !turkishSignals.test(text)) return 'en'
  if (turkishSignals.test(text)) return 'tr'
  return fallback
}

export const detectIntent = (value: string): SupportIntent | null => {
  const text = value.toLocaleLowerCase('tr-TR')
  if (text.includes('demo') || text.includes('sunum') || text.includes('tanıtım')) return 'demo'
  if (text.includes('fiyat') || text.includes('teklif') || text.includes('pricing') || text.includes('quote')) return 'pricing'
  if (text.includes('entegrasyon') || text.includes('api') || text.includes('erp') || text.includes('integration')) {
    return 'integration'
  }
  if (text.includes('hata') || text.includes('sorun') || text.includes('bug') || text.includes('technical') || text.includes('destek')) {
    return 'technical-support'
  }
  if (text.includes('bilgi') || text.includes('nedir') || text.includes('anlat') || text.includes('info')) return 'product-info'
  return null
}

export const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())

export const shouldAskForHuman = (value: string) => {
  const text = value.toLocaleLowerCase('tr-TR')
  return ['temsilci', 'canlı destek', 'insan', 'operatör', 'human', 'agent', 'representative'].some((keyword) =>
    text.includes(keyword),
  )
}
