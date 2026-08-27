import { TransportationIllustration } from './TransportationIllustration'

/**
 * Hero Component
 * Landing hero section with headline, subheading, CTA buttons, and illustration
 * Features: Responsive layout, mobile stacking, subtle animations
 */
export function Hero() {
  const handleBooking = () => {
    // Visual button only - no functionality yet
    console.log('Book a Ride button clicked')
  }

  const handleHowItWorks = () => {
    // Visual button only - no functionality yet
    const element = document.getElementById('how-it-works')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-gradient-to-b from-neutral-background to-white pt-12 sm:pt-16 lg:pt-20 pb-12 sm:pb-16 lg:pb-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column - Content */}
          <div className="flex flex-col justify-center space-y-6 lg:space-y-8">
            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-main-text leading-tight">
                Your University Ride,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-blue to-primary-dark-blue">
                  Just a Few Clicks Away.
                </span>
              </h1>

              {/* Supporting Text */}
              <p className="text-lg sm:text-xl text-neutral-secondary-text leading-relaxed max-w-xl">
                Book your university bus, manage your digital balance, and travel with ease. Safe, reliable, and designed for students like you.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={handleBooking}
                className="px-8 py-3 bg-gradient-to-r from-primary-blue to-primary-dark-blue text-white font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <span>📱</span> Book a Ride
              </button>
              <button
                onClick={handleHowItWorks}
                className="px-8 py-3 border-2 border-primary-blue text-primary-blue font-semibold rounded-lg hover:bg-primary-blue hover:text-white transition-all duration-200 flex items-center justify-center gap-2"
              >
                <span>❓</span> How It Works
              </button>
            </div>

            {/* Trust Indicator */}
            <div className="pt-4 flex items-center gap-2 text-sm text-neutral-secondary-text">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-accent-orange">
                    ★
                  </span>
                ))}
              </div>
              <span>Trusted by 2,000+ students at SLIIT Kandy</span>
            </div>
          </div>

          {/* Right Column - Illustration */}
          <div className="relative h-96 sm:h-[450px] lg:h-[500px] flex items-center justify-center">
            {/* Decorative background circle */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-blue/10 to-accent-orange/10 rounded-3xl blur-3xl" />

            {/* Illustration */}
            <div className="relative z-10 w-full h-full">
              <TransportationIllustration />
            </div>

            {/* Floating accent elements */}
            <div className="absolute top-12 right-0 w-24 h-24 bg-accent-orange/5 rounded-full blur-2xl animate-subtle-float" />
            <div className="absolute bottom-12 left-0 w-32 h-32 bg-primary-blue/5 rounded-full blur-2xl animate-subtle-float" style={{ animationDelay: '1s' }} />
          </div>
        </div>

        {/* Scroll Indicator - Desktop only */}
        <div className="hidden lg:flex justify-center pt-12 pb-4">
          <div className="flex flex-col items-center gap-2 text-neutral-secondary-text animate-bounce">
            <span className="text-sm font-medium">Scroll to explore</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}
