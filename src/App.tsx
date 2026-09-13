import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { HowItWorks } from './components/HowItWorks'
import { Features } from './components/Features'
import { Feedback } from './components/Feedback'
import { Footer } from './components/Footer'
import { AdminLogin } from './components/admin/AdminLogin'
import { StudentWallet } from './components/StudentWallet'

/**
 * App Component
 * Main application component that assembles the landing page
 */
function App() {
  if (window.location.pathname === '/admin') {
    return <AdminLogin />
  }

  if (window.location.pathname === '/student-wallet') {
    return <StudentWallet />
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
