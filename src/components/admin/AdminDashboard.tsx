import { FormEvent, useEffect, useState } from 'react'
import PDFDocument from 'pdfkit'
import * as pdfKitModule from 'pdfkit'
import Helvetica from 'pdfkit/standard-fonts/Helvetica'
import { AdminIcon } from './AdminIcon'
import { supabase } from '../../lib/supabase'
import { AdminManagement } from './AdminManagement'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

type IconName = Parameters<typeof AdminIcon>[0]['name']

const navItems: { label: string; icon: IconName }[] = [
  { label: 'Dashboard', icon: 'dashboard' },
  { label: 'Students', icon: 'students' },
  { label: 'Wallets', icon: 'wallet' },
  { label: 'Tickets', icon: 'ticket' },
  { label: 'Feedback', icon: 'feedback' },
  { label: 'Reports', icon: 'reports' },
  { label: 'Settings', icon: 'settings' },
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

// Updated Function to generate and download Admin Activity Report PDF
const downloadAdminActivityReport = async () => {
  try {
    let adminsData: any[] = []

    // 1. Supabase එකෙන් Admin Data Fetch කිරීමට උත්සාහ කිරීම
    const { data: fetchedAdmins, error } = await supabase
      .from('admins')
      .select('*')

    if (!error && fetchedAdmins && fetchedAdmins.length > 0) {
      adminsData = fetchedAdmins
    } else {
      // Fetch එක fail වුවහොත් හෝ Data නැත්නම් Fallback list එක භාවිත කරයි
      console.warn('Supabase fetch query issue, using fallback data:', error)
      adminsData = [
        { id: 1, name: 'Admin', email: 'admin@uniride.lk', role: 'Super Admin', created_at: new Date().toISOString() },
        { id: 7, name: 'Asini', email: 'asini@gmail.com', role: 'Admin', created_at: new Date().toISOString() },
      ]
    }

    // 2. jsPDF Instance එක සෑදීම
    const doc = new jsPDF()

    // Header Title
    doc.setFontSize(18)
    doc.setTextColor(30, 58, 138)
    doc.text('UniRide System - Admin Activity Report', 14, 20)

    // Subtitle & Date
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 28)
    doc.text('Owned by: K.A.S.S Wijethunga', 14, 34)

    // Table setup
    const tableColumn = ['#', 'Name', 'Email', 'Role', 'Created Date']
    const tableRows = adminsData.map((admin, index) => [
      index + 1,
      admin.name || admin.username || 'N/A',
      admin.email || 'N/A',
      admin.role || 'Administrator',
      admin.created_at ? new Date(admin.created_at).toLocaleDateString() : new Date().toLocaleDateString(),
    ])

    // Table generation
    autoTable(doc, {
      startY: 40,
      head: [tableColumn],
      body: tableRows,
      headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [243, 244, 246] },
      margin: { top: 40 },
    })

    // PDF එක Download කිරීම
    doc.save('Admin_Activity_Report.pdf')
  } catch (err) {
    console.error('Error generating PDF:', err)
    alert('An error occurred while generating the PDF: ' + (err as Error).message)
  }
}

function Panel({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`admin-panel ${className}`}>
      <div className="admin-panel-heading">
        <h2>{title}</h2>
        <button className="admin-text-button">
          View all <span aria-hidden="true">-&gt;</span>
        </button>
      </div>
      {children}
    </section>
  )
}

function TicketSalesChart() {
  const max = Math.max(...sales)
  return (
    <Panel title="Ticket Sales Overview" className="sales-panel">
      <div className="bar-chart" aria-label="Ticket sales for the last seven days">
        {sales.map((sale, index) => (
          <div className="bar-column" key={days[index]}>
            <span>{sale}</span>
            <div className="bar-track">
              <div className="bar-fill" style={{ height: `${(sale / max) * 100}%` }} />
            </div>
            <small>{days[index]}</small>
          </div>
        ))}
      </div>
    </Panel>
  )
}

