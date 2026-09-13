/**
 * Feedback Component
 * Student testimonials section
 * Features: 3 testimonial cards with avatar initials, name, affiliation, feedback, and star rating
 * Responsive: grid layout that adapts to screen size
 */

import { FormEvent, useState } from 'react'
import { supabase } from '../lib/supabase'

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
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [rating, setRating] = useState(5)
  const [isSaving, setIsSaving] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitError('')

    if (!supabase) {
      setSubmitError('Feedback is temporarily unavailable. Please try again later.')
      return
    }

    const formData = new FormData(event.currentTarget)
    setIsSaving(true)

    const { error } = await supabase.from('feedback').insert({
      student_name: formData.get('studentName'),
      feedback: formData.get('feedback'),
      rating,
    })

    setIsSaving(false)

    if (error) {
      setSubmitError('We could not save your feedback. Please try again.')
      return
    }

    setIsSubmitted(true)
  }

  const closeForm = () => {
    setIsFormOpen(false)
    setIsSubmitted(false)
    setRating(5)
    setSubmitError('')
  }

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
          <button
            className="px-8 py-3 bg-gradient-to-r from-primary-blue to-primary-dark-blue text-white font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200"
            onClick={() => setIsFormOpen(true)}
          >
            Add Your Feedback
          </button>
        </div>
      </div>

      {isFormOpen && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4"
          role="presentation"
          onMouseDown={(event) => event.target === event.currentTarget && closeForm()}
        >
          <section
            className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-2xl sm:p-8"
            role="dialog"
            aria-modal="true"
            aria-labelledby="feedback-form-title"
          >
            <button
              type="button"
              className="absolute right-4 top-4 text-2xl leading-none text-slate-400 hover:text-slate-700"
              onClick={closeForm}
              aria-label="Close feedback form"
            >
              ×
            </button>

            {isSubmitted ? (
              <div className="py-8 text-center">
                <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-green-100 text-2xl font-bold text-green-600">
                  ✓
                </div>
                <h2 id="feedback-form-title" className="mb-2 text-2xl font-bold text-neutral-main-text">
                  Thank you for your feedback
                </h2>
                <p className="mb-6 text-sm text-neutral-secondary-text">
                  Your experience helps us make UniRide better for everyone.
                </p>
                <button type="button" className="rounded-lg bg-primary-blue px-6 py-3 font-semibold text-white hover:bg-primary-dark-blue" onClick={closeForm}>
                  Done
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6 pr-8">
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-primary-blue">Student feedback</p>
                  <h2 id="feedback-form-title" className="text-2xl font-bold text-neutral-main-text">Share your experience</h2>
                  <p className="mt-2 text-sm text-neutral-secondary-text">Tell us how UniRide is working for you.</p>
                </div>

                <form className="grid gap-5" onSubmit={handleSubmit}>
                  <label className="grid gap-2 text-sm font-semibold text-slate-700">
                    Student name
                    <input
                      className="min-h-11 rounded-lg border border-slate-300 px-3 text-sm font-normal outline-none focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20"
                      name="studentName"
                      placeholder="Enter your name"
                      required
                    />
                  </label>
                  <label className="grid gap-2 text-sm font-semibold text-slate-700">
                    Feedback
                    <textarea
                      className="min-h-28 resize-y rounded-lg border border-slate-300 px-3 py-3 text-sm font-normal outline-none focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20"
                      name="feedback"
                      placeholder="What do you think about UniRide?"
                      required
                    />
                  </label>
                  <fieldset className="grid gap-2">
                    <legend className="text-sm font-semibold text-slate-700">Rating</legend>
                    <div className="flex gap-1" aria-label={`${rating} out of 5 stars selected`}>
                      {[1, 2, 3, 4, 5].map((value) => (
                        <button
                          key={value}
                          type="button"
                          className={`text-2xl ${value <= rating ? 'text-accent-orange' : 'text-slate-300'} hover:text-accent-orange`}
                          onClick={() => setRating(value)}
                          aria-label={`${value} star${value === 1 ? '' : 's'}`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </fieldset>
                  {submitError && <p className="text-sm text-red-600" role="alert">{submitError}</p>}
                  <button type="submit" disabled={isSaving} className="rounded-lg bg-primary-blue py-3 font-semibold text-white hover:bg-primary-dark-blue disabled:cursor-not-allowed disabled:opacity-60">
                    {isSaving ? 'Saving feedback...' : 'Submit feedback'}
                  </button>
                </form>
              </>
            )}
          </section>
        </div>
      )}
    </section>
  )
}
