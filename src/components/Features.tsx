/**
 * Features Component
 * Highlights key features of UniRide system
 * Features: 4 feature cards with icons, titles, descriptions
 * Responsive: grid layout that adapts to screen size
 */

interface Feature {
  title: string
  description: string
  icon: string
}

const features: Feature[] = [
  {
    title: 'Easy Booking',
    description: 'Book your university bus quickly and conveniently with just a few taps.',
    icon: '⚡',
  },
  {
    title: 'Digital Balance',
    description: 'Manage your transportation balance in one place securely and easily.',
    icon: '💰',
  },
  {
    title: 'Secure Token',
    description: 'Every booking provides a simple 4-digit token for ride confirmation.',
    icon: '🔒',
  },
  {
    title: 'Ride Management',
    description: 'View and manage your upcoming and previous rides anytime, anywhere.',
    icon: '📋',
  },
]

function FeatureCard({ feature }: { feature: Feature }) {
  return (
    <div className="group bg-white border border-neutral-border rounded-2xl p-8 hover:border-primary-blue hover:shadow-xl transition-all duration-300">
      {/* Icon */}
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-blue/10 to-accent-orange/10 rounded-xl group-hover:from-primary-blue/20 group-hover:to-accent-orange/20 transition-all duration-300 mb-6">
        <span className="text-3xl">{feature.icon}</span>
      </div>

      {/* Title */}
      <h3 className="text-lg sm:text-xl font-bold text-neutral-main-text mb-3 group-hover:text-primary-blue transition-colors duration-200">
        {feature.title}
      </h3>

      {/* Description */}
      <p className="text-sm sm:text-base text-neutral-secondary-text leading-relaxed group-hover:text-neutral-main-text transition-colors duration-200">
        {feature.description}
      </p>

      {/* Accent line - bottom left */}
      <div className="mt-6 h-1 w-0 bg-gradient-to-r from-primary-blue to-accent-orange rounded group-hover:w-12 transition-all duration-300" />
    </div>
  )
}

export function Features() {
  return (
    <section
      id="features"
      className="relative py-16 sm:py-20 lg:py-28 bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-main-text mb-4">
            Everything You Need for Easier Campus Travel
          </h2>
          <p className="text-lg sm:text-xl text-neutral-secondary-text">
            UniRide is designed with students in mind. Here's what makes it great.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {features.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>

        {/* Trust Stats */}
        <div className="mt-16 sm:mt-20 pt-12 sm:pt-16 border-t border-neutral-border">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-primary-blue mb-2">2K+</div>
              <p className="text-sm text-neutral-secondary-text">Active Students</p>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-primary-blue mb-2">15</div>
              <p className="text-sm text-neutral-secondary-text">Campus Routes</p>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-primary-blue mb-2">24/7</div>
              <p className="text-sm text-neutral-secondary-text">Support</p>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-primary-blue mb-2">99%</div>
              <p className="text-sm text-neutral-secondary-text">Satisfaction</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
