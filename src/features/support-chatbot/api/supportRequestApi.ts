import type { KnowledgeArticle, SupportProductKey, SupportRequestPayload, SupportRequestResult } from '../types/support-chatbot.types'

const API_BASE_URL = import.meta.env.VITE_V3RII_API_BASE_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5263'

const productMap: Record<SupportProductKey, KnowledgeArticle['product']> = {
  crm: 'Crm',
  b2b: 'B2B',
  wms: 'Wms',
  uts: 'Uts'
}

type ApiResponse<T> = {
  success: boolean
  message: string
  data?: T
}

export async function sendSupportRequest(payload: SupportRequestPayload): Promise<SupportRequestResult> {
  const response = await fetch(`${API_BASE_URL}/api/support/tickets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      product: productMap[payload.product],
      intent: payload.intent,
      customerName: payload.name,
      customerEmail: payload.email,
      companyName: payload.company,
      details: payload.details,
      transcriptJson: JSON.stringify(payload.transcript),
      requiresHandoff: /canlı|temsilci|operator|acil|urgent|human|representative/i.test(payload.details),
      handoffReason: /canlı|temsilci|operator|human|representative/i.test(payload.details) ? 'Müşteri canlı destek talep etti.' : undefined,
      source: 'website-chatbot'
    })
  })

  const result = (await response.json()) as ApiResponse<{ ticketNo: string }>

  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Support request failed')
  }

  return { success: true, message: result.message, ticketNo: result.data?.ticketNo }
}

export async function trackChatEvent(eventType: string, payload: { product?: SupportProductKey; intent?: string; sessionId?: string; metadata?: unknown }) {
  await fetch(`${API_BASE_URL}/api/analytics/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      product: payload.product ? productMap[payload.product] : undefined,
      eventType,
      intent: payload.intent,
      sessionId: payload.sessionId,
      metadataJson: payload.metadata ? JSON.stringify(payload.metadata) : undefined
    })
  }).catch(() => undefined)
}

export async function askKnowledgeBase(product: SupportProductKey | undefined, question: string, language: string, sessionId: string) {
  const response = await fetch(`${API_BASE_URL}/api/chat/answer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      product: product ? productMap[product] : undefined,
      question,
      language,
      sessionId
    })
  })
  const result = (await response.json()) as ApiResponse<{ answer: string; sources: KnowledgeArticle[]; usedLlm: boolean }>
  if (!response.ok || !result.success || !result.data) {
    throw new Error(result.message || 'Knowledge request failed')
  }
  return result.data
}
