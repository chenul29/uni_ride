import { useState } from 'react'

/**
 * Navbar Component
 * Responsive navigation bar with logo, menu items, and login button
 * Features: Sticky positioning, hamburger menu on mobile, smooth scroll links
 */
export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  // Smooth scroll to section
  const handleNavClick = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsMenuOpen(false)
    }
  }

  // Hamburger Menu Icon
  const MenuIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )

  // Close Icon
  const CloseIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-neutral-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            {/* Logo Icon */}
            <div className="w-8 h-8 bg-gradient-to-br from-primary-blue to-primary-dark-blue rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">U</span>
            </div>
            {/* Brand Name */}
            <div>
              <h1 className="text-xl font-bold text-primary-blue">UniRide</h1>
              <p className="text-xs text-neutral-secondary-text hidden sm:block leading-none">
                Easy travel for students
              </p>
            </div>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => handleNavClick('home')}
              className="text-neutral-main-text hover:text-primary-blue font-medium transition-colors duration-200"
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('how-it-works')}
              className="text-neutral-main-text hover:text-primary-blue font-medium transition-colors duration-200"
            >
              How It Works
            </button>
            <button
              onClick={() => handleNavClick('features')}
              className="text-neutral-main-text hover:text-primary-blue font-medium transition-colors duration-200"
            >
              Features
            </button>
            <button
              onClick={() => handleNavClick('feedback')}
              className="text-neutral-main-text hover:text-primary-blue font-medium transition-colors duration-200"
            >
              Feedback
            </button>
          </div>

          {/* Right Section - Login Button and Mobile Menu Toggle */}
          <div className="flex items-center space-x-4">
            <button className="hidden sm:block px-6 py-2 text-primary-blue border-2 border-primary-blue rounded-lg font-semibold hover:bg-primary-blue hover:text-white transition-all duration-200">
              Login
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-lg hover:bg-neutral-background transition-colors duration-200 text-neutral-main-text"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-neutral-border py-4 space-y-3">
            <button
              onClick={() => handleNavClick('home')}
              className="block w-full text-left px-4 py-2 text-neutral-main-text hover:bg-neutral-background hover:text-primary-blue rounded-lg transition-colors duration-200"
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('how-it-works')}
              className="block w-full text-left px-4 py-2 text-neutral-main-text hover:bg-neutral-background hover:text-primary-blue rounded-lg transition-colors duration-200"
            >
              How It Works
            </button>
            <button
              onClick={() => handleNavClick('features')}
              className="block w-full text-left px-4 py-2 text-neutral-main-text hover:bg-neutral-background hover:text-primary-blue rounded-lg transition-colors duration-200"
            >
              Features
            </button>
            <button
              onClick={() => handleNavClick('feedback')}
              className="block w-full text-left px-4 py-2 text-neutral-main-text hover:bg-neutral-background hover:text-primary-blue rounded-lg transition-colors duration-200"
            >
              Feedback
            </button>
            <button className="block w-full px-4 py-2 mt-2 text-primary-blue border-2 border-primary-blue rounded-lg font-semibold hover:bg-primary-blue hover:text-white transition-all duration-200">
              Login
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
