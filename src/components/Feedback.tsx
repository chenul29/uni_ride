/**
 * Feedback Component
 * Student testimonials section
 * Features: 3 testimonial cards with avatar initials, name, affiliation, feedback, and star rating
 * Responsive: grid layout that adapts to screen size
 */

interface Testimonial {
  initials: string
  name: string
  affiliation: string
  feedback: string
  rating: number
}

const testimonials: Testimonial[] = [
  {
    initials: 'KA',
    name: 'Kayla Andersen',
    affiliation: 'SLIIT Student',
    feedback:
      'Booking my university bus is much easier and more convenient with UniRide. I recommend it to all my friends on campus.',
    rating: 5,
  },
  {
    initials: 'JM',
    name: 'James Mitchell',
    affiliation: 'SLIIT Student',
    feedback:
      'The digital balance feature is fantastic. I can manage my transportation spending and never miss a ride. Great app!',
    rating: 5,
  },
  {
    initials: 'SR',
    name: 'Sophia Reyes',
    affiliation: 'SLIIT Student',
    feedback:
      'The 4-digit token system is simple and works perfectly. UniRide has definitely made campus life more comfortable.',
    rating: 5,
  },
]

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="bg-white border border-neutral-border rounded-xl p-6 sm:p-8 hover:border-primary-blue hover:shadow-lg transition-all duration-300">
      {/* Star Rating */}
      <div className="flex gap-1 mb-4">
        {[...Array(testimonial.rating)].map((_, i) => (
          <span key={i} className="text-accent-orange text-lg">
            ★
          </span>
        ))}
      </div>

      {/* Feedback Text */}
      <p className="text-neutral-main-text mb-6 leading-relaxed italic">
        "{testimonial.feedback}"
      </p>

      {/* Avatar and Student Info */}
      <div className="flex items-center gap-4">
        {/* Avatar Circle with Initials */}
        <div className="w-12 h-12 bg-gradient-to-br from-primary-blue to-primary-dark-blue rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-sm">{testimonial.initials}</span>
        </div>

        {/* Student Name and Affiliation */}
        <div>
          <p className="font-semibold text-neutral-main-text">{testimonial.name}</p>
          <p className="text-sm text-neutral-secondary-text">{testimonial.affiliation}</p>
        </div>
      </div>
    </div>
  )
}

export function Feedback() {
  return (
    <section
      id="feedback"
      className="relative py-16 sm:py-20 lg:py-28 bg-gradient-to-b from-white to-neutral-background"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-main-text mb-4">
            What Students Say About UniRide
          </h2>
          <p className="text-lg sm:text-xl text-neutral-secondary-text">
            Hear from real SLIIT students about their UniRide experience.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.name} testimonial={testimonial} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 sm:mt-16 text-center">
          <p className="text-neutral-secondary-text mb-6">
            Join 2,000+ students already using UniRide for convenient campus travel.
          </p>
          <button className="px-8 py-3 bg-gradient-to-r from-primary-blue to-primary-dark-blue text-white font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200">
            Get Started Today
          </button>
        </div>
      </div>
    </section>
  )
}
