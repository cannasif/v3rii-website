import { useCallback, useEffect, useMemo, useState } from 'react'
import { AlertTriangle, BarChart3, BookOpen, CheckCircle2, Inbox, Lock, RefreshCw, Ticket, type LucideIcon } from 'lucide-react'
import { adminApi, type AdminAuth, type AdminTicket, type AnalyticsSummary, type Dashboard, type KnowledgeArticle } from '../api/adminApi'
import type { Theme } from '../../../App'

type Props = { theme: Theme }

const products = ['Crm', 'B2B', 'Wms', 'Uts']
const statuses = ['New', 'InProgress', 'WaitingCustomer', 'Resolved', 'Closed']

export default function AdminPanel({ theme }: Props) {
  const [auth, setAuth] = useState<AdminAuth | null>(() => {
    const raw = localStorage.getItem('v3riiAdminAuth')
    return raw ? JSON.parse(raw) as AdminAuth : null
  })
  const [email, setEmail] = useState('admin@v3rii.com')
  const [password, setPassword] = useState('')
  const [dashboard, setDashboard] = useState<Dashboard | null>(null)
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null)
  const [tickets, setTickets] = useState<AdminTicket[]>([])
  const [knowledge, setKnowledge] = useState<KnowledgeArticle[]>([])
  const [newArticle, setNewArticle] = useState({
    product: 'Crm',
    title: '',
    summary: '',
    contentMarkdown: '',
    tags: '',
    isPublished: true
  })
  const [status, setStatus] = useState('')
  const [product, setProduct] = useState('')
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')
  const isLight = theme === 'light'

  const token = auth?.token
  const metricCards: Array<[string, number, LucideIcon]> = [
    ['Açık', dashboard?.openTicketCount ?? 0, Inbox],
    ['Acil/Yüksek', dashboard?.urgentTicketCount ?? 0, AlertTriangle],
    ['Handoff', dashboard?.handoffQueueCount ?? 0, Ticket],
    ['Müşteri Bekleniyor', dashboard?.waitingCustomerCount ?? 0, BarChart3],
    ['7 günde çözülen', dashboard?.resolvedLast7Days ?? 0, CheckCircle2]
  ]

  const params = useMemo(() => {
    const next = new URLSearchParams({ page: '1', pageSize: '30' })
    if (status) next.set('status', status)
    if (product) next.set('product', product)
    if (search) next.set('search', search)
    return next
  }, [product, search, status])

  const load = useCallback(async () => {
    if (!token) return
    setError('')
    try {
      const [dashboardResult, analyticsResult, ticketsResult, knowledgeResult] = await Promise.all([
        adminApi.dashboard(token),
        adminApi.analytics(token),
        adminApi.tickets(token, params),
        adminApi.knowledge(product || undefined)
      ])
      setDashboard(dashboardResult)
      setAnalytics(analyticsResult)
      setTickets(ticketsResult.items)
      setKnowledge(knowledgeResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Admin verileri alınamadı.')
    }
  }, [params, product, token])

  useEffect(() => {
    void load()
  }, [load])

  const login = async () => {
    setError('')
    try {
      const result = await adminApi.login(email, password)
      setAuth(result)
      localStorage.setItem('v3riiAdminAuth', JSON.stringify(result))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Giriş başarısız.')
    }
  }

  const createArticle = async () => {
    if (!token || !newArticle.title.trim() || !newArticle.summary.trim()) return
    setError('')
    try {
      await adminApi.createKnowledge(token, newArticle)
      setNewArticle({ product: 'Crm', title: '', summary: '', contentMarkdown: '', tags: '', isPublished: true })
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bilgi tabanı kaydı oluşturulamadı.')
    }
  }

  if (!auth) {
    return (
      <main className={`min-h-screen px-4 py-10 font-modern ${isLight ? 'bg-slate-100 text-slate-950' : 'bg-[#070b16] text-white'}`}>
        <section className="mx-auto mt-24 max-w-md rounded-2xl border border-cyan-400/30 bg-slate-950/80 p-6 shadow-[0_24px_80px_rgba(8,47,73,0.45)]">
          <Lock className="mb-4 h-8 w-8 text-cyan-300" />
          <h1 className="text-2xl font-bold">V3RII Admin</h1>
          <p className="mt-2 text-sm text-slate-400">Destek talepleri, bilgi tabanı ve chatbot analitikleri.</p>
          <div className="mt-6 space-y-3">
            <input value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-xl border border-cyan-400/20 bg-slate-900 px-4 py-3 outline-none" />
            <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="Parola" className="w-full rounded-xl border border-cyan-400/20 bg-slate-900 px-4 py-3 outline-none" />
            {error && <p className="text-sm text-rose-300">{error}</p>}
            <button onClick={login} className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-4 py-3 font-bold text-white">Giriş yap</button>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className={`min-h-screen px-4 py-8 font-modern ${isLight ? 'bg-slate-100 text-slate-950' : 'bg-[#070b16] text-white'}`}>
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-400">V3RII Operations</p>
            <h1 className="text-3xl font-black">Destek Yönetim Paneli</h1>
          </div>
          <button onClick={load} className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/30 px-4 py-2 text-sm font-bold">
            <RefreshCw className="h-4 w-4" /> Yenile
          </button>
        </header>

        {error && <div className="mt-4 rounded-xl border border-rose-400/40 bg-rose-500/10 p-3 text-sm text-rose-200">{error}</div>}

        <section className="mt-6 grid gap-3 md:grid-cols-5">
          {metricCards.map(([label, value, Icon]) => (
            <div key={label} className="rounded-2xl border border-cyan-400/20 bg-slate-950/70 p-4">
              <Icon className="h-5 w-5 text-cyan-300" />
              <p className="mt-3 text-2xl font-black">{value}</p>
              <p className="text-xs text-slate-400">{label}</p>
            </div>
          ))}
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-[1.45fr_0.9fr]">
          <div className="rounded-2xl border border-cyan-400/20 bg-slate-950/70 p-4">
            <div className="mb-4 flex flex-wrap gap-2">
              <select value={product} onChange={(event) => setProduct(event.target.value)} className="rounded-xl bg-slate-900 px-3 py-2 text-sm">
                <option value="">Tüm ürünler</option>
                {products.map((item) => <option key={item}>{item}</option>)}
              </select>
              <select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-xl bg-slate-900 px-3 py-2 text-sm">
                <option value="">Tüm durumlar</option>
                {statuses.map((item) => <option key={item}>{item}</option>)}
              </select>
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Ara" className="min-w-[180px] rounded-xl bg-slate-900 px-3 py-2 text-sm outline-none" />
            </div>
            <div className="space-y-3">
              {tickets.map((ticket) => (
                <article key={ticket.id} className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <strong>{ticket.ticketNo} · {ticket.product}</strong>
                    <span className="rounded-full border border-cyan-400/30 px-2 py-1 text-xs">{ticket.status}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-300">{ticket.customerName} · {ticket.customerEmail}</p>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-400">{ticket.details}</p>
                  {ticket.requiresHandoff && <p className="mt-2 text-xs font-bold text-fuchsia-300">Canlı destek: {ticket.handoffReason || 'Öncelikli takip'}</p>}
                </article>
              ))}
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-cyan-400/20 bg-slate-950/70 p-4">
              <h2 className="flex items-center gap-2 font-bold"><BarChart3 className="h-4 w-4" /> Analitik</h2>
              <p className="mt-3 text-3xl font-black">{analytics?.ticketConversionRate ?? 0}%</p>
              <p className="text-xs text-slate-400">Mail/ticket dönüşüm oranı</p>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                <span>Başladı<br />{analytics?.chatStartedCount ?? 0}</span>
                <span>Ticket<br />{analytics?.ticketCreatedCount ?? 0}</span>
                <span>Drop-off<br />{analytics?.dropOffCount ?? 0}</span>
              </div>
            </div>
            <div className="rounded-2xl border border-cyan-400/20 bg-slate-950/70 p-4">
              <h2 className="flex items-center gap-2 font-bold"><BookOpen className="h-4 w-4" /> Bilgi tabanı</h2>
              <div className="mt-3 space-y-2 rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <select value={newArticle.product} onChange={(event) => setNewArticle((prev) => ({ ...prev, product: event.target.value }))} className="w-full rounded-lg bg-slate-900 px-3 py-2 text-sm">
                  {products.map((item) => <option key={item}>{item}</option>)}
                </select>
                <input value={newArticle.title} onChange={(event) => setNewArticle((prev) => ({ ...prev, title: event.target.value }))} placeholder="Başlık" className="w-full rounded-lg bg-slate-900 px-3 py-2 text-sm outline-none" />
                <input value={newArticle.summary} onChange={(event) => setNewArticle((prev) => ({ ...prev, summary: event.target.value }))} placeholder="Kısa özet" className="w-full rounded-lg bg-slate-900 px-3 py-2 text-sm outline-none" />
                <textarea value={newArticle.contentMarkdown} onChange={(event) => setNewArticle((prev) => ({ ...prev, contentMarkdown: event.target.value }))} placeholder="İçerik / doküman notu" className="min-h-20 w-full rounded-lg bg-slate-900 px-3 py-2 text-sm outline-none" />
                <input value={newArticle.tags} onChange={(event) => setNewArticle((prev) => ({ ...prev, tags: event.target.value }))} placeholder="etiketler" className="w-full rounded-lg bg-slate-900 px-3 py-2 text-sm outline-none" />
                <button onClick={createArticle} className="w-full rounded-lg bg-cyan-500 px-3 py-2 text-sm font-bold text-slate-950">Bilgi tabanına ekle</button>
              </div>
              <div className="mt-3 space-y-2">
                {knowledge.slice(0, 6).map((item) => (
                  <div key={item.id} className="rounded-xl border border-white/10 p-3 text-sm">
                    <strong>{item.title}</strong>
                    <p className="mt-1 text-xs text-slate-400">{item.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  )
}
