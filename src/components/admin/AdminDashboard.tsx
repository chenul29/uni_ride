import { FormEvent, useEffect, useState } from 'react'
import PDFDocument from 'pdfkit'
import * as pdfKitModule from 'pdfkit'
import Helvetica from 'pdfkit/standard-fonts/Helvetica'
import { AdminIcon } from './AdminIcon'
import { supabase } from '../../lib/supabase'
import { AdminManagement } from './AdminManagement'

type IconName = Parameters<typeof AdminIcon>[0]['name']

const navItems: { label: string; icon: IconName }[] = [
  { label: 'Dashboard', icon: 'dashboard' }, { label: 'Students', icon: 'students' }, { label: 'Wallets', icon: 'wallet' },
  { label: 'Tickets', icon: 'ticket' }, { label: 'Route', icon: 'route' }, { label: 'Feedback', icon: 'feedback' }, { label: 'Reports', icon: 'reports' }, { label: 'Settings', icon: 'settings' },
]

const reports = [
  ['Admin Activity Report', 'A summary of actions performed in the portal.', 'K.A.S.S Wijethunga'],
  ['Student Wallet Activity Report', 'Top-ups and wallet balance activity by student.', 'Dineth Kausalya'],
  ['Money Transaction Report', 'A detailed record of UniRide money movements.', 'Thathsarani Liyanarathne'],
  ['Feedback Report', 'Student feedback and ratings.', 'W.M.C.D Warnasooriya'],
  ['Detailed Report about Ticket Distribution', 'Ticket sales and distribution by period.', 'Ramith Keshara'],
  ['Report about Student Login Activities', 'Student sign-in activity and usage patterns.', 'J.E Wijerathna'],
]

type Student = {
  id: string
  full_name: string
  email: string
  created_at: string
}

type Feedback = {
  id: string
  student_name: string
  feedback: string
  rating: number
  created_at: string
}

type WalletTransaction = {
  booking_token: string
  route: string
  tickets: number
  payment_method: string
  amount: number
  balance_after: number
  status: string
  created_at: string
}

type WalletTopUp = {
  id: string
  student_id: string
  amount: number
  created_at: string
}

type TicketPurchase = {
  id: string
  student_id: string | null
  booking_token: string
  route: string
  tickets: number
  payment_method: string
  amount: number
  balance_after: number
  status: string
  created_at: string
}

function Panel({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) {
  return <section className={`admin-panel ${className}`}><div className="admin-panel-heading"><h2>{title}</h2><button className="admin-text-button">View all <span aria-hidden="true">-&gt;</span></button></div>{children}</section>
}

function TicketSalesChart({ transactions }: { transactions: TicketPurchase[] }) {
  const today = new Date()
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (6 - index))
    const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
    const count = transactions.reduce((total, transaction) => {
      const purchased = new Date(transaction.created_at)
      const purchasedKey = `${purchased.getFullYear()}-${purchased.getMonth()}-${purchased.getDate()}`
      return total + (purchasedKey === key ? Number(transaction.tickets) : 0)
    }, 0)
    return { key, label: date.toLocaleDateString(undefined, { weekday: 'short' }), count }
  })
  const max = Math.max(1, ...days.map(({ count }) => count))

  return <Panel title="Tickets Sold · Last 7 Days" className="sales-panel"><div className="bar-chart" aria-label="Database ticket sales for the last seven days">{days.map(({ key, label, count }) => <div className="bar-column" key={key}><span>{count}</span><div className="bar-track"><div className="bar-fill" style={{ height: `${(count / max) * 100}%` }} /></div><small>{label}</small></div>)}</div></Panel>
}

function TransactionStatusChart({ transactions }: { transactions: TicketPurchase[] }) {
  const completed = transactions.filter(({ status }) => status.toLowerCase() === 'completed').length
  const pending = transactions.filter(({ status }) => status.toLowerCase() === 'pending').length
  const other = transactions.length - completed - pending
  const total = transactions.length
  const completedPercent = total ? (completed / total) * 100 : 0
  const pendingPercent = total ? (pending / total) * 100 : 0
  const chartStyle = {
    background: total
      ? `conic-gradient(#16a34a 0 ${completedPercent}%, #f59e0b ${completedPercent}% ${completedPercent + pendingPercent}%, #cbd5e1 ${completedPercent + pendingPercent}% 100%)`
      : '#e2e8f0',
  }

  return <Panel title="Transaction Status" className="verification-panel"><div className="verification-summary"><div className="donut-chart" style={chartStyle}><div><strong>{total}</strong><small>Transactions</small></div></div><div className="verification-legend"><span><i className="legend-valid" />Completed <b>{completed}</b></span><span><i className="legend-invalid" />Pending <b>{pending}</b></span><span><i className="legend-used" />Other <b>{other}</b></span></div></div></Panel>
}

