/**
 * Hero Component
 * Landing hero section with headline, subheading, CTA buttons, and illustration
 * Features: Responsive layout, mobile stacking, subtle animations
 */
export function Hero({ onBookRide }: { onBookRide: () => void }) {

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
      className="relative overflow-hidden bg-neutral-background"
    >
      <div className="relative h-[430px] bg-primary-dark-blue sm:h-[480px]">
        <img
          src="/images/campus.jpg"
          alt="SLIIT Kandy campus building"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark-blue/85 via-primary-dark-blue/60 to-primary-dark-blue/25" />

        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          {/* Banner content */}
          <div className="max-w-2xl rounded-2xl border border-white/20 bg-slate-950/40 p-6 shadow-lg backdrop-blur-[2px] sm:p-8">
            {/* Main Heading */}
            <div className="space-y-4">
              <p className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-white">SLIIT Kandy student transport</p>
              <h1 className="text-4xl font-bold leading-tight text-white drop-shadow-md sm:text-5xl lg:text-6xl">
                Your university ride, made simple.
              </h1>

              {/* Supporting Text */}
              <p className="max-w-xl text-base font-medium leading-relaxed text-white drop-shadow sm:text-lg">
                Book your university bus, manage your digital balance, and travel with ease. Safe, reliable, and designed for students like you.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3 pt-6 sm:flex-row">
              <button
                onClick={onBookRide}
                className="flex items-center justify-center gap-2 rounded-lg bg-white px-7 py-3 font-semibold text-primary-dark-blue transition-colors hover:bg-blue-50"
              >
                Book a Ride
              </button>
              <button
                onClick={handleHowItWorks}
                className="flex items-center justify-center gap-2 rounded-lg border border-white/70 px-7 py-3 font-semibold text-white transition-colors hover:bg-white/10"
              >
                How It Works
              </button>
            </div>

            {/* Trust Indicator */}
            <div className="flex items-center gap-2 pt-6 text-sm font-medium text-white">
              <span className="h-2 w-2 rounded-full bg-accent-orange" />
              <span>Trusted by 2,000+ students at SLIIT Kandy</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
