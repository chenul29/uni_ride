/**
 * HowItWorks Component
 * Step-by-step guide showing how UniRide works
 * Features: 4 step cards with numbers, icons, titles, descriptions
 * Responsive: horizontal on desktop, vertical on mobile
 */

interface Step {
  number: string
  title: string
  description: string
  icon: string
}

const steps: Step[] = [
  {
    number: '01',
    title: 'Login',
    description: 'Sign in using your university account.',
    icon: '🔐',
  },
  {
    number: '02',
    title: 'Add Balance',
    description: 'Add digital cash to your UniRide account through the university administration.',
    icon: '💳',
  },
  {
    number: '03',
    title: 'Book Your Ride',
    description: 'Select your route and book an available university bus.',
    icon: '🚌',
  },
  {
    number: '04',
    title: 'Show Your Token',
    description: 'Receive a 4-digit booking token and provide it to the conductor to confirm your ride.',
    icon: '🎫',
  },
]

function StepCard({ step, isLast }: { step: Step; isLast: boolean }) {
  return (
    <div className="flex flex-col items-center relative flex-1">
      {/* Step card container */}
      <div className="flex min-h-[240px] w-full flex-col justify-between rounded-xl border border-neutral-border bg-white p-6 transition-colors duration-300 hover:border-primary-blue sm:p-8">
        {/* Step number with orange accent */}
        <div className="flex items-start justify-between mb-4">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 text-lg font-bold text-accent-orange">
            {step.number}
          </span>
          <span className="text-4xl">{step.icon}</span>
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-lg sm:text-xl font-bold text-neutral-main-text mb-2">
            {step.title}
          </h3>
          <p className="text-sm sm:text-base text-neutral-secondary-text leading-relaxed">
            {step.description}
          </p>
        </div>
      </div>

      {/* Connecting arrow - desktop only, not on last item */}
      {!isLast && (
        <div className="hidden lg:flex absolute -right-6 top-1/2 transform -translate-y-1/2 z-10">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      )}

      {/* Mobile vertical connector - not on last item */}
      {!isLast && (
        <div className="lg:hidden w-1 h-8 bg-gradient-to-b from-primary-blue to-transparent mt-4" />
      )}
    </div>
  )
}

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative bg-neutral-background py-16 sm:py-20 lg:py-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-main-text mb-4">
            How UniRide Works
          </h2>
          <p className="text-lg sm:text-xl text-neutral-secondary-text">
            Getting your university ride is simple.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative">
          {steps.map((step, index) => (
            <StepCard
              key={step.number}
              step={step}
              isLast={index === steps.length - 1}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 sm:mt-16 text-center">
          <p className="text-neutral-secondary-text mb-6">
            Ready to get started with UniRide?
          </p>
          <button className="px-8 py-3 bg-gradient-to-r from-primary-blue to-primary-dark-blue text-white font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200">
            Book Your First Ride
          </button>
        </div>
      </div>
    </section>
  )
}