function VerificationChart({ transactions }: { transactions: TicketPurchase[] }) {
  return <TransactionStatusChart transactions={transactions} />
}

function ActivityFeed({ students, feedback, transactions }: { students: Student[]; feedback: Feedback[]; transactions: TicketPurchase[] }) {
  const items = [
    ...students.map((student) => ({ id: `student-${student.id}`, icon: 'students' as IconName, title: 'Student registered', text: student.full_name, createdAt: student.created_at })),
    ...feedback.map((item) => ({ id: `feedback-${item.id}`, icon: 'feedback' as IconName, title: 'Feedback submitted', text: `${item.student_name} · ${item.rating}/5`, createdAt: item.created_at })),
    ...transactions.map((item) => ({ id: `transaction-${item.id}`, icon: 'ticket' as IconName, title: 'Ticket purchase', text: `${item.route} · ${item.tickets} ticket(s) · LKR ${Number(item.amount).toFixed(2)}`, createdAt: item.created_at })),
  ].sort((first, second) => new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime()).slice(0, 4)

  return <Panel title="Recent Activity"><div className="activity-list">{items.length === 0 ? <p className="admin-empty-state">No recent database activity.</p> : items.map((item) => <div className="activity-item" key={item.id}><span className="activity-icon"><AdminIcon name={item.icon} size={16} /></span><div><strong>{item.title}</strong><p>{item.text}</p><time dateTime={item.createdAt}>{new Date(item.createdAt).toLocaleString()}</time></div></div>)}</div></Panel>
}

function FeedbackSnapshot({ feedback, loading, error, onDelete }: { feedback: Feedback[]; loading: boolean; error: string; onDelete: (item: Feedback) => void }) {
  return <Panel title="Recent Feedback"><div className="feedback-list">
    {error && <p className="database-status database-status-error">{error}</p>}
    {loading ? <p className="admin-empty-state">Loading feedback...</p> : feedback.length === 0 ? <p className="admin-empty-state">No feedback has been submitted yet.</p> : feedback.map((item) => <div key={item.id}>
      <div className="feedback-meta"><strong>{item.student_name}</strong><span className="stars">{'★'.repeat(item.rating)}<span>{'★'.repeat(5 - item.rating)}</span></span></div>
      <p>&quot;{item.feedback}&quot;</p>
      <div className="feedback-row-footer"><time>{new Date(item.created_at).toLocaleDateString()}</time><button className="student-delete-button" onClick={() => onDelete(item)}>Delete</button></div>
    </div>)}
  </div></Panel>
}

function StudentsPanel({ students, loading, error, onDelete }: { students: Student[]; loading: boolean; error: string; onDelete: (student: Student) => void }) {
  return <section id="students" className="admin-panel" style={{ marginTop: 28 }}>
    <div className="admin-panel-heading"><div><h2>Students</h2><p className="admin-panel-subtitle">Registered student accounts</p></div><span className="eyebrow">{students.length} total</span></div>
    {error && <p className="database-status database-status-error">{error}</p>}
    {loading ? <p className="admin-empty-state">Loading students...</p> : students.length === 0 ? <p className="admin-empty-state">No students have registered yet.</p> : <div className="students-table-wrap"><table className="students-table"><thead><tr><th>Name</th><th>Email</th><th>Joined</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{students.map((student) => <tr key={student.id}><td><strong>{student.full_name}</strong></td><td>{student.email}</td><td>{new Date(student.created_at).toLocaleDateString()}</td><td><button className="student-delete-button" onClick={() => onDelete(student)}>Delete</button></td></tr>)}</tbody></table></div>}
  </section>
}

type Route = {
  id: string
  startingPoint: string
  endingPoint: string
  ticketPrice: number
}

