import { useCallback, useEffect, useMemo, useState } from 'react'
import { AlertTriangle, BarChart3, BookOpen, CheckCircle2, ChevronRight, Inbox, Lock, MailCheck, RefreshCw, Ticket, Upload, type LucideIcon } from 'lucide-react'
import { adminApi, type AdminAuth, type AdminTicket, type AnalyticsSummary, type AnswerFeedback, type Dashboard, type KnowledgeArticle, type KnowledgeChunk, type KnowledgeChunkRebuildResult, type MailOutboxItem, type MailOutboxSummary, type UnansweredQuestion } from '../api/adminApi'
import PlatformLayer from '../../../components/sections/PlatformLayer'
import type { Theme } from '../../../App'
import loginBg from '../../../assets/admin-login-bg.png'

const FIELD_CLIP = 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)'
const PANEL_CLIP = 'polygon(18px 0, 100% 0, 100% calc(100% - 18px), calc(100% - 18px) 100%, 0 100%, 0 18px)'

type Props = { theme: Theme }

const products = ['Crm', 'Aqua', 'B2B', 'Wms', 'Uts']
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
  const [knowledgeChunks, setKnowledgeChunks] = useState<KnowledgeChunk[]>([])
  const [unansweredQuestions, setUnansweredQuestions] = useState<UnansweredQuestion[]>([])
  const [answerFeedback, setAnswerFeedback] = useState<AnswerFeedback[]>([])
  const [mailSummary, setMailSummary] = useState<MailOutboxSummary | null>(null)
  const [mailOutbox, setMailOutbox] = useState<MailOutboxItem[]>([])
  const [mailStatus, setMailStatus] = useState('failed')
  const [chunkRebuildResult, setChunkRebuildResult] = useState<KnowledgeChunkRebuildResult | null>(null)
  const [isRebuildingChunks, setIsRebuildingChunks] = useState(false)
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importTitle, setImportTitle] = useState('')
  const [importTags, setImportTags] = useState('')
  const [importPublished, setImportPublished] = useState(true)
  const [isImportingDocument, setIsImportingDocument] = useState(false)
  const [importResult, setImportResult] = useState('')
  const [selectedArticleId, setSelectedArticleId] = useState<number | null>(null)
  const [ticketAssignments, setTicketAssignments] = useState<Record<number, string>>({})
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
    ['Hot Lead', dashboard?.hotLeadCount ?? 0, MailCheck],
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

  const unansweredParams = useMemo(() => {
    const next = new URLSearchParams({ page: '1', pageSize: '10' })
    if (product) next.set('product', product)
    if (search) next.set('search', search)
    return next
  }, [product, search])

  const mailParams = useMemo(() => {
    const next = new URLSearchParams({ page: '1', pageSize: '12' })
    if (mailStatus) next.set('status', mailStatus)
    if (search) next.set('search', search)
    return next
  }, [mailStatus, search])

  const chunkParams = useMemo(() => {
    const next = new URLSearchParams({ take: '8' })
    if (product) next.set('product', product)
    if (search) next.set('query', search)
    return next
  }, [product, search])

  const load = useCallback(async () => {
    if (!token) return
    setError('')
    try {
      const [dashboardResult, analyticsResult, ticketsResult, unansweredResult, answerFeedbackResult, mailSummaryResult, mailOutboxResult, knowledgeResult, knowledgeChunksResult] = await Promise.all([
        adminApi.dashboard(token),
        adminApi.analytics(token),
        adminApi.tickets(token, params),
        adminApi.unansweredQuestions(token, unansweredParams),
        adminApi.answerFeedback(token, unansweredParams),
        adminApi.mailSummary(token),
        adminApi.mailOutbox(token, mailParams),
        adminApi.knowledge(token, product || undefined),
        adminApi.knowledgeChunks(token, chunkParams)
      ])
      setDashboard(dashboardResult)
      setAnalytics(analyticsResult)
      setTickets(ticketsResult.items)
      setTicketAssignments(Object.fromEntries(ticketsResult.items.map((item) => [item.id, item.assignedToEmail ?? ''])))
      setUnansweredQuestions(unansweredResult.items)
      setAnswerFeedback(answerFeedbackResult.items)
      setMailSummary(mailSummaryResult)
      setMailOutbox(mailOutboxResult.items)
      setKnowledge(knowledgeResult)
      setKnowledgeChunks(knowledgeChunksResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Admin verileri alınamadı.')
    }
  }, [chunkParams, mailParams, params, product, token, unansweredParams])

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

  const resetArticleForm = () => {
    setSelectedArticleId(null)
    setNewArticle({ product: 'Crm', title: '', summary: '', contentMarkdown: '', tags: '', isPublished: true })
  }

  const editArticle = (article: KnowledgeArticle) => {
    setSelectedArticleId(article.id)
    setNewArticle({
      product: article.product,
      title: article.title,
      summary: article.summary,
      contentMarkdown: article.contentMarkdown,
      tags: article.tags,
      isPublished: article.isPublished
    })
  }

  const saveArticle = async () => {
    if (!token || !newArticle.title.trim() || !newArticle.summary.trim()) return
    setError('')
    try {
      if (selectedArticleId) {
        await adminApi.updateKnowledge(token, selectedArticleId, newArticle)
      } else {
        await adminApi.createKnowledge(token, newArticle)
      }
      resetArticleForm()
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bilgi tabanı kaydı kaydedilemedi.')
    }
  }

  const importKnowledgeDocument = async () => {
    if (!token || !importFile || isImportingDocument) return
    setError('')
    setImportResult('')
    setIsImportingDocument(true)
    try {
      const result = await adminApi.importKnowledgeDocument(token, {
        product: newArticle.product,
        title: importTitle,
        tags: importTags,
        isPublished: importPublished,
        file: importFile
      })
      setImportFile(null)
      setImportTitle('')
      setImportTags('')
      setImportResult(`${result.fileName} aktarıldı; ${result.characterCount} karakter bilgi tabanına eklendi.`)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Doküman içe aktarılamadı.')
    } finally {
      setIsImportingDocument(false)
    }
  }

  const updateTicket = async (ticket: AdminTicket, nextStatus: string, nextAssignedToEmail?: string) => {
    if (!token) return
    setError('')
    try {
      await adminApi.updateTicketStatus(token, ticket.id, nextStatus, nextAssignedToEmail?.trim() || undefined)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Destek talebi güncellenemedi.')
    }
  }

  const startArticleFromQuestion = (question: UnansweredQuestion) => {
    setSelectedArticleId(null)
    setNewArticle({
      product: question.product || product || 'Crm',
      title: question.question.slice(0, 160),
      summary: question.question,
      contentMarkdown: question.language === 'en'
        ? `Question from chatbot quality queue:\n\n${question.question}\n\nSuggested answer:`
        : `Chatbot kalite kuyruğundan gelen soru:\n\n${question.question}\n\nÖnerilen cevap:`,
      tags: ['chatbot', 'unanswered', question.reason, question.language].filter(Boolean).join(','),
      isPublished: false
    })
  }

  const retryMail = async (item: MailOutboxItem) => {
    if (!token) return
    setError('')
    try {
      await adminApi.retryMail(token, item.id)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Mail yeniden denemeye alınamadı.')
    }
  }

  const rebuildKnowledgeChunks = async () => {
    if (!token || isRebuildingChunks) return
    setError('')
    setIsRebuildingChunks(true)
    try {
      const result = await adminApi.rebuildKnowledgeChunks(token)
      setChunkRebuildResult(result)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'RAG bilgi parçaları yenilenemedi.')
    } finally {
      setIsRebuildingChunks(false)
    }
  }

  if (!auth) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 font-modern text-white">
        {/* Süreçleri ve logoyu içeren arka plan görseli */}
        <img src={loginBg} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,9,16,0.45)_0%,rgba(6,9,16,0.82)_78%)]" />
        {/* CRT tarama çizgileri */}
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{ backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.55) 0px, rgba(0,0,0,0.55) 1px, transparent 1px, transparent 3px)' }}
        />

        <section
          style={{ clipPath: PANEL_CLIP }}
          className="relative w-full max-w-md border border-pink-500/40 bg-[#060910]/88 p-6 shadow-[0_0_60px_rgba(219,39,119,0.3)] backdrop-blur-xl sm:p-8"
        >
          {/* Panel içi tarama dokusu */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.12]"
            style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(34,211,238,0.3) 3px, rgba(34,211,238,0.3) 4px)' }}
          />
          {/* Köşe aksanları */}
          <span className="pointer-events-none absolute right-2 top-2 h-4 w-4 border-r border-t border-cyan-400/70" />
          <span className="pointer-events-none absolute bottom-2 left-2 h-4 w-4 border-b border-l border-cyan-400/70" />

          <div className="relative">
            <div className="flex items-center gap-2 font-cyber text-[10px] uppercase tracking-[0.3em] text-pink-500">
              <span className="text-cyan-400">&gt;_</span>
              SYS.ADMIN // GİRİŞ GEREKLİ
              <span className="cyber-caret ml-auto text-cyan-400">▊</span>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <div
                style={{ clipPath: FIELD_CLIP }}
                className="grid h-12 w-12 shrink-0 place-items-center border border-pink-500/40 bg-pink-500/10 text-pink-400"
              >
                <Lock className="h-6 w-6" />
              </div>
              <div>
                <h1 className="font-cyber text-xl font-bold uppercase tracking-wider">
                  <span className="bg-gradient-to-r from-pink-500 via-orange-400 to-amber-400 bg-clip-text text-transparent">V3RII ADMIN</span>
                </h1>
                <p className="mt-0.5 text-xs text-slate-400">Destek talepleri, bilgi tabanı ve chatbot analitikleri.</p>
              </div>
            </div>

            <div className="mt-7 space-y-4">
              <div>
                <label className="mb-1.5 block font-cyber text-[10px] uppercase tracking-[0.25em] text-cyan-400">E-Posta</label>
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  style={{ clipPath: FIELD_CLIP }}
                  className="w-full border border-cyan-400/25 bg-[#0a0f18] px-4 py-3 text-sm outline-none transition focus:border-pink-500/60 focus:shadow-[0_0_14px_rgba(219,39,119,0.25)]"
                />
              </div>
              <div>
                <label className="mb-1.5 block font-cyber text-[10px] uppercase tracking-[0.25em] text-cyan-400">Parola</label>
                <input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  onKeyDown={(event) => { if (event.key === 'Enter') void login() }}
                  type="password"
                  placeholder="••••••••"
                  style={{ clipPath: FIELD_CLIP }}
                  className="w-full border border-cyan-400/25 bg-[#0a0f18] px-4 py-3 text-sm outline-none transition placeholder:text-slate-600 focus:border-pink-500/60 focus:shadow-[0_0_14px_rgba(219,39,119,0.25)]"
                />
              </div>

              {error && (
                <p style={{ clipPath: FIELD_CLIP }} className="border border-rose-400/40 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
                  <span className="font-cyber uppercase tracking-wider">HATA //</span> {error}
                </p>
              )}

              <button
                onClick={login}
                style={{ clipPath: 'polygon(3% 0, 100% 0, 100% 65%, 97% 100%, 0 100%, 0 35%)' }}
                className="group relative flex w-full items-center justify-center gap-2 overflow-hidden bg-gradient-to-r from-pink-600 via-orange-500 to-amber-400 py-3.5 font-cyber text-xs font-bold uppercase tracking-[0.3em] text-white shadow-[0_0_20px_rgba(219,39,119,0.35)] transition-all duration-300 hover:shadow-[0_0_36px_rgba(219,39,119,0.55)]"
              >
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                Sisteme Giriş
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>

              <div className="flex items-center justify-between font-cyber text-[9px] uppercase tracking-[0.22em] text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 animate-pulse bg-emerald-400" />
                  SİSTEM AKTİF
                </span>
                <span>YETKİLİ PERSONEL</span>
              </div>
            </div>
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
            <p className="flex items-center gap-2 font-cyber text-[11px] uppercase tracking-[0.28em] text-pink-500">
              <span className="text-cyan-400">&gt;_</span> SYS.ADMIN // V3RII OPERATIONS
            </p>
            <h1 className="mt-1 font-cyber text-2xl font-bold uppercase tracking-wider sm:text-3xl">
              <span className="bg-gradient-to-r from-pink-500 via-orange-400 to-amber-400 bg-clip-text text-transparent">Destek Yönetim Paneli</span>
            </h1>
          </div>
          <button
            onClick={load}
            style={{ clipPath: FIELD_CLIP }}
            className="inline-flex items-center gap-2 border border-pink-500/40 bg-pink-500/5 px-4 py-2 font-cyber text-xs font-bold uppercase tracking-[0.2em] text-pink-400 transition hover:border-pink-400 hover:bg-pink-500/15 hover:shadow-[0_0_18px_rgba(219,39,119,0.3)]"
          >
            <RefreshCw className="h-4 w-4" /> Yenile
          </button>
        </header>

        {error && <div className="mt-4 rounded-xl border border-rose-400/40 bg-rose-500/10 p-3 text-sm text-rose-200">{error}</div>}

        <section className="mt-6 grid gap-3 md:grid-cols-3 xl:grid-cols-6">
          {metricCards.map(([label, value, Icon]) => (
            <div key={label} style={{ clipPath: FIELD_CLIP }} className="border border-cyan-400/20 bg-slate-950/70 p-4">
              <Icon className="h-5 w-5 text-cyan-300" />
              <p className="mt-3 font-cyber text-2xl font-black text-pink-400">{value}</p>
              <p className="mt-1 font-cyber text-[10px] uppercase tracking-wider text-slate-400">{label}</p>
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
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full border px-2 py-1 text-xs ${
                        ticket.leadSegment === 'hot'
                          ? 'border-pink-400/40 bg-pink-500/10 text-pink-200'
                          : ticket.leadSegment === 'warm'
                            ? 'border-amber-400/40 bg-amber-400/10 text-amber-200'
                            : 'border-cyan-400/30 bg-cyan-400/5 text-cyan-200'
                      }`}>
                        {ticket.leadSegment?.toUpperCase?.() || 'COLD'} · {ticket.leadScore ?? 0}
                      </span>
                      <span className="rounded-full border border-cyan-400/30 px-2 py-1 text-xs">{ticket.priority}</span>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-slate-300">{ticket.customerName} · {ticket.customerEmail}</p>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-400">{ticket.details}</p>
                  {ticket.requiresHandoff && <p className="mt-2 text-xs font-bold text-fuchsia-300">Canlı destek: {ticket.handoffReason || 'Öncelikli takip'}</p>}
                  <div className="mt-3 grid gap-2 sm:grid-cols-[150px_1fr_auto]">
                    <select
                      value={ticket.status}
                      onChange={(event) => void updateTicket(ticket, event.target.value, ticketAssignments[ticket.id])}
                      className="rounded-lg border border-cyan-400/15 bg-slate-900 px-3 py-2 text-xs outline-none"
                    >
                      {statuses.map((item) => <option key={item}>{item}</option>)}
                    </select>
                    <input
                      value={ticketAssignments[ticket.id] ?? ''}
                      onChange={(event) => setTicketAssignments((prev) => ({ ...prev, [ticket.id]: event.target.value }))}
                      placeholder="Atanan e-posta"
                      className="rounded-lg border border-cyan-400/15 bg-slate-900 px-3 py-2 text-xs outline-none"
                    />
                    <button
                      onClick={() => void updateTicket(ticket, ticket.status, ticketAssignments[ticket.id])}
                      className="rounded-lg border border-pink-500/35 px-3 py-2 font-cyber text-[10px] uppercase tracking-wider text-pink-300 transition hover:bg-pink-500/10"
                    >
                      Kaydet
                    </button>
                  </div>
                </article>
              ))}
            </div>
            <div className="mt-5 rounded-2xl border border-cyan-400/20 bg-black/20 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="flex items-center gap-2 font-bold"><MailCheck className="h-4 w-4 text-cyan-300" /> Mail kuyruğu</h2>
                  <p className="mt-1 text-xs text-slate-400">Ticket mailleri outbox üzerinden işlenir; başarısız kayıtlar buradan tekrar denenebilir.</p>
                </div>
                <select value={mailStatus} onChange={(event) => setMailStatus(event.target.value)} className="rounded-xl bg-slate-900 px-3 py-2 text-xs">
                  <option value="failed">Hatalı</option>
                  <option value="retry-ready">Retry hazır</option>
                  <option value="pending">Bekleyen</option>
                  <option value="sent">Gönderilen</option>
                  <option value="">Tümü</option>
                </select>
              </div>

              <div className="mt-3 grid gap-2 sm:grid-cols-4">
                {[
                  ['Bekleyen', mailSummary?.pendingCount ?? 0],
                  ['Hatalı', mailSummary?.failedCount ?? 0],
                  ['Retry hazır', mailSummary?.retryReadyCount ?? 0],
                  ['24s gönderilen', mailSummary?.sentLast24HoursCount ?? 0]
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
                    <p className="font-cyber text-lg font-black text-cyan-300">{value}</p>
                    <p className="text-[10px] uppercase tracking-wider text-slate-500">{label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-3 space-y-2">
                {mailOutbox.length === 0 && (
                  <p className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs text-slate-400">
                    Seçili filtrede mail kaydı yok.
                  </p>
                )}
                {mailOutbox.map((item) => (
                  <article key={item.id} className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <strong className="text-sm">{item.subject}</strong>
                        <p className="mt-1 text-xs text-slate-400">{item.to}</p>
                      </div>
                      <span className="rounded-full border border-cyan-400/25 px-2 py-1 text-[10px] text-cyan-200">
                        {item.sentAt ? 'Sent' : item.lastError ? 'Failed' : 'Pending'}
                      </span>
                    </div>
                    {item.lastError && <p className="mt-2 line-clamp-2 text-xs text-rose-300">{item.lastError}</p>}
                    <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                      <span>Deneme: {item.attemptCount}</span>
                      <span>{item.nextAttemptAt ? `Sonraki: ${new Date(item.nextAttemptAt).toLocaleString('tr-TR')}` : 'Retry zamanı hazır'}</span>
                    </div>
                    {!item.sentAt && (
                      <button
                        onClick={() => void retryMail(item)}
                        className="mt-2 rounded-lg border border-pink-500/35 px-3 py-1.5 font-cyber text-[10px] uppercase tracking-wider text-pink-300 transition hover:bg-pink-500/10"
                      >
                        Şimdi tekrar dene
                      </button>
                    )}
                  </article>
                ))}
              </div>
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
              <h2 className="flex items-center gap-2 font-bold"><CheckCircle2 className="h-4 w-4 text-cyan-300" /> Yanıt geri bildirimleri</h2>
              <p className="mt-1 text-xs text-slate-400">Kullanıcıların bot cevaplarına verdiği son kalite sinyalleri.</p>
              <div className="mt-3 space-y-2">
                {answerFeedback.length === 0 && (
                  <p className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs text-slate-400">
                    Henüz cevap geri bildirimi yok.
                  </p>
                )}
                {answerFeedback.map((item) => (
                  <article
                    key={item.id}
                    className={`rounded-xl border p-3 ${
                      item.rating === 'negative'
                        ? 'border-pink-500/25 bg-pink-500/[0.06]'
                        : 'border-emerald-400/20 bg-emerald-400/[0.05]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-200">{item.question}</p>
                      <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] ${
                        item.rating === 'negative'
                          ? 'border-pink-400/30 text-pink-200'
                          : 'border-emerald-400/30 text-emerald-200'
                      }`}>
                        {item.rating === 'negative' ? 'Yetersiz' : 'Faydalı'}
                      </span>
                    </div>
                    <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-slate-400">{item.answer}</p>
                    <p className="mt-2 text-[11px] text-slate-500">
                      {item.product || '-'} · {item.language || 'tr'} · {new Date(item.createdAt).toLocaleString('tr-TR')}
                    </p>
                    {item.rating === 'negative' && (
                      <button
                        onClick={() => startArticleFromQuestion({
                          id: item.id,
                          product: item.product,
                          intent: item.intent,
                          sessionId: item.sessionId,
                          question: item.question,
                          language: item.language,
                          reason: 'negative_answer_feedback',
                          createdAt: item.createdAt
                        })}
                        className="mt-2 rounded-lg border border-pink-500/35 px-3 py-1.5 font-cyber text-[10px] uppercase tracking-wider text-pink-300 transition hover:bg-pink-500/10"
                      >
                        Bilgiye dönüştür
                      </button>
                    )}
                  </article>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-pink-500/25 bg-slate-950/70 p-4">
              <h2 className="flex items-center gap-2 font-bold"><AlertTriangle className="h-4 w-4 text-pink-300" /> Cevaplanamayan sorular</h2>
              <p className="mt-1 text-xs text-slate-400">Botun doğrudan doküman eşleşmesi bulamadığı son kayıtlar.</p>
              <div className="mt-3 space-y-2">
                {unansweredQuestions.length === 0 && (
                  <p className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs text-slate-400">
                    Şimdilik kalite kuyruğunda kayıt yok.
                  </p>
                )}
                {unansweredQuestions.map((item) => (
                  <article key={item.id} className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-200">{item.question}</p>
                      <span className="shrink-0 rounded-full border border-cyan-400/25 px-2 py-0.5 text-[10px] text-cyan-200">
                        {item.product || '-'}
                      </span>
                    </div>
                    <p className="mt-2 text-[11px] text-slate-500">
                      {item.reason || 'direct_match_missing'} · {item.language || 'tr'}
                    </p>
                    <button
                      onClick={() => startArticleFromQuestion(item)}
                      className="mt-2 rounded-lg border border-pink-500/35 px-3 py-1.5 font-cyber text-[10px] uppercase tracking-wider text-pink-300 transition hover:bg-pink-500/10"
                    >
                      Bilgiye dönüştür
                    </button>
                  </article>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-cyan-400/20 bg-slate-950/70 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="flex items-center gap-2 font-bold"><BookOpen className="h-4 w-4" /> Bilgi tabanı</h2>
                <button
                  onClick={rebuildKnowledgeChunks}
                  disabled={isRebuildingChunks}
                  className="inline-flex items-center gap-2 rounded-lg border border-cyan-400/30 px-3 py-1.5 font-cyber text-[10px] uppercase tracking-wider text-cyan-200 transition hover:bg-cyan-400/10 disabled:cursor-wait disabled:opacity-60"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isRebuildingChunks ? 'animate-spin' : ''}`} />
                  RAG indeksini yenile
                </button>
              </div>
              {chunkRebuildResult && (
                <p className="mt-2 rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-xs text-emerald-200">
                  {chunkRebuildResult.articleCount} bilgi kaydından {chunkRebuildResult.chunkCount} cevap parçası üretildi.
                </p>
              )}
              <div className="mt-2 flex items-center justify-between gap-2 text-xs text-slate-400">
                <span>{selectedArticleId ? `Düzenleniyor #${selectedArticleId}` : 'Yeni kayıt'}</span>
                {selectedArticleId && (
                  <button onClick={resetArticleForm} className="font-cyber text-[10px] uppercase tracking-wider text-cyan-300">
                    Yeni kayıt
                  </button>
                )}
              </div>
              <div className="mt-3 space-y-2 rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <select value={newArticle.product} onChange={(event) => setNewArticle((prev) => ({ ...prev, product: event.target.value }))} className="w-full rounded-lg bg-slate-900 px-3 py-2 text-sm">
                  {products.map((item) => <option key={item}>{item}</option>)}
                </select>
                <input value={newArticle.title} onChange={(event) => setNewArticle((prev) => ({ ...prev, title: event.target.value }))} placeholder="Başlık" className="w-full rounded-lg bg-slate-900 px-3 py-2 text-sm outline-none" />
                <input value={newArticle.summary} onChange={(event) => setNewArticle((prev) => ({ ...prev, summary: event.target.value }))} placeholder="Kısa özet" className="w-full rounded-lg bg-slate-900 px-3 py-2 text-sm outline-none" />
                <textarea value={newArticle.contentMarkdown} onChange={(event) => setNewArticle((prev) => ({ ...prev, contentMarkdown: event.target.value }))} placeholder="İçerik / doküman notu" className="min-h-20 w-full rounded-lg bg-slate-900 px-3 py-2 text-sm outline-none" />
                <input value={newArticle.tags} onChange={(event) => setNewArticle((prev) => ({ ...prev, tags: event.target.value }))} placeholder="etiketler" className="w-full rounded-lg bg-slate-900 px-3 py-2 text-sm outline-none" />
                <label className="flex items-center gap-2 rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={newArticle.isPublished}
                    onChange={(event) => setNewArticle((prev) => ({ ...prev, isPublished: event.target.checked }))}
                  />
                  Yayında
                </label>
                <button
                  onClick={saveArticle}
                  style={{ clipPath: 'polygon(4% 0, 100% 0, 100% 65%, 96% 100%, 0 100%, 0 35%)' }}
                  className="w-full bg-gradient-to-r from-pink-600 via-orange-500 to-amber-400 px-3 py-2.5 font-cyber text-[11px] font-bold uppercase tracking-[0.2em] text-white shadow-[0_0_16px_rgba(219,39,119,0.3)] transition hover:shadow-[0_0_26px_rgba(219,39,119,0.5)]"
                >
                  {selectedArticleId ? 'Bilgi tabanını güncelle' : 'Bilgi tabanına ekle'}
                </button>
              </div>
              <div className="mt-3 rounded-xl border border-cyan-400/15 bg-cyan-400/[0.03] p-3">
                <div className="flex items-center gap-2">
                  <Upload className="h-4 w-4 text-cyan-300" />
                  <h3 className="font-cyber text-[10px] uppercase tracking-[0.22em] text-cyan-300">Doküman import</h3>
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  TXT, Markdown, PDF ve DOCX dokümanlarını seçili ürüne bilgi kaydı olarak ekler ve RAG parçalarını otomatik üretir.
                </p>
                <div className="mt-3 space-y-2">
                  <input
                    value={importTitle}
                    onChange={(event) => setImportTitle(event.target.value)}
                    placeholder="Doküman başlığı, boşsa dosya adı kullanılır"
                    className="w-full rounded-lg bg-slate-900 px-3 py-2 text-sm outline-none"
                  />
                  <input
                    value={importTags}
                    onChange={(event) => setImportTags(event.target.value)}
                    placeholder="etiketler: crm, netsis, teklif..."
                    className="w-full rounded-lg bg-slate-900 px-3 py-2 text-sm outline-none"
                  />
                  <label className="block rounded-lg border border-dashed border-cyan-400/25 bg-slate-900 px-3 py-3 text-sm text-slate-300">
                    <input
                      type="file"
                      accept=".txt,.md,.markdown,.pdf,.docx,text/plain,text/markdown,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      className="sr-only"
                      onChange={(event) => setImportFile(event.target.files?.[0] ?? null)}
                    />
                    {importFile ? importFile.name : 'TXT, Markdown, PDF veya DOCX dosyası seç'}
                  </label>
                  <label className="flex items-center gap-2 rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={importPublished}
                      onChange={(event) => setImportPublished(event.target.checked)}
                    />
                    Aktardıktan sonra yayına al
                  </label>
                  {importResult && (
                    <p className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-xs text-emerald-200">
                      {importResult}
                    </p>
                  )}
                  <button
                    onClick={importKnowledgeDocument}
                    disabled={!importFile || isImportingDocument}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-cyan-400/30 px-3 py-2 font-cyber text-[10px] uppercase tracking-wider text-cyan-200 transition hover:bg-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    {isImportingDocument ? 'İçe aktarılıyor' : 'Dokümanı içe aktar'}
                  </button>
                </div>
              </div>
              <div className="mt-3 space-y-2">
                {knowledge.slice(0, 6).map((item) => (
                  <div key={item.id} className="rounded-xl border border-white/10 p-3 text-sm">
                    <div className="flex items-start justify-between gap-2">
                      <strong>{item.title}</strong>
                      <button onClick={() => editArticle(item)} className="font-cyber text-[10px] uppercase tracking-wider text-pink-300">
                        Düzenle
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-slate-400">{item.summary}</p>
                    <p className="mt-2 font-cyber text-[9px] uppercase tracking-wider text-cyan-300">
                      {item.product} · {item.isPublished ? 'Yayında' : 'Taslak'}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-xl border border-cyan-400/15 bg-cyan-400/[0.03] p-3">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-cyber text-[10px] uppercase tracking-[0.22em] text-cyan-300">RAG parçaları</h3>
                  <span className="text-[11px] text-slate-500">{knowledgeChunks.length} kayıt</span>
                </div>
                <div className="mt-3 space-y-2">
                  {knowledgeChunks.length === 0 && (
                    <p className="rounded-lg border border-white/10 bg-white/[0.03] p-3 text-xs text-slate-400">
                      Henüz indekslenmiş bilgi parçası görünmüyor. Bilgi tabanına kayıt ekleyin veya RAG indeksini yenileyin.
                    </p>
                  )}
                  {knowledgeChunks.map((chunk) => (
                    <div key={chunk.id} className="rounded-lg border border-white/10 bg-black/20 p-3">
                      <div className="flex items-start justify-between gap-2">
                        <strong className="text-xs text-slate-200">{chunk.title}</strong>
                        <span className="shrink-0 font-cyber text-[9px] uppercase tracking-wider text-pink-300">
                          {chunk.product} / #{chunk.chunkIndex + 1}
                        </span>
                      </div>
                      <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-slate-400">{chunk.content}</p>
                      <p className="mt-2 text-[10px] text-slate-500">
                        ~{chunk.tokenEstimate} token · {chunk.isPublished ? 'yayında' : 'taslak'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </section>

        {/* API katmanı tanıtımı: sadece admin girişi sonrası görünür */}
        <section className="mt-10 rounded-2xl border border-cyan-400/20 bg-slate-950/40 overflow-hidden">
          <PlatformLayer language="tr" theme={theme} />
        </section>
      </div>
    </main>
  )
}