function VerificationChart() {
  return (
    <Panel title="Verification Breakdown" className="verification-panel">
      <div className="verification-summary">
        <div className="donut-chart">
          <div>
            <strong>328</strong>
            <small>Total</small>
          </div>
        </div>
        <div className="verification-legend">
          <span><i className="legend-valid" />Valid <b>285</b></span>
          <span><i className="legend-invalid" />Invalid <b>18</b></span>
          <span><i className="legend-used" />Already Used <b>25</b></span>
        </div>
      </div>
    </Panel>
  )
}

function ActivityFeed() {
  return (
    <Panel title="Recent Activity">
      <div className="activity-list">
        {activities.map(([icon, title, text, time]) => (
          <div className="activity-item" key={title}>
            <span className="activity-icon">
              <AdminIcon name={icon} size={16} />
            </span>
            <div>
              <strong>{title}</strong>
              <p>{text}</p>
              <time>{time}</time>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  )
}

function FeedbackSnapshot() {
  return (
    <Panel title="Recent Feedback">
      <div className="feedback-list">
        <div>
          <div className="feedback-meta">
            <strong>Anonymous Student</strong>
            <span className="stars">★★★★★</span>
          </div>
          <p>"Booking was quick and easy."</p>
          <time>10 minutes ago</time>
        </div>
        <div>
          <div className="feedback-meta">
            <strong>Nethmi Perera</strong>
            <span className="stars">★★★★<span>★</span></span>
          </div>
          <p>"The route information was helpful."</p>
          <time>42 minutes ago</time>
        </div>
      </div>
    </Panel>
  )
}

function ReportCard({ report }: { report: string[] }) {
  const isAdminActivityReport = report[0] === 'Admin Activity Report'

  const handleDownload = () => {
    if (isAdminActivityReport) {
      downloadAdminActivityReport()
    } else {
      alert(`${report[0]} download feature will be available soon.`)
    }
  }

  return (
    <article className="report-card">
      <div className="report-title">
        <span className="report-icon">
          <AdminIcon name="reports" size={17} />
        </span>
        <h3>{report[0]}</h3>
      </div>
      <p>{report[1]}</p>
      <div className="report-owner">
        <span className="owner-avatar">{report[2].slice(0, 2)}</span>
        <span>
          <small>Owned by</small>
          <strong>{report[2]}</strong>
        </span>
      </div>
      <div className="report-controls">
        <select defaultValue="Last 30 days" aria-label={`${report[0]} date range`}>
          <option>Last 30 days</option>
          <option>This month</option>
          <option>This year</option>
        </select>
        <select defaultValue="PDF" aria-label={`${report[0]} format`}>
          <option>PDF</option>
          <option>CSV</option>
        </select>
        <button
          className="download-button"
          onClick={handleDownload}
          title="Download Report"
          style={{ cursor: 'pointer', opacity: 1 }}
        >
          <AdminIcon name="download" size={16} />
        </button>
      </div>
    </article>
  )
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
  const [walletReportLoading, setWalletReportLoading] = useState(false)
  const [walletReportError, setWalletReportError] = useState('')

  // Dynamic Admin States
  const [adminName, setAdminName] = useState('Admin')
  const [adminEmail, setAdminEmail] = useState<string>('')

  useEffect(() => {
    const checkUser = async () => {
      try {
        // 1. Check active Supabase Auth Session
        const { data: { session } } = await supabase.auth.getSession()
        let currentEmail = session?.user?.email || ''

        // 2. Check localStorage as fallback
        if (!currentEmail) {
          currentEmail = localStorage.getItem('userEmail') || localStorage.getItem('adminEmail') || ''
        }

        // 3. Fallback: If adminName is saved in localStorage, search admins table by name
        const savedName = localStorage.getItem('adminName')
        if (savedName) {
          setAdminName(savedName)
          if (!currentEmail) {
            const { data } = await supabase
              .from('admins')
              .select('email')
              .eq('name', savedName)
              .maybeSingle()

            if (data?.email) {
              currentEmail = data.email
            }
          }
        }

        setAdminEmail(currentEmail)
        setConnectionStatus('connected')
      } catch (err) {
        setConnectionStatus('error')
      }
    }

    checkUser()
  }, [])

  // STRICT SUPER ADMIN CHECK: ONLY admin@uniride.lk
  const isSuperAdmin = Boolean(
    adminEmail && adminEmail.trim().toLowerCase() === 'admin@uniride.lk'
  )

  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar ${menuOpen ? 'admin-sidebar-open' : ''}`}>
        <div className="admin-brand">
          <div className="brand-mark">U</div>
          <div>
            <strong>UniRide</strong>
            <span>Admin Portal</span>
          </div>
          <button className="sidebar-close" onClick={() => setMenuOpen(false)} aria-label="Close navigation">
            <AdminIcon name="close" />
          </button>
        </div>
        <nav>
          {navItems.map((item, index) => (
            <a
              className={index === 0 ? 'active' : ''}
              href={`#${item.label.toLowerCase()}`}
              key={item.label}
              onClick={() => setMenuOpen(false)}
            >
              <AdminIcon name={item.icon} />
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
        <button className="logout-button">
          <AdminIcon name="logout" />
          <span>Logout</span>
        </button>
      </aside>

      {menuOpen && (
        <button className="admin-overlay" aria-label="Close navigation" onClick={() => setMenuOpen(false)} />
      )}

      <div className="admin-main">
        <header className="admin-topbar">
          <button className="menu-button" onClick={() => setMenuOpen(true)} aria-label="Open navigation">
            <AdminIcon name="menu" />
          </button>
          <div>
            <h1>Dashboard</h1>
            <p>Overview of UniRide activity</p>
          </div>
          <div className="admin-user">
            <button className="notification-button" aria-label="Notifications">
              <AdminIcon name="bell" />
              <span />
            </button>
            <div className="admin-avatar">{adminName.slice(0, 2).toUpperCase()}</div>
            <div className="admin-user-name">
              <strong>{adminName}</strong>
              <small>{isSuperAdmin ? 'Super Admin' : 'Administrator'}</small>
            </div>
            <AdminIcon name="chevron" size={15} />
          </div>
        </header>

        <main className="admin-content">
          <section className="admin-welcome">
            <div className="admin-welcome-copy">
              <span className="eyebrow">SLIIT Kandy / Admin Portal</span>
              <h2>Good morning, {adminName}.</h2>
              <p>Keep today&apos;s rides moving smoothly.</p>
              <div className="quick-actions">
                <button><AdminIcon name="plus" size={16} /> Add Student</button>
                <button><AdminIcon name="plus" size={16} /> Top Up Wallet</button>
              </div>
            </div>
            <div className="welcome-mark">
              <AdminIcon name="dashboard" size={42} />
            </div>
          </section>

          <section className="admin-pulse" aria-label="Today's dashboard summary">
            <div>
              <span className="pulse-label">Students</span>
              <strong>2,450</strong>
              <small><AdminIcon name="trend" size={12} /> 12.5% this month</small>
            </div>
            <div>
              <span className="pulse-label">Tickets sold</span>
              <strong>328</strong>
              <small><AdminIcon name="ticket" size={12} /> 43 still available</small>
            </div>
            <div>
              <span className="pulse-label">Wallet top-ups</span>
              <strong>LKR 32,500</strong>
              <small><AdminIcon name="trend" size={12} /> 8.2% today</small>
            </div>
          </section>

          <p className={`database-status database-status-${connectionStatus}`} role="status">
            {connectionStatus === 'checking'
              ? 'Checking Supabase connection...'
              : connectionStatus === 'connected'
              ? 'Supabase connected'
              : 'Supabase connection failed'}
          </p>

          <div className="analytics-grid">
            <TicketSalesChart />
            <VerificationChart />
          </div>

          <div className="lower-grid">
            <ActivityFeed />
            <FeedbackSnapshot />
          </div>

          <section className="reports-section">
            <div className="reports-heading">
              <div>
                <span className="eyebrow">Export centre</span>
                <h2>Reports &amp; Downloads</h2>
                <p>Review and prepare operational reports for your records.</p>
              </div>
              <button className="outline-button">
                <AdminIcon name="reports" size={16} /> View report history
              </button>
            </div>
            <div className="reports-grid">
              {reports.map((report) => (
                <ReportCard key={report[0]} report={report} />
              ))}
            </div>
          </section>

          {/* Pass fetched adminEmail to AdminManagement */}
          <AdminManagement userEmail={adminEmail} />
        </main>
      </div>
    </div>
  )
}