function RoutePanel() {
  const [routes, setRoutes] = useState<Route[]>([])
  const [savedMessage, setSavedMessage] = useState('')
  const [routeError, setRouteError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [deletingRouteId, setDeletingRouteId] = useState<string | null>(null)

  const loadRoutes = async () => {
    if (!supabase) {
      setRouteError('Supabase is not configured.')
      return
    }

    const { data, error } = await supabase
      .from('routes')
      .select('id, starting_point, ending_point, ticket_price')
      .order('created_at', { ascending: false })

    if (error) {
      setRouteError(error.message)
      return
    }

    setRoutes((data || []).map((route) => ({
      id: String(route.id),
      startingPoint: route.starting_point,
      endingPoint: route.ending_point,
      ticketPrice: Number(route.ticket_price),
    })))
  }

  useEffect(() => {
    loadRoutes()
  }, [])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSavedMessage('')
    setRouteError('')
    const formData = new FormData(event.currentTarget)
    const startingPoint = String(formData.get('startingPoint') || '').trim()
    const endingPoint = String(formData.get('endingPoint') || '').trim()
    const ticketPrice = Number(formData.get('ticketPrice'))

    if (!supabase) {
      setRouteError('Supabase is not configured.')
      return
    }

    setIsSaving(true)
    try {
      const { error } = await supabase.from('routes').insert({
        starting_point: startingPoint,
        ending_point: endingPoint,
        ticket_price: ticketPrice,
      })

      if (error) {
        setRouteError(error.message)
        return
      }

      await loadRoutes()
      setSavedMessage('Route added successfully.')
      event.currentTarget.reset()
    } catch (error) {
      setRouteError(error instanceof Error ? error.message : 'Could not save the route.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (route: Route) => {
    if (!window.confirm(`Delete the route from ${route.startingPoint} to ${route.endingPoint}?`)) return
    if (!supabase) {
      setRouteError('Supabase is not configured.')
      return
    }

    setRouteError('')
    setDeletingRouteId(route.id)
    const { error } = await supabase.from('routes').delete().eq('id', route.id)
    setDeletingRouteId(null)

    if (error) {
      setRouteError(error.message)
      return
    }

    setRoutes((currentRoutes) => currentRoutes.filter(({ id }) => id !== route.id))
  }

  return <section id="route" className="admin-panel route-panel">
    <div className="admin-panel-heading"><div><h2>Route</h2><p className="admin-panel-subtitle">Add a route and set its ticket price</p></div></div>
    <form className="route-form" onSubmit={handleSubmit}>
      <label>Starting point<input name="startingPoint" type="text" placeholder="Enter starting point" required /></label>
      <label>Ending point<input name="endingPoint" type="text" placeholder="Enter ending point" required /></label>
      <label>Ticket price<input name="ticketPrice" type="number" min="0" step="0.01" placeholder="0.00" required /></label>
      <button type="submit" className="route-submit" disabled={isSaving}>{isSaving ? 'Saving...' : 'Add route'}</button>
    </form>
    {savedMessage && <p className="route-success" role="status">{savedMessage}</p>}
    {routeError && <p className="database-status database-status-error" role="alert">{routeError}</p>}
    {routes.length > 0 && <div className="route-list">
      {routes.map((route) => <div className="route-list-item" key={route.id}>
        <div><strong>{route.startingPoint} to {route.endingPoint}</strong><span>Route added to this session</span></div>
        <div className="route-list-actions"><b>LKR {route.ticketPrice.toFixed(2)}</b><button type="button" className="route-delete-button" onClick={() => handleDelete(route)} disabled={deletingRouteId === route.id}>{deletingRouteId === route.id ? 'Deleting...' : 'Delete'}</button></div>
      </div>)}
    </div>}
  </section>
}

function ReportCard({ report, onDownload, downloading }: { report: string[]; onDownload?: (range: string) => void; downloading: boolean }) {
  const [range, setRange] = useState('Last 30 days')
  const supportsPdfDownload = Boolean(onDownload)

  return <article className="report-card"><div className="report-title"><span className="report-icon"><AdminIcon name="reports" size={17} /></span><h3>{report[0]}</h3></div><p>{report[1]}</p><div className="report-owner"><span className="owner-avatar">{report[2].slice(0, 2)}</span><span><small>Owned by</small><strong>{report[2]}</strong></span></div><div className="report-controls"><select value={range} onChange={(event) => setRange(event.target.value)} aria-label={`${report[0]} date range`}><option>Last 30 days</option><option>This month</option><option>This year</option></select><select defaultValue="PDF" aria-label={`${report[0]} format`}><option>PDF</option><option>CSV</option></select><button className="download-button" type="button" onClick={() => onDownload?.(range)} disabled={!supportsPdfDownload || downloading} title={supportsPdfDownload ? 'Download PDF' : 'Downloads will be connected later'} aria-label={supportsPdfDownload ? `Download ${report[0]} as PDF` : `${report[0]} download unavailable`}><AdminIcon name="download" size={16} /></button></div></article>
}

function drawPdfTemplate(pdf: PDFKit.PDFDocument, pageNumber: number) {
  const pageWidth = pdf.page.width
  const pageHeight = pdf.page.height
  const left = 34
  const right = pageWidth - 34
  const top = 30
  const bottom = pageHeight - 30

  pdf.save()
  pdf.lineWidth(1).strokeColor('#cbd5e1').rect(left, top, pageWidth - 68, pageHeight - 60).stroke()
  pdf.lineWidth(2).strokeColor('#2563eb').moveTo(left, top).lineTo(right, top).stroke()
  pdf.roundedRect(left + 16, top + 14, 30, 30, 6).fillColor('#2563eb').fill()
  pdf.fontSize(18).fillColor('#ffffff').text('U', left + 24, top + 18, { lineBreak: false })
  pdf.fontSize(11).fillColor('#1e3a8a').text('SLIIT UNIVERSITY', left + 56, top + 13, { lineBreak: false })
  pdf.fontSize(8).fillColor('#64748b').text('UniRide Administration Portal', left + 56, top + 29, { lineBreak: false })
  pdf.moveTo(left + 16, top + 58).lineTo(right - 16, top + 58).lineWidth(.5).strokeColor('#e2e8f0').stroke()
  pdf.moveTo(left + 16, bottom - 25).lineTo(right - 16, bottom - 25).stroke()
  pdf.fontSize(8).fillColor('#64748b').text('SLIIT University | UniRide Admin Portal', left + 16, bottom - 18, { lineBreak: false })
  pdf.text(`Page ${pageNumber}`, right - 55, bottom - 18, { width: 55, align: 'right', lineBreak: false })
  pdf.restore()
  pdf.x = 48
  pdf.y = top + 78
}

export function AdminDashboard() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error' | 'not-configured'>('checking')
  const [students, setStudents] = useState<Student[]>([])
  const [studentsLoading, setStudentsLoading] = useState(true)
  const [studentsError, setStudentsError] = useState('')
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [feedbackLoading, setFeedbackLoading] = useState(true)
  const [feedbackError, setFeedbackError] = useState('')
  const [walletTopUps, setWalletTopUps] = useState<WalletTopUp[]>([])
  const [walletLoading, setWalletLoading] = useState(true)
  const [walletError, setWalletError] = useState('')
  const [ticketPurchases, setTicketPurchases] = useState<TicketPurchase[]>([])
  const [ticketsLoading, setTicketsLoading] = useState(true)
  const [ticketsError, setTicketsError] = useState('')
  const [realtimeStatus, setRealtimeStatus] = useState<'live' | 'unavailable'>('unavailable')
  const [isTopUpOpen, setIsTopUpOpen] = useState(false)
  const [editingTopUp, setEditingTopUp] = useState<WalletTopUp | null>(null)
  const [walletReportLoading, setWalletReportLoading] = useState(false)
  const [walletReportError, setWalletReportError] = useState('')

  const totalTicketsSold = ticketPurchases.reduce((total, purchase) => total + Number(purchase.tickets), 0)
  const totalWalletBalance = walletTopUps.reduce((total, wallet) => total + Number(wallet.amount), 0)

  useEffect(() => {
    if (!supabase) {
      setConnectionStatus('not-configured')
      return
    }

    supabase.auth.getSession()
      .then(({ error }) => setConnectionStatus(error ? 'error' : 'connected'))
      .catch(() => setConnectionStatus('error'))
  }, [])

  useEffect(() => {
    if (!supabase) {
      setRealtimeStatus('unavailable')
      setWalletLoading(false)
      setWalletError('Supabase is not configured.')
      setTicketsLoading(false)
      setTicketsError('Supabase is not configured.')
      setFeedbackLoading(false)
      setFeedbackError('Supabase is not configured.')
      setStudentsLoading(false)
      setStudentsError('Supabase is not configured.')
      return
    }

    const client = supabase
    let active = true
    const refreshDashboardData = async () => {
      const [walletResult, transactionsResult, feedbackResult, studentsResult] = await Promise.all([
        client.from('wallet').select('id, student_id, amount, created_at').order('created_at', { ascending: false }),
        client.from('wallet_transactions').select('id, student_id, booking_token, route, tickets, payment_method, amount, balance_after, status, created_at').order('created_at', { ascending: false }),
        client.from('feedback').select('id, student_name, feedback, rating, created_at').order('created_at', { ascending: false }),
        client.from('students').select('id, full_name, email, created_at').order('created_at', { ascending: false }),
      ])

      if (!active) return
      setWalletError(walletResult.error?.message || '')
      setTicketsError(transactionsResult.error?.message || '')
      setFeedbackError(feedbackResult.error?.message || '')
      setStudentsError(studentsResult.error?.message || '')
      if (!walletResult.error) setWalletTopUps((walletResult.data || []) as WalletTopUp[])
      if (!transactionsResult.error) setTicketPurchases((transactionsResult.data || []) as TicketPurchase[])
      if (!feedbackResult.error) setFeedback(feedbackResult.data || [])
      if (!studentsResult.error) setStudents(studentsResult.data || [])
      setWalletLoading(false)
      setTicketsLoading(false)
      setFeedbackLoading(false)
      setStudentsLoading(false)
    }

    const channel = client.channel('admin-dashboard-analytics')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'students' }, () => { void refreshDashboardData() })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'wallet' }, () => { void refreshDashboardData() })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'wallet_transactions' }, () => { void refreshDashboardData() })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'feedback' }, () => { void refreshDashboardData() })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setRealtimeStatus('live')
          void refreshDashboardData()
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
          setRealtimeStatus('unavailable')
        }
      })

    void refreshDashboardData()
    return () => {
      active = false
      void client.removeChannel(channel)
    }
  }, [])

  const deleteStudent = async (student: Student) => {
    if (!window.confirm(`Delete ${student.full_name}?`)) return
    if (!supabase) return

    const { error } = await supabase.from('students').delete().eq('id', student.id)
    if (error) {
      setStudentsError(error.message)
      return
    }
    setStudents((currentStudents) => currentStudents.filter(({ id }) => id !== student.id))
  }

  const deleteFeedback = async (item: Feedback) => {
    if (!window.confirm(`Delete feedback from ${item.student_name}?`)) return
    if (!supabase) return

    const { error } = await supabase.from('feedback').delete().eq('id', item.id)
    if (error) {
      setFeedbackError(error.message)
      return
    }
    setFeedback((currentFeedback) => currentFeedback.filter(({ id }) => id !== item.id))
  }

  const handleTopUpSaved = (topUp: WalletTopUp) => {
    setWalletTopUps((currentTopUps) => [topUp, ...currentTopUps])
    setIsTopUpOpen(false)
  }

  const handleTopUpUpdated = (updatedTopUp: WalletTopUp) => {
    setWalletTopUps((currentTopUps) => currentTopUps.map((topUp) => topUp.id === updatedTopUp.id ? updatedTopUp : topUp))
    setEditingTopUp(null)
  }

  const downloadWalletActivityReport = async (range: string) => {
    setWalletReportError('')
    if (!supabase) {
      setWalletReportError('Supabase is not configured.')
      return
    }

    setWalletReportLoading(true)
    try {
      const now = new Date()
      const from = range === 'Last 30 days'
        ? new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30)
        : range === 'This month'
          ? new Date(now.getFullYear(), now.getMonth(), 1)
          : new Date(now.getFullYear(), 0, 1)
      const { data, error } = await supabase
        .from('wallet_transactions')
        .select('booking_token, route, tickets, payment_method, amount, balance_after, status, created_at')
        .gte('created_at', from.toISOString())
        .order('created_at', { ascending: false })

      if (error) throw error

      const transactions = (data || []) as WalletTransaction[]
      const registerStdFonts = (pdfKitModule as unknown as { registerStdFonts: (fontData: unknown) => void }).registerStdFonts
      registerStdFonts(Helvetica)
      const chunks: Uint8Array[] = []
      let pageNumber = 0
      const pdf = new PDFDocument({ margin: 48, size: 'A4', autoFirstPage: false })
      pdf.on('data', (chunk: Uint8Array) => chunks.push(chunk))
      const addReportPage = () => {
        pageNumber += 1
        pdf.addPage()
        drawPdfTemplate(pdf, pageNumber)
      }
      addReportPage()
      const pdfReady = new Promise<void>((resolve, reject) => {
        pdf.on('end', () => resolve())
        pdf.on('error', reject)
      })

      pdf.font('Helvetica').fontSize(20).fillColor('#1e3a8a').text('Student Wallet Activity Report', { width: 500 })
      pdf.fontSize(10).fillColor('#475569').text(`Period: ${range}`, { width: 500 })
      pdf.text(`Generated: ${now.toLocaleString()}`, { width: 500 })
      pdf.moveDown()
      pdf.fontSize(11).fillColor('#1e293b').text(`Transactions in period: ${transactions.length}`, { width: 500 })
      pdf.text(`Total transaction value: LKR ${transactions.reduce((sum, transaction) => sum + Number(transaction.amount), 0).toFixed(2)}`, { width: 500 })
      pdf.moveDown()

      if (transactions.length === 0) {
        pdf.fontSize(10).fillColor('#475569').text('No wallet transactions were recorded during this period.', { width: 500 })
      } else {
        transactions.forEach((transaction, index) => {
          if (pdf.y > pdf.page.height - 125) addReportPage()
          pdf.fontSize(11).fillColor('#1e293b').text(`${index + 1}. ${transaction.route} | LKR ${Number(transaction.amount).toFixed(2)} | ${transaction.status}`, { width: 500 })
          pdf.fontSize(9).fillColor('#475569').text(`${new Date(transaction.created_at).toLocaleString()} | ${transaction.tickets} ticket(s) | ${transaction.payment_method}`, { width: 500 })
          pdf.text(`Booking: ${transaction.booking_token} | Balance after: LKR ${Number(transaction.balance_after).toFixed(2)}`, { width: 500 })
          pdf.moveDown(.6)
        })
      }

      pdf.end()
      await pdfReady
      const blobParts = chunks.map((chunk) => {
        const copy = new Uint8Array(chunk.byteLength)
        copy.set(chunk)
        return copy.buffer as ArrayBuffer
      })
      const blob = new Blob(blobParts, { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `uniride-student-wallet-activity-${now.toISOString().slice(0, 10)}.pdf`
      link.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      setWalletReportError(error instanceof Error ? error.message : 'Unable to generate the wallet activity report.')
    } finally {
      setWalletReportLoading(false)
    }
  }

  return <div className="admin-shell">
    <aside className={`admin-sidebar ${menuOpen ? 'admin-sidebar-open' : ''}`}><div className="admin-brand"><div className="brand-mark">U</div><div><strong>UniRide</strong><span>Admin Portal</span></div><button className="sidebar-close" onClick={() => setMenuOpen(false)} aria-label="Close navigation"><AdminIcon name="close" /></button></div><nav>{navItems.map((item, index) => <a className={index === 0 ? 'active' : ''} href={`#${item.label.toLowerCase()}`} key={item.label} onClick={() => setMenuOpen(false)}><AdminIcon name={item.icon} /><span>{item.label}</span></a>)}</nav><button className="logout-button"><AdminIcon name="logout" /><span>Logout</span></button></aside>
    {menuOpen && <button className="admin-overlay" aria-label="Close navigation" onClick={() => setMenuOpen(false)} />}
    <div className="admin-main"><header className="admin-topbar"><button className="menu-button" onClick={() => setMenuOpen(true)} aria-label="Open navigation"><AdminIcon name="menu" /></button><div><h1>Dashboard</h1><p>Overview of UniRide activity</p></div><div className="admin-user"><button className="notification-button" aria-label="Notifications"><AdminIcon name="bell" /><span /></button><div className="admin-avatar">AD</div><div className="admin-user-name"><strong>Admin</strong><small>Administrator</small></div><AdminIcon name="chevron" size={15} /></div></header>
      <main className="admin-content"><section className="admin-welcome"><div className="admin-welcome-copy"><span className="eyebrow">SLIIT Kandy / Admin Portal</span><h2>Good morning, Admin.</h2><p>Keep today&apos;s rides moving smoothly.</p><div className="quick-actions"><button><AdminIcon name="plus" size={16} /> Add Student</button><button type="button" onClick={() => setIsTopUpOpen(true)}><AdminIcon name="plus" size={16} /> Top Up Wallet</button></div></div><div className="welcome-mark"><AdminIcon name="dashboard" size={42} /></div></section>
        <section className="admin-pulse" aria-label="Live database summary"><div><span className="pulse-label">Registered students</span><strong>{students.length.toLocaleString()}</strong><small>{studentsLoading ? 'Loading database...' : 'Current database total'}</small></div><div><span className="pulse-label">Tickets sold</span><strong>{totalTicketsSold.toLocaleString()}</strong><small>{ticketsLoading ? 'Loading database...' : `${ticketPurchases.length.toLocaleString()} purchases recorded`}</small></div><div><span className="pulse-label">Current wallet balance</span><strong>LKR {totalWalletBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong><small>{walletLoading ? 'Loading database...' : `${walletTopUps.length.toLocaleString()} student wallets`}</small></div></section>
        <RoutePanel />
        <WalletTopUpsPanel topUps={walletTopUps} students={students} loading={walletLoading} error={walletError} onOpenTopUp={() => setIsTopUpOpen(true)} onEditTopUp={setEditingTopUp} />
        <PurchasedTicketsPanel purchases={ticketPurchases} students={students} loading={ticketsLoading} error={ticketsError} />
        <StudentsPanel students={students} loading={studentsLoading} error={studentsError} onDelete={deleteStudent} />
        <p className={`database-status database-status-${connectionStatus}`} role="status">{connectionStatus === 'checking' ? 'Checking Supabase connection...' : connectionStatus === 'connected' ? `Supabase connected · Realtime ${realtimeStatus}` : connectionStatus === 'not-configured' ? 'Supabase is not configured' : 'Supabase connection failed'}</p>
        <div className="analytics-grid"><TicketSalesChart transactions={ticketPurchases} /><VerificationChart transactions={ticketPurchases} /></div><div className="lower-grid"><ActivityFeed students={students} feedback={feedback} transactions={ticketPurchases} /><div id="feedback"><FeedbackSnapshot feedback={feedback} loading={feedbackLoading} error={feedbackError} onDelete={deleteFeedback} /></div></div>
        <section className="reports-section"><div className="reports-heading"><div><span className="eyebrow">Export centre</span><h2>Reports &amp; Downloads</h2><p>Review and prepare operational reports for your records.</p>{walletReportError && <p className="database-status database-status-error" role="alert">{walletReportError}</p>}</div><button className="outline-button"><AdminIcon name="reports" size={16} /> View report history</button></div><div className="reports-grid">{reports.map((report) => <ReportCard key={report[0]} report={report} onDownload={report[0] === 'Student Wallet Activity Report' ? downloadWalletActivityReport : undefined} downloading={walletReportLoading} />)}</div></section>
        
        {/* Admin Management Module */}
        <AdminManagement />
        {isTopUpOpen && <WalletTopUpModal students={students} onClose={() => setIsTopUpOpen(false)} onSaved={handleTopUpSaved} />}
        {editingTopUp && <WalletEditModal topUp={editingTopUp} onClose={() => setEditingTopUp(null)} onSaved={handleTopUpUpdated} />}
      </main></div>
  </div>
}

function WalletTopUpsPanel({ topUps, students, loading, error, onOpenTopUp, onEditTopUp }: { topUps: WalletTopUp[]; students: Student[]; loading: boolean; error: string; onOpenTopUp: () => void; onEditTopUp: (topUp: WalletTopUp) => void }) {
  const studentById = new Map(students.map((student) => [student.id, student]))

  return <section id="wallets" className="admin-panel wallet-admin-panel">
    <div className="admin-panel-heading"><div><h2>Admin Wallet</h2><p className="admin-panel-subtitle">Student wallet top-up history</p></div><button type="button" className="route-submit wallet-action-button" onClick={onOpenTopUp}><AdminIcon name="plus" size={15} /> Top Up Wallet</button></div>
    {error && <p className="database-status database-status-error">{error}</p>}
    {loading ? <p className="admin-empty-state">Loading wallet activity...</p> : topUps.length === 0 ? <p className="admin-empty-state">No wallet top-ups have been recorded yet.</p> : <div className="wallet-admin-list">{topUps.map((topUp) => {
      const student = studentById.get(topUp.student_id)
      return <div className="wallet-admin-item" key={topUp.id}><div><strong>{student?.full_name || 'Unknown student'}</strong><span>{student?.email || 'Student record unavailable'}</span></div><div className="wallet-admin-amount"><strong>LKR {Number(topUp.amount).toFixed(2)}</strong><time>{new Date(topUp.created_at).toLocaleString()}</time><button type="button" className="wallet-edit-button" onClick={() => onEditTopUp(topUp)}>Edit amount</button></div></div>
    })}</div>}
  </section>
}

function WalletTopUpModal({ students, onClose, onSaved }: { students: Student[]; onClose: () => void; onSaved: (topUp: WalletTopUp) => void }) {
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    const formData = new FormData(event.currentTarget)
    const studentId = String(formData.get('studentId') || '')
    const amount = Number(formData.get('amount'))

    if (!studentId || !Number.isFinite(amount) || amount <= 0) {
      setError('Select a student and enter a valid amount.')
      return
    }
    if (!supabase) {
      setError('Supabase is not configured.')
      return
    }

    setIsSaving(true)
    const { data: existingRows, error: lookupError } = await supabase.from('wallet').select('id, amount').eq('student_id', studentId).order('created_at', { ascending: false }).limit(1)
    if (lookupError) {
      setIsSaving(false)
      setError(lookupError.message)
      return
    }

    const existingWallet = existingRows?.[0]
    const walletRequest = existingWallet
      ? supabase.from('wallet').update({ amount: Number(existingWallet.amount) + amount }).eq('id', existingWallet.id).select('id, student_id, amount, created_at')
      : supabase.from('wallet').insert({ student_id: studentId, amount }).select('id, student_id, amount, created_at')
    const { data, error: saveError } = await walletRequest
    setIsSaving(false)
    if (saveError) {
      setError(saveError.message)
      return
    }
    const savedTopUp = data?.[0] as WalletTopUp | undefined
    if (!savedTopUp) {
      setError('The top-up was not returned by the database. Check the wallet table policies.')
      return
    }
    onSaved(savedTopUp)
  }

  return <div className="checkout-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}><section className="checkout-modal admin-wallet-modal" role="dialog" aria-modal="true" aria-labelledby="admin-wallet-title"><button className="checkout-close" type="button" onClick={onClose} aria-label="Close wallet top-up form">×</button><div className="checkout-heading"><span className="checkout-eyebrow">Admin wallet</span><h2 id="admin-wallet-title">Top up a student wallet</h2><p>Select an existing student and add funds to their UniRide wallet.</p></div><form onSubmit={handleSubmit}><label>Student<select name="studentId" defaultValue="" required><option value="" disabled>Select a student</option>{students.map((student) => <option value={student.id} key={student.id}>{student.full_name} - {student.email}</option>)}</select></label><label>Top-up amount<input name="amount" type="number" min="0.01" step="0.01" placeholder="0.00" required /></label>{error && <p className="database-status database-status-error" role="alert">{error}</p>}<button className="checkout-primary" type="submit" disabled={isSaving || students.length === 0}>{isSaving ? 'Saving...' : 'Save top-up'}</button></form></section></div>
}

