export type SupportLanguage = 'tr' | 'en'

export type SupportProductKey = 'crm' | 'b2b' | 'wms' | 'uts'

export type SupportIntent = 'product-info' | 'demo' | 'technical-support' | 'integration' | 'pricing'

export type SupportStep =
  | 'product'
  | 'intent'
  | 'answer'
  | 'collect-name'
  | 'collect-email'
  | 'collect-company'
  | 'collect-details'
  | 'submitted'

export type ChatSender = 'bot' | 'user' | 'system'

export type ChatMessage = {
  id: string
  sender: ChatSender
  text: string
  meta?: string
  cards?: ChatMessageCard[]
}

export type ChatMessageCard = {
  title: string
  body: string
}

export type ProductKnowledge = {
  key: SupportProductKey
  title: string
  shortTitle: string
  summary: string
  idealFor: string
  features: string[]
  modules: string[]
  integrations: string[]
  parameters: string[]
  supportTopics: string[]
}

export type SupportLead = {
  product?: SupportProductKey
  intent?: SupportIntent
  name?: string
  email?: string
  company?: string
  details?: string
  language: SupportLanguage
}

export type SupportRequestPayload = Required<Pick<SupportLead, 'name' | 'email' | 'details' | 'language'>> & {
  product: SupportProductKey
  intent: SupportIntent
  company?: string
  transcript: ChatMessage[]
}

export type SupportRequestResult = {
  success: boolean
  message: string
  ticketNo?: string
}

export type KnowledgeArticle = {
  id: number
  product: 'Crm' | 'B2B' | 'Wms' | 'Uts'
  title: string
  summary: string
  contentMarkdown: string
  tags: string
  isPublished: boolean
}
