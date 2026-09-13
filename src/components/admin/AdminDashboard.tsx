import { FormEvent, useEffect, useState } from 'react'
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
  ['Money Transaction Report', 'A detailed record of UniRide money movements.', 'B.L.T.T Liyanarathne'],
  ['Conductor Verified Ticket Details Report', 'Verified ticket details across all routes.', 'W.M.C.D Warnasooriya'],
  ['Detailed Report about Ticket Distribution', 'Ticket sales and distribution by period.', 'Ramith Keshara'],
  ['Report about Student Login Activities', 'Student sign-in activity and usage patterns.', 'J.E Wijerathna'],
]

const activities = [
  ['wallet', 'Wallet Top-Up', 'Student wallet topped up by LKR 1,000.', '5 minutes ago'],
  ['check', 'Ticket Verified', 'Ticket #UR10284 verified by conductor.', '18 minutes ago'],
  ['feedback', 'New Feedback', 'A student submitted a 4-star feedback.', '32 minutes ago'],
  ['ticket', 'Ticket Purchased', 'A new university bus ticket was purchased.', '1 hour ago'],
] as const

const sales = [42, 51, 38, 64, 72, 35, 26]
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

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

function Panel({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) {
  return <section className={`admin-panel ${className}`}><div className="admin-panel-heading"><h2>{title}</h2><button className="admin-text-button">View all <span aria-hidden="true">-&gt;</span></button></div>{children}</section>
}

function TicketSalesChart() {
  const max = Math.max(...sales)
  return <Panel title="Ticket Sales Overview" className="sales-panel"><div className="bar-chart" aria-label="Ticket sales for the last seven days">{sales.map((sale, index) => <div className="bar-column" key={days[index]}><span>{sale}</span><div className="bar-track"><div className="bar-fill" style={{ height: `${(sale / max) * 100}%` }} /></div><small>{days[index]}</small></div>)}</div></Panel>
}

function VerificationChart() {
  return <Panel title="Verification Breakdown" className="verification-panel"><div className="verification-summary"><div className="donut-chart"><div><strong>328</strong><small>Total</small></div></div><div className="verification-legend"><span><i className="legend-valid" />Valid <b>285</b></span><span><i className="legend-invalid" />Invalid <b>18</b></span><span><i className="legend-used" />Already Used <b>25</b></span></div></div></Panel>
}

function ActivityFeed() {
  return <Panel title="Recent Activity"><div className="activity-list">{activities.map(([icon, title, text, time]) => <div className="activity-item" key={title}><span className="activity-icon"><AdminIcon name={icon} size={16} /></span><div><strong>{title}</strong><p>{text}</p><time>{time}</time></div></div>)}</div></Panel>
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

function ReportCard({ report }: { report: string[] }) {
  return <article className="report-card"><div className="report-title"><span className="report-icon"><AdminIcon name="reports" size={17} /></span><h3>{report[0]}</h3></div><p>{report[1]}</p><div className="report-owner"><span className="owner-avatar">{report[2].slice(0, 2)}</span><span><small>Owned by</small><strong>{report[2]}</strong></span></div><div className="report-controls"><select defaultValue="Last 30 days" aria-label={`${report[0]} date range`}><option>Last 30 days</option><option>This month</option><option>This year</option></select><select defaultValue="PDF" aria-label={`${report[0]} format`}><option>PDF</option><option>CSV</option></select><button className="download-button" disabled title="Downloads will be connected later"><AdminIcon name="download" size={16} /></button></div></article>
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
      setFeedbackLoading(false)
      setFeedbackError('Supabase is not configured.')
      return
    }

    supabase.from('feedback').select('id, student_name, feedback, rating, created_at').order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) setFeedbackError(error.message)
        else setFeedback(data || [])
        setFeedbackLoading(false)
      })
  }, [])

  useEffect(() => {
    if (!supabase) {
      setStudentsLoading(false)
      setStudentsError('Supabase is not configured.')
      return
    }

    supabase.from('students').select('id, full_name, email, created_at').order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) setStudentsError(error.message)
        else setStudents(data || [])
        setStudentsLoading(false)
      })
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

  return <div className="admin-shell">
    <aside className={`admin-sidebar ${menuOpen ? 'admin-sidebar-open' : ''}`}><div className="admin-brand"><div className="brand-mark">U</div><div><strong>UniRide</strong><span>Admin Portal</span></div><button className="sidebar-close" onClick={() => setMenuOpen(false)} aria-label="Close navigation"><AdminIcon name="close" /></button></div><nav>{navItems.map((item, index) => <a className={index === 0 ? 'active' : ''} href={`#${item.label.toLowerCase()}`} key={item.label} onClick={() => setMenuOpen(false)}><AdminIcon name={item.icon} /><span>{item.label}</span></a>)}</nav><button className="logout-button"><AdminIcon name="logout" /><span>Logout</span></button></aside>
    {menuOpen && <button className="admin-overlay" aria-label="Close navigation" onClick={() => setMenuOpen(false)} />}
    <div className="admin-main"><header className="admin-topbar"><button className="menu-button" onClick={() => setMenuOpen(true)} aria-label="Open navigation"><AdminIcon name="menu" /></button><div><h1>Dashboard</h1><p>Overview of UniRide activity</p></div><div className="admin-user"><button className="notification-button" aria-label="Notifications"><AdminIcon name="bell" /><span /></button><div className="admin-avatar">AD</div><div className="admin-user-name"><strong>Admin</strong><small>Administrator</small></div><AdminIcon name="chevron" size={15} /></div></header>
      <main className="admin-content"><section className="admin-welcome"><div className="admin-welcome-copy"><span className="eyebrow">SLIIT Kandy / Admin Portal</span><h2>Good morning, Admin.</h2><p>Keep today&apos;s rides moving smoothly.</p><div className="quick-actions"><button><AdminIcon name="plus" size={16} /> Add Student</button><button><AdminIcon name="plus" size={16} /> Top Up Wallet</button></div></div><div className="welcome-mark"><AdminIcon name="dashboard" size={42} /></div></section>
        <section className="admin-pulse" aria-label="Today's dashboard summary"><div><span className="pulse-label">Students</span><strong>2,450</strong><small><AdminIcon name="trend" size={12} /> 12.5% this month</small></div><div><span className="pulse-label">Tickets sold</span><strong>328</strong><small><AdminIcon name="ticket" size={12} /> 43 still available</small></div><div><span className="pulse-label">Wallet top-ups</span><strong>LKR 32,500</strong><small><AdminIcon name="trend" size={12} /> 8.2% today</small></div></section>
        <RoutePanel />
        <StudentsPanel students={students} loading={studentsLoading} error={studentsError} onDelete={deleteStudent} />
        <p className={`database-status database-status-${connectionStatus}`} role="status">{connectionStatus === 'checking' ? 'Checking Supabase connection...' : connectionStatus === 'connected' ? 'Supabase connected' : connectionStatus === 'not-configured' ? 'Supabase is not configured' : 'Supabase connection failed'}</p>
        <div className="analytics-grid"><TicketSalesChart /><VerificationChart /></div><div className="lower-grid"><ActivityFeed /><div id="feedback"><FeedbackSnapshot feedback={feedback} loading={feedbackLoading} error={feedbackError} onDelete={deleteFeedback} /></div></div>
        <section className="reports-section"><div className="reports-heading"><div><span className="eyebrow">Export centre</span><h2>Reports &amp; Downloads</h2><p>Review and prepare operational reports for your records.</p></div><button className="outline-button"><AdminIcon name="reports" size={16} /> View report history</button></div><div className="reports-grid">{reports.map((report) => <ReportCard key={report[0]} report={report} />)}</div></section>
        
        {/* Admin Management Module */}
        <AdminManagement />
      </main></div>
  </div>
}