function WalletEditModal({ topUp, onClose, onSaved }: { topUp: WalletTopUp; onClose: () => void; onSaved: (topUp: WalletTopUp) => void }) {
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    const amount = Number(new FormData(event.currentTarget).get('amount'))

    if (!Number.isFinite(amount) || amount <= 0) {
      setError('Enter a valid amount.')
      return
    }
    if (!supabase) {
      setError('Supabase is not configured.')
      return
    }

    setIsSaving(true)
    const { data, error: saveError } = await supabase.from('wallet').update({ amount }).eq('id', topUp.id).select('id, student_id, amount, created_at')
    setIsSaving(false)
    if (saveError) {
      setError(saveError.message)
      return
    }
    const updatedTopUp = data?.[0] as WalletTopUp | undefined
    if (!updatedTopUp) {
      setError('The wallet record was not returned by the database. Check the wallet table policies.')
      return
    }
    onSaved(updatedTopUp)
  }

  return <div className="checkout-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}><section className="checkout-modal admin-wallet-modal" role="dialog" aria-modal="true" aria-labelledby="edit-wallet-title"><button className="checkout-close" type="button" onClick={onClose} aria-label="Close edit wallet form">×</button><div className="checkout-heading"><span className="checkout-eyebrow">Admin wallet</span><h2 id="edit-wallet-title">Edit top-up amount</h2><p>Update the amount recorded for this student wallet top-up.</p></div><form onSubmit={handleSubmit}><label>Top-up amount<input name="amount" type="number" min="0.01" step="0.01" defaultValue={topUp.amount} required /></label>{error && <p className="database-status database-status-error" role="alert">{error}</p>}<button className="checkout-primary" type="submit" disabled={isSaving}>{isSaving ? 'Updating...' : 'Update amount'}</button></form></section></div>
}

