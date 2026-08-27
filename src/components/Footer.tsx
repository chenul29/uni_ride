/**
 * Footer Component
 * Professional footer with navigation, support, and university information
 * Features: Multiple link sections, copyright, clean design
 * Responsive: stacked on mobile, multi-column on desktop
 */

interface FooterLink {
  label: string
  href?: string
  onClick?: () => void
}

interface FooterSection {
  title: string
  links: FooterLink[]
}

const footerSections: FooterSection[] = [
  {
    title: 'Navigation',
    links: [
      { label: 'Home', onClick: () => scrollToSection('home') },
      { label: 'How It Works', onClick: () => scrollToSection('how-it-works') },
      { label: 'Features', onClick: () => scrollToSection('features') },
      { label: 'Feedback', onClick: () => scrollToSection('feedback') },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help', href: '#' },
      { label: 'FAQ', href: '#' },
      { label: 'Contact', href: '#' },
    ],
  },
  {
    title: 'University',
    links: [
      { label: 'SLIIT', href: '#' },
      { label: 'Student Affairs', href: '#' },
      { label: 'Transport', href: '#' },
    ],
  },
]

function scrollToSection(id: string) {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

function FooterLink({ link }: { link: FooterLink }) {
  return (
    <button
      onClick={link.onClick}
      className="text-neutral-secondary-text hover:text-primary-blue transition-colors duration-200 text-sm"
    >
      {link.label}
    </button>
  )
}

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-neutral-main-text text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Top Section: Brand + Link Sections */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-12 mb-8 sm:mb-12 pb-8 sm:pb-12 border-b border-white/10">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-blue to-accent-orange rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">U</span>
              </div>
              <h3 className="text-xl font-bold">UniRide</h3>
            </div>
            <p className="text-sm text-neutral-secondary-text">
              Easy travel for university students.
            </p>
          </div>

          {/* Footer Link Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold text-sm mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <FooterLink link={link} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section: Copyright */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-neutral-secondary-text">
          <div className="space-y-1">
            <p>© {currentYear} UniRide — SLIIT Kandy</p>
            <p className="text-xs">Developed as a university project.</p>
          </div>
          <p className="text-xs">All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
