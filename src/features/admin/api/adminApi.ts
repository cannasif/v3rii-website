import { api, withAuth } from '../../../lib/axios'

export type AdminAuth = {
  token: string
  expiresAt: string
  user: { id: number; email: string; fullName: string; permissions: string[] }
}

export type AdminTicket = {
  id: number
  ticketNo: string
  product: string
  intent: string
  status: string
  priority: string
  customerName: string
  customerEmail: string
  companyName?: string
  details: string
  requiresHandoff: boolean
  handoffReason?: string
  leadScore: number
  leadSegment: string
  leadSignalsJson?: string
  assignedToEmail?: string
  createdAt: string
}

export type Dashboard = {
  openTicketCount: number
  urgentTicketCount: number
  hotLeadCount: number
  handoffQueueCount: number
  waitingCustomerCount: number
  resolvedLast7Days: number
  latestTickets: AdminTicket[]
}

export type AnalyticsSummary = {
  byProduct: { key: string; count: number }[]
  byIntent: { key: string; count: number }[]
  byEventType: { key: string; count: number }[]
  chatStartedCount: number
  ticketCreatedCount: number
  dropOffCount: number
  ticketConversionRate: number
}

export type UnansweredQuestion = {
  id: number
  product?: string
  intent?: string
  sessionId?: string
  question: string
  language?: string
  reason?: string
  createdAt: string
}

export type AnswerFeedback = {
  id: number
  product?: string
  intent?: string
  sessionId?: string
  rating: string
  question: string
  answer: string
  language?: string
  createdAt: string
}

export type MailOutboxItem = {
  id: number
  to: string
  subject: string
  attemptCount: number
  sentAt?: string
  nextAttemptAt?: string
  lastError?: string
  createdAt: string
}

export type MailOutboxSummary = {
  pendingCount: number
  failedCount: number
  sentLast24HoursCount: number
  retryReadyCount: number
}

export type KnowledgeArticle = {
  id: number
  product: string
  title: string
  summary: string
  contentMarkdown: string
  tags: string
  isPublished: boolean
}

export type KnowledgeChunkRebuildResult = {
  articleCount: number
  chunkCount: number
}

export type KnowledgeChunk = {
  id: number
  knowledgeArticleId: number
  product: string
  title: string
  content: string
  tags: string
  chunkIndex: number
  tokenEstimate: number
  isPublished: boolean
}

export type ImportKnowledgeDocumentResult = {
  article: KnowledgeArticle
  characterCount: number
  fileName: string
}

export const adminApi = {
  login: (email: string, password: string) =>
    api.post<AdminAuth>('/api/auth/login', { email, password }),
  dashboard: (token: string) => api.get<Dashboard>('/api/support/tickets/dashboard', withAuth(token)),
  tickets: (token: string, params: URLSearchParams) =>
    api.get<{ items: AdminTicket[]; totalCount: number; page: number; pageSize: number }>(`/api/support/tickets?${params}`, withAuth(token)),
  analytics: (token: string) => api.get<AnalyticsSummary>('/api/analytics/summary', withAuth(token)),
  unansweredQuestions: (token: string, params: URLSearchParams) =>
    api.get<{ items: UnansweredQuestion[]; totalCount: number; page: number; pageSize: number }>(`/api/analytics/unanswered-questions?${params}`, withAuth(token)),
  answerFeedback: (token: string, params: URLSearchParams) =>
    api.get<{ items: AnswerFeedback[]; totalCount: number; page: number; pageSize: number }>(`/api/analytics/answer-feedback?${params}`, withAuth(token)),
  mailSummary: (token: string) => api.get<MailOutboxSummary>('/api/mail-outbox/summary', withAuth(token)),
  mailOutbox: (token: string, params: URLSearchParams) =>
    api.get<{ items: MailOutboxItem[]; totalCount: number; page: number; pageSize: number }>(`/api/mail-outbox?${params}`, withAuth(token)),
  retryMail: (token: string, id: number) => api.post<MailOutboxItem>(`/api/mail-outbox/${id}/retry`, undefined, withAuth(token)),
  knowledge: (token: string, product?: string) =>
    api.get<KnowledgeArticle[]>(`/api/knowledge/manage${product ? `?product=${product}` : ''}`, withAuth(token)),
  knowledgeChunks: (token: string, params: URLSearchParams) =>
    api.get<KnowledgeChunk[]>(`/api/knowledge/chunks/manage?${params}`, withAuth(token)),
  createKnowledge: (token: string, payload: Omit<KnowledgeArticle, 'id'>) =>
    api.post<KnowledgeArticle>('/api/knowledge', payload, withAuth(token)),
  updateKnowledge: (token: string, id: number, payload: Omit<KnowledgeArticle, 'id'>) =>
    api.post<KnowledgeArticle>(`/api/knowledge/${id}/update`, payload, withAuth(token)),
  importKnowledgeDocument: (token: string, payload: { product: string; title: string; tags: string; isPublished: boolean; file: File }) => {
    const formData = new FormData()
    formData.append('product', payload.product)
    formData.append('title', payload.title)
    formData.append('tags', payload.tags)
    formData.append('isPublished', String(payload.isPublished))
    formData.append('file', payload.file)
    return api.post<ImportKnowledgeDocumentResult>('/api/knowledge/import', formData, {
      ...withAuth(token),
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  rebuildKnowledgeChunks: (token: string) =>
    api.post<KnowledgeChunkRebuildResult>('/api/knowledge/chunks/rebuild', undefined, withAuth(token)),
  updateTicketStatus: (token: string, id: number, status: string, assignedToEmail?: string) =>
    api.post<AdminTicket>(`/api/support/tickets/${id}/status/update`, { status, assignedToEmail }, withAuth(token))
}
