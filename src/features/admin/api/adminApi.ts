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
  assignedToEmail?: string
  createdAt: string
}

export type Dashboard = {
  openTicketCount: number
  urgentTicketCount: number
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

export type KnowledgeArticle = {
  id: number
  product: string
  title: string
  summary: string
  contentMarkdown: string
  tags: string
  isPublished: boolean
}

export const adminApi = {
  login: (email: string, password: string) =>
    api.post<AdminAuth>('/api/auth/login', { email, password }),
  dashboard: (token: string) => api.get<Dashboard>('/api/support/tickets/dashboard', withAuth(token)),
  tickets: (token: string, params: URLSearchParams) =>
    api.get<{ items: AdminTicket[]; totalCount: number; page: number; pageSize: number }>(`/api/support/tickets?${params}`, withAuth(token)),
  analytics: (token: string) => api.get<AnalyticsSummary>('/api/analytics/summary', withAuth(token)),
  knowledge: (product?: string) => api.get<KnowledgeArticle[]>(`/api/knowledge${product ? `?product=${product}` : ''}`),
  createKnowledge: (token: string, payload: Omit<KnowledgeArticle, 'id'>) =>
    api.post<KnowledgeArticle>('/api/knowledge', payload, withAuth(token)),
  updateTicketStatus: (token: string, id: number, status: string, assignedToEmail?: string) =>
    api.patch<AdminTicket>(`/api/support/tickets/${id}/status`, { status, assignedToEmail }, withAuth(token))
}
