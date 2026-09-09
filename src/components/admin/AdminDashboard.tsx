import { useState } from 'react'
import { AdminIcon } from './AdminIcon'

type IconName = Parameters<typeof AdminIcon>[0]['name']

const navItems: { label: string; icon: IconName }[] = [
  { label: 'Dashboard', icon: 'dashboard' }, { label: 'Students', icon: 'students' }, { label: 'Wallets', icon: 'wallet' },
  { label: 'Tickets', icon: 'ticket' }, { label: 'Feedback', icon: 'feedback' }, { label: 'Reports', icon: 'reports' }, { label: 'Settings', icon: 'settings' },
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

type TopUp = { id: string; student: string; studentId: string; amount: number; method: string; status: 'Completed' | 'Pending'; time: string }

const initialTopUps: TopUp[] = [
  { id: 'TRX-20481', student: 'Nethmi Perera', studentId: 'STU-1042', amount: 1000, method: 'Admin credit', status: 'Completed', time: 'Today, 10:42 AM' },
  { id: 'TRX-20480', student: 'Dineth Kausalya', studentId: 'STU-0981', amount: 2500, method: 'Bank transfer', status: 'Pending', time: 'Today, 10:18 AM' },
  { id: 'TRX-20479', student: 'Ramith Keshara', studentId: 'STU-0874', amount: 500, method: 'Admin credit', status: 'Completed', time: 'Today, 9:56 AM' },
  { id: 'TRX-20478', student: 'W.M.C.D Warnasooriya', studentId: 'STU-0762', amount: 1500, method: 'Card payment', status: 'Completed', time: 'Yesterday, 4:32 PM' },
]

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

function FeedbackSnapshot() {
  return <Panel title="Recent Feedback"><div className="feedback-list"><div><div className="feedback-meta"><strong>Anonymous Student</strong><span className="stars">★★★★★</span></div><p>"Booking was quick and easy."</p><time>10 minutes ago</time></div><div><div className="feedback-meta"><strong>Nethmi Perera</strong><span className="stars">★★★★<span>★</span></span></div><p>"The route information was helpful."</p><time>42 minutes ago</time></div></div></Panel>
}

function ReportCard({ report }: { report: string[] }) {
  return <article className="report-card"><div className="report-title"><span className="report-icon"><AdminIcon name="reports" size={17} /></span><h3>{report[0]}</h3></div><p>{report[1]}</p><div className="report-owner"><span className="owner-avatar">{report[2].slice(0, 2)}</span><span><small>Owned by</small><strong>{report[2]}</strong></span></div><div className="report-controls"><select defaultValue="Last 30 days" aria-label={`${report[0]} date range`}><option>Last 30 days</option><option>This month</option><option>This year</option></select><select defaultValue="PDF" aria-label={`${report[0]} format`}><option>PDF</option><option>CSV</option></select><button className="download-button" disabled title="Downloads will be connected later"><AdminIcon name="download" size={16} /></button></div></article>
}

function WalletManagement({ onClose }: { onClose: () => void }) {
  const [topUps, setTopUps] = useState(initialTopUps)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [student, setStudent] = useState('')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [formError, setFormError] = useState('')

  const filteredTopUps = topUps.filter((topUp) => `${topUp.student} ${topUp.studentId} ${topUp.id}`.toLowerCase().includes(search.toLowerCase()))

  function addTopUp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const numericAmount = Number(amount)
    if (!student || !numericAmount || numericAmount < 100) {
      setFormError('Choose a student and enter at least LKR 100.')
      return
    }

    setTopUps([{ id: `TRX-${20500 + topUps.length}`, student, studentId: 'STU-NEW', amount: numericAmount, method: note || 'Admin credit', status: 'Completed', time: 'Just now' }, ...topUps])
    setStudent('')
    setAmount('')
    setNote('')
    setFormError('')
    setShowForm(false)
  }

  return <section className="wallet-management">
    <div className="wallet-heading"><div><span className="eyebrow">Wallet operations</span><h2>Top-up management</h2><p>Review student balances and issue wallet credit securely.</p></div><div className="wallet-heading-actions"><button className="outline-button" onClick={onClose}><AdminIcon name="dashboard" size={16} /> Dashboard</button><button className="primary-button" onClick={() => setShowForm(true)}><AdminIcon name="plus" size={16} /> Top up wallet</button></div></div>
    <div className="wallet-stats"><div><span>Total wallet balance</span><strong>LKR 486,250</strong><small>Across 2,450 student wallets</small></div><div><span>Top-ups this month</span><strong>LKR 128,500</strong><small className="positive">+8.2% from last month</small></div><div><span>Pending review</span><strong>12</strong><small>Transactions need attention</small></div></div>
    <section className="admin-panel wallet-transactions"><div className="wallet-table-heading"><div><h2>Recent top-ups</h2><p>Every wallet credit issued by the portal.</p></div><label className="wallet-search"><AdminIcon name="students" size={15} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search student or ID" aria-label="Search wallet top-ups" /></label></div><div className="wallet-table-wrap"><table className="wallet-table"><thead><tr><th>Student</th><th>Transaction</th><th>Amount</th><th>Method</th><th>Status</th><th>Time</th></tr></thead><tbody>{filteredTopUps.map((topUp) => <tr key={topUp.id}><td><strong>{topUp.student}</strong><small>{topUp.studentId}</small></td><td>{topUp.id}</td><td className="amount-cell">LKR {topUp.amount.toLocaleString()}</td><td>{topUp.method}</td><td><span className={`status-pill status-${topUp.status.toLowerCase()}`}><i />{topUp.status}</span></td><td>{topUp.time}</td></tr>)}</tbody></table>{filteredTopUps.length === 0 && <p className="empty-table">No top-ups match your search.</p>}</div></section>
    {showForm && <div className="wallet-modal-backdrop"><section className="wallet-modal" role="dialog" aria-modal="true" aria-labelledby="top-up-title"><div className="wallet-modal-heading"><div><span className="eyebrow">Manual credit</span><h2 id="top-up-title">Top up a student wallet</h2></div><button className="modal-close" onClick={() => setShowForm(false)} aria-label="Close top-up form"><AdminIcon name="close" size={19} /></button></div><form onSubmit={addTopUp}><label>Student<select value={student} onChange={(event) => setStudent(event.target.value)}><option value="">Select a student</option><option>Nethmi Perera</option><option>Dineth Kausalya</option><option>Ramith Keshara</option><option>W.M.C.D Warnasooriya</option></select></label><label>Amount<input type="number" min="100" step="50" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="e.g. 1000" /></label><label>Reference note <span>(optional)</span><input value={note} onChange={(event) => setNote(event.target.value)} placeholder="Admin credit" /></label>{formError && <p className="form-error" role="alert">{formError}</p>}<div className="modal-actions"><button type="button" className="outline-button" onClick={() => setShowForm(false)}>Cancel</button><button type="submit" className="primary-button"><AdminIcon name="check" size={16} /> Confirm top-up</button></div></form></section></div>}
  </section>
}