function PurchasedTicketsPanel({ purchases, students, loading, error }: { purchases: TicketPurchase[]; students: Student[]; loading: boolean; error: string }) {
  const studentById = new Map(students.map((student) => [student.id, student]))

  return <section id="tickets" className="admin-panel purchased-tickets-panel">
    <div className="admin-panel-heading"><div><h2>Purchased Tickets</h2><p className="admin-panel-subtitle">Tickets bought through Book a Ride</p></div><span className="eyebrow">{purchases.length} total</span></div>
    {error && <p className="database-status database-status-error">{error}</p>}
    {loading ? <p className="admin-empty-state">Loading purchased tickets...</p> : purchases.length === 0 ? <p className="admin-empty-state">No tickets have been purchased yet.</p> : <div className="purchased-ticket-list">{purchases.map((purchase) => {
      const student = purchase.student_id ? studentById.get(purchase.student_id) : undefined
      return <article className="purchased-ticket-item" key={purchase.id}><div className="purchased-ticket-main"><strong>{student?.full_name || 'Guest or unavailable student'}</strong><span>{student?.email || `Booking token: ${purchase.booking_token}`}</span><b>{purchase.route}</b></div><div className="purchased-ticket-meta"><strong>LKR {Number(purchase.amount).toFixed(2)}</strong><span>{purchase.tickets} {purchase.tickets === 1 ? 'ticket' : 'tickets'} · {purchase.payment_method}</span><time>{new Date(purchase.created_at).toLocaleString()}</time></div></article>
    })}</div>}
  </section>
}