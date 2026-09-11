import { useState } from 'react'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { HowItWorks } from './components/HowItWorks'
import { Features } from './components/Features'
import { Feedback } from './components/Feedback'
import { Footer } from './components/Footer'
import { AdminLogin } from './components/admin/AdminLogin'
import { AdminDashboard } from './components/admin/AdminDashboard'

/**
 * App Component
 * Main application component that assembles the landing page
 */
function App() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(
    window.location.pathname === '/admin/dashboard',
  )

  if (window.location.pathname === '/admin/dashboard' && isAdminAuthenticated) {
    return <AdminDashboard />
  }

  if (window.location.pathname === '/admin') {
    return (
      <AdminLogin
        onLoginSuccess={() => {
          window.history.pushState({}, '', '/admin/dashboard')
          setIsAdminAuthenticated(true)
        }}
      />
    )
  }

  return (
    <div className="w-full min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <Feedback />
      </main>
      <Footer />
    </div>
  )
}

export default App
