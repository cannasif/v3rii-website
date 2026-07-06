import type { SupportRequestPayload, SupportRequestResult } from '../types/support-chatbot.types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'

export async function sendSupportRequest(payload: SupportRequestPayload): Promise<SupportRequestResult> {
  const response = await fetch(`${API_BASE_URL}/api/support-request`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(payload)
  })

  const result = (await response.json()) as SupportRequestResult

  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Support request failed')
  }

  return result
}
