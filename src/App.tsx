import { useState } from 'react'
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

function App() {
  const [checkoutOpen, setCheckoutOpen] = useState(false)

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
      {checkoutOpen && <TicketCheckout onClose={() => setCheckoutOpen(false)} />}
    </div>
  )
}

export default App