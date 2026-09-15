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
import { PurchasedTickets } from './components/PurchasedTickets'
import StudentLogin from './components/studnet/StudentLogin'
import { supabase } from './lib/supabase'

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

type WalletRow = {
  id: string
  amount: number
}

type WalletTransactionRow = {
  booking_token: string
  route: string
  tickets: number
  payment_method: string
  amount: number
  status: string
  created_at: string
}

const HISTORY_RETENTION_MS = 14 * 24 * 60 * 60 * 1000
const INITIAL_WALLET_BALANCE = 1000

function App() {
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [walletTicket, setWalletTicket] = useState<PurchasedTicket | null>(null)
  const [purchaseHistory, setPurchaseHistory] = useState<PurchaseHistoryEntry[]>([])
  const [walletBalance, setWalletBalance] = useState(INITIAL_WALLET_BALANCE)
  const [purchaseHistoryLoading, setPurchaseHistoryLoading] = useState(true)

  const decreaseWalletBalance = async (amount: number) => {
    if (!supabase) return null

    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError || !userData.user) return null

    const { data: student, error: studentError } = await supabase
      .from('students')
      .select('id')
      .eq('auth_user_id', userData.user.id)
      .maybeSingle()

    if (studentError) throw studentError
    if (!student) return null

    const { data: walletRows, error: walletError } = await supabase
      .from('wallet')
      .select('id, amount')
      .eq('student_id', student.id)
      .order('created_at', { ascending: false })
      .limit(1)

    if (walletError) throw walletError
    const wallet = (walletRows || [])[0] as WalletRow | undefined
    const currentBalance = Number(wallet?.amount || 0)
    if (!wallet || currentBalance < amount) {
      throw new Error('Insufficient wallet balance for this purchase.')
    }

    const newBalance = currentBalance - amount
    const { data: updatedRows, error: updateError } = await supabase
      .from('wallet')
      .update({ amount: newBalance })
      .eq('id', wallet.id)
      .select('amount')

    if (updateError) throw updateError
    const updatedBalance = Number((updatedRows || [])[0]?.amount)
    if (!Number.isFinite(updatedBalance)) throw new Error('The wallet balance could not be updated.')
    return updatedBalance
  }

  const saveWalletTransaction = async () => {
    if (!walletTicket || !supabase) {
      throw new Error('Supabase is not configured.')
    }

    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError

    const { data: student, error: studentError } = userData.user
      ? await supabase.from('students').select('id').eq('auth_user_id', userData.user.id).maybeSingle()
      : { data: null, error: null }
    if (studentError) throw studentError

    const { error } = await supabase.from('wallet_transactions').insert({
      student_id: student?.id || null,
      booking_token: walletTicket.token,
      route: walletTicket.route,
      tickets: walletTicket.tickets,
      payment_method: walletTicket.payment,
      amount: walletTicket.total,
      balance_after: walletBalance,
      status: 'completed',
    })

    if (error) throw error
  }

  useEffect(() => {
    const removeExpiredHistory = () => {
      const cutoff = Date.now() - HISTORY_RETENTION_MS
      setPurchaseHistory((history) => history.filter((entry) => entry.purchasedAt >= cutoff))
    }

    removeExpiredHistory()
    const cleanupTimer = window.setInterval(removeExpiredHistory, 60 * 1000)
    return () => window.clearInterval(cleanupTimer)
  }, [])

  useEffect(() => {
    const loadSavedTickets = async () => {
      if (!supabase) {
        setPurchaseHistoryLoading(false)
        return
      }

      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError || !userData.user) {
        setPurchaseHistoryLoading(false)
        return
      }

      const { data: student, error: studentError } = await supabase
        .from('students')
        .select('id')
        .eq('auth_user_id', userData.user.id)
        .maybeSingle()

      if (studentError || !student) {
        setPurchaseHistoryLoading(false)
        return
      }

      const { data: transactions, error: transactionError } = await supabase
        .from('wallet_transactions')
        .select('booking_token, route, tickets, payment_method, amount, status, created_at')
        .or(`student_id.eq.${student.id},student_id.is.null`)
        .order('created_at', { ascending: false })

      if (!transactionError) {
        const savedTickets = ((transactions || []) as WalletTransactionRow[]).map((transaction) => {
          const purchasedAt = new Date(transaction.created_at)
          return {
            route: transaction.route,
            tickets: transaction.tickets,
            payment: transaction.payment_method,
            total: Number(transaction.amount),
            token: transaction.booking_token,
            date: purchasedAt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            time: purchasedAt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
            status: transaction.status,
            purchasedAt: purchasedAt.getTime(),
          }
        })
        setPurchaseHistory((currentHistory) => {
          const historyByToken = new Map(savedTickets.map((ticket) => [ticket.token, ticket]))
          currentHistory.forEach((ticket) => historyByToken.set(ticket.token, ticket))
          return Array.from(historyByToken.values()).sort((a, b) => b.purchasedAt - a.purchasedAt)
        })
      }
      setPurchaseHistoryLoading(false)
    }

    loadSavedTickets()
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
        <PurchasedTickets history={purchaseHistory} loading={purchaseHistoryLoading} onBookRide={() => setCheckoutOpen(true)} onDeleteTicket={async (ticket) => {
          if (!supabase) throw new Error('Supabase is not configured.')

          const { error } = await supabase.from('wallet_transactions').delete().eq('booking_token', ticket.token)
          if (error) throw error
          setPurchaseHistory((history) => history.filter((entry) => entry.token !== ticket.token))
          if (walletTicket?.token === ticket.token) setWalletTicket(null)
        }} />
        <HowItWorks />
        <Features />
        <Feedback />
      </main>
      <Footer />
      {checkoutOpen && (
        <TicketCheckout
          onClose={() => setCheckoutOpen(false)}
          onPurchase={async (ticket) => {
            const updatedBalance = ticket.payment === 'UniRide wallet'
              ? await decreaseWalletBalance(ticket.total)
              : null
            const purchasedAt = new Date()
            const purchasedAtTimestamp = purchasedAt.getTime()
            setCheckoutOpen(false)
            setWalletTicket(ticket)
            if (updatedBalance !== null) setWalletBalance(updatedBalance)
            else if (ticket.payment === 'UniRide wallet') setWalletBalance((balance) => Math.max(0, balance - ticket.total))
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
      {walletTicket && <StudentWallet ticket={walletTicket} history={purchaseHistory} balance={walletBalance} onClose={() => setWalletTicket(null)} onDone={saveWalletTransaction} />}
    </div>
  )
}

export default App