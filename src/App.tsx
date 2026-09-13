import { useEffect, useState } from 'react'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { HowItWorks } from './components/HowItWorks'
import { Features } from './components/Features'
import { Feedback } from './components/Feedback'
import { Footer } from './components/Footer'
import AdminLogin from './components/admin/AdminLogin'
import { AdminDashboard } from './components/admin/AdminDashboard'
import { TicketCheckout } from './components/TicketCheckout'
import { ConductorVerification } from './components/ConductorVerification'
import { StudentWallet } from './components/StudentWallet'

type PurchasedTicket = {
  route: string
  tickets: number
  payment: string
  total: number
  token: string
}

type PurchaseHistoryEntry = PurchasedTicket & {
  date: string
  time: string
  status: string
  purchasedAt: number
}

const HISTORY_RETENTION_MS = 14 * 24 * 60 * 60 * 1000
const INITIAL_WALLET_BALANCE = 1000

function App() {
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [walletTicket, setWalletTicket] = useState<PurchasedTicket | null>(null)
  const [purchaseHistory, setPurchaseHistory] = useState<PurchaseHistoryEntry[]>([])
  const [walletBalance, setWalletBalance] = useState(INITIAL_WALLET_BALANCE)

  useEffect(() => {
    const removeExpiredHistory = () => {
      const cutoff = Date.now() - HISTORY_RETENTION_MS
      setPurchaseHistory((history) => history.filter((entry) => entry.purchasedAt >= cutoff))
    }

    removeExpiredHistory()
    const cleanupTimer = window.setInterval(removeExpiredHistory, 60 * 1000)
    return () => window.clearInterval(cleanupTimer)
  }, [])

  if (window.location.pathname === '/admin') {
    return (
      <AdminLogin onLoginSuccess={() => {
        window.location.href = '/admin/dashboard'
      }} />
    )
  }

  if (window.location.pathname === '/admin/dashboard') {
    return <AdminDashboard />
  }
if (window.location.pathname === '/conductor') {
  return <ConductorVerification />
  }

  if (window.location.pathname === '/student/login') {
    return <StudentLogin />
  }

  if (window.location.pathname === '/student/register') {
    return <StudentLogin mode="register" />
  }

  return (
    <div className="w-full min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero onBookRide={() => setCheckoutOpen(true)} />
        <HowItWorks />
        <Features />
        <Feedback />
      </main>
      <Footer />
      {checkoutOpen && (
        <TicketCheckout
          onClose={() => setCheckoutOpen(false)}
          onPurchase={(ticket) => {
            const purchasedAt = new Date()
            const purchasedAtTimestamp = purchasedAt.getTime()
            setCheckoutOpen(false)
            setWalletTicket(ticket)
            setWalletBalance((balance) => Math.max(0, balance - ticket.total))
            setPurchaseHistory((history) => {
              const cutoff = purchasedAtTimestamp - HISTORY_RETENTION_MS
              return [{
                ...ticket,
                date: purchasedAt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                time: purchasedAt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
                status: 'Purchased',
                purchasedAt: purchasedAtTimestamp,
              }, ...history.filter((entry) => entry.purchasedAt >= cutoff)]
            })
          }}
        />
      )}
      {walletTicket && <StudentWallet ticket={walletTicket} history={purchaseHistory} balance={walletBalance} onClose={() => setWalletTicket(null)} />}
    </div>
  )
}

export default App