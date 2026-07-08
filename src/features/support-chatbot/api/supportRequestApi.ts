import type { KnowledgeArticle, SupportProductKey, SupportRequestPayload, SupportRequestResult } from '../types/support-chatbot.types'
import { api } from '../../../lib/axios'

const productMap: Record<SupportProductKey, KnowledgeArticle['product']> = {
  crm: 'Crm',
  aqua: 'Aqua',
  b2b: 'B2B',
  wms: 'Wms',
  uts: 'Uts'
}

export async function sendSupportRequest(payload: SupportRequestPayload): Promise<SupportRequestResult> {
  const result = await api.post<{ ticketNo: string }>('/api/support/tickets', {
    product: productMap[payload.product],
    intent: payload.intent,
    customerName: payload.name,
    customerEmail: payload.email,
    companyName: payload.company,
    details: payload.details,
    transcriptJson: JSON.stringify(payload.transcript),
    requiresHandoff: /canlı|temsilci|operator|acil|urgent|human|representative/i.test(payload.details),
    handoffReason: /canlı|temsilci|operator|human|representative/i.test(payload.details) ? 'Müşteri canlı destek talep etti.' : undefined,
    source: 'website-chatbot',
    leadSignalsJson: payload.leadSignals ? JSON.stringify(payload.leadSignals) : undefined
  })

  return { success: true, message: 'Talebiniz destek ekibine iletildi.', ticketNo: result.ticketNo }
}

export async function sendWebsiteContactRequest(payload: {
  product: SupportProductKey
  name: string
  email: string
  company?: string
  message: string
  language: string
}): Promise<SupportRequestResult> {
  const result = await api.post<{ ticketNo: string }>('/api/support/tickets', {
    product: productMap[payload.product],
    intent: 'demo',
    customerName: payload.name,
    customerEmail: payload.email,
    companyName: payload.company,
    details: payload.message,
    transcriptJson: JSON.stringify([
      {
        sender: 'user',
        text: payload.message,
        meta: 'website-contact-form',
        language: payload.language
      }
    ]),
    requiresHandoff: true,
    handoffReason: 'Tanıtım sitesi iletişim formu üzerinden demo/proje talebi geldi.',
    source: 'website-contact-form',
    leadSignalsJson: JSON.stringify({
      channel: 'website-contact-form',
      language: payload.language,
      hasCompany: Boolean(payload.company && payload.company !== '-'),
      messageLength: payload.message.length,
      highIntent: /demo|fiyat|teklif|pricing|quote|netsis|erp|entegrasyon/i.test(payload.message)
    })
  })

  return { success: true, message: 'Talebiniz destek ekibine iletildi.', ticketNo: result.ticketNo }
}

export async function trackChatEvent(eventType: string, payload: { product?: SupportProductKey; intent?: string; sessionId?: string; metadata?: unknown }) {
  await api.post('/api/analytics/events', {
      product: payload.product ? productMap[payload.product] : undefined,
      eventType,
      intent: payload.intent,
      sessionId: payload.sessionId,
      metadataJson: payload.metadata ? JSON.stringify(payload.metadata) : undefined
  }).catch(() => undefined)
}

export async function askKnowledgeBase(product: SupportProductKey | undefined, question: string, language: string, sessionId: string) {
  return api.post<{ answer: string; sources: KnowledgeArticle[]; usedLlm: boolean; hasDirectMatch: boolean }>('/api/chat/answer', {
      product: product ? productMap[product] : undefined,
      question,
      language,
      sessionId
  })
}

export async function synthesizeVoice(text: string, language: string, persona: 'female' | 'male'): Promise<{
  enabled: boolean
  audioBase64?: string
  contentType: string
  provider: string
  voiceName: string
}> {
  return api.post('/api/voice/synthesize', {
    text,
    language,
    persona
  })
}

export async function transcribeVoice(audio: Blob, language: string): Promise<{ enabled: boolean; success: boolean; text?: string; message?: string }> {
  const formData = new FormData()
  const extension = audio.type.includes('m4a') || audio.type.includes('mp4')
    ? 'm4a'
    : audio.type.includes('aac')
      ? 'aac'
      : audio.type.includes('mpeg') || audio.type.includes('mp3')
        ? 'mp3'
        : audio.type.includes('ogg')
          ? 'ogg'
          : audio.type.includes('wav')
            ? 'wav'
            : 'webm'
  formData.append('audio', audio, `v3rii-voice.${extension}`)
  formData.append('language', language)

  return api.post('/api/voice/transcribe', formData)
}
