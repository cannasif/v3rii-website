const API_BASE_URL = import.meta.env.VITE_V3RII_API_BASE_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5263'

type ApiResponse<T> = {
  success: boolean
  message: string
  data: T
}

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

const request = async <T>(path: string, options: RequestInit = {}, token?: string) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  })
  const result = (await response.json()) as ApiResponse<T>
  if (!response.ok || !result.success) {
    throw new Error(result.message || 'API request failed')
  }
  return result.data
}

export const adminApi = {
  login: (email: string, password: string) =>
    request<AdminAuth>('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  dashboard: (token: string) => request<Dashboard>('/api/support/tickets/dashboard', {}, token),
  tickets: (token: string, params: URLSearchParams) => request<{ items: AdminTicket[]; totalCount: number; page: number; pageSize: number }>(`/api/support/tickets?${params}`, {}, token),
  analytics: (token: string) => request<AnalyticsSummary>('/api/analytics/summary', {}, token),
  knowledge: (product?: string) => request<KnowledgeArticle[]>(`/api/knowledge${product ? `?product=${product}` : ''}`),
  createKnowledge: (token: string, payload: Omit<KnowledgeArticle, 'id'>) =>
    request<KnowledgeArticle>('/api/knowledge', { method: 'POST', body: JSON.stringify(payload) }, token),
  updateTicketStatus: (token: string, id: number, status: string, assignedToEmail?: string) =>
    request<AdminTicket>(`/api/support/tickets/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status, assignedToEmail }) }, token)
}