export function AdminDashboard() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [connectionStatus] = useState<'checking' | 'connected' | 'error'>('checking')
  const [activeView, setActiveView] = useState<'dashboard' | 'wallets'>('dashboard')


  return <div className="admin-shell">
    <aside className={`admin-sidebar ${menuOpen ? 'admin-sidebar-open' : ''}`}><div className="admin-brand"><div className="brand-mark">U</div><div><strong>UniRide</strong><span>Admin Portal</span></div><button className="sidebar-close" onClick={() => setMenuOpen(false)} aria-label="Close navigation"><AdminIcon name="close" /></button></div><nav>{navItems.map((item, index) => <a className={(activeView === 'dashboard' && index === 0) || (activeView === 'wallets' && item.label === 'Wallets') ? 'active' : ''} href={item.label === 'Wallets' ? '#wallets' : '#dashboard'} key={item.label} onClick={(event) => { event.preventDefault(); if (item.label === 'Wallets') setActiveView('wallets'); else if (item.label === 'Dashboard') setActiveView('dashboard'); setMenuOpen(false) }}><AdminIcon name={item.icon} /><span>{item.label}</span></a>)}</nav><button className="logout-button"><AdminIcon name="logout" /><span>Logout</span></button></aside>
    {menuOpen && <button className="admin-overlay" aria-label="Close navigation" onClick={() => setMenuOpen(false)} />}
    <div className="admin-main"><header className="admin-topbar"><button className="menu-button" onClick={() => setMenuOpen(true)} aria-label="Open navigation"><AdminIcon name="menu" /></button><div><h1>{activeView === 'wallets' ? 'Wallets' : 'Dashboard'}</h1><p>{activeView === 'wallets' ? 'Manage student wallet top-ups' : 'Overview of UniRide activity'}</p></div><div className="admin-user"><button className="notification-button" aria-label="Notifications"><AdminIcon name="bell" /><span /></button><div className="admin-avatar">AD</div><div className="admin-user-name"><strong>Admin</strong><small>Administrator</small></div><AdminIcon name="chevron" size={15} /></div></header>
      <main className="admin-content">{activeView === 'wallets' ? <WalletManagement onClose={() => setActiveView('dashboard')} /> : <><section className="admin-welcome"><div className="admin-welcome-copy"><span className="eyebrow">SLIIT Kandy / Admin Portal</span><h2>Good morning, Admin.</h2><p>Keep today&apos;s rides moving smoothly.</p><div className="quick-actions"><button><AdminIcon name="plus" size={16} /> Add Student</button><button onClick={() => setActiveView('wallets')}><AdminIcon name="plus" size={16} /> Top Up Wallet</button></div></div><div className="welcome-mark"><AdminIcon name="dashboard" size={42} /></div></section>
        <section className="admin-pulse" aria-label="Today's dashboard summary"><div><span className="pulse-label">Students</span><strong>2,450</strong><small><AdminIcon name="trend" size={12} /> 12.5% this month</small></div><div><span className="pulse-label">Tickets sold</span><strong>328</strong><small><AdminIcon name="ticket" size={12} /> 43 still available</small></div><div><span className="pulse-label">Wallet top-ups</span><strong>LKR 32,500</strong><small><AdminIcon name="trend" size={12} /> 8.2% today</small></div></section>
        <p className={`database-status database-status-${connectionStatus}`} role="status">{connectionStatus === 'checking' ? 'Checking Supabase connection...' : connectionStatus === 'connected' ? 'Supabase connected' : 'Supabase connection failed'}</p>
        <div className="analytics-grid"><TicketSalesChart /><VerificationChart /></div><div className="lower-grid"><ActivityFeed /><FeedbackSnapshot /></div>
        <section className="reports-section"><div className="reports-heading"><div><span className="eyebrow">Export centre</span><h2>Reports &amp; Downloads</h2><p>Review and prepare operational reports for your records.</p></div><button className="outline-button"><AdminIcon name="reports" size={16} /> View report history</button></div><div className="reports-grid">{reports.map((report) => <ReportCard key={report[0]} report={report} />)}</div></section>
      </> }</main></div>
  </div>
}