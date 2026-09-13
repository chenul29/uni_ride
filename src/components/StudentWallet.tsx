import { useState } from 'react'

export function StudentWallet() {
  const [morningRouteOpen, setMorningRouteOpen] = useState(false)
  const [selectedMorningRoute, setSelectedMorningRoute] = useState('')

  return (
    <div className="min-h-screen bg-neutral-background text-neutral-main-text">
      <header className="border-b border-neutral-border bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="/" className="flex items-center gap-3" aria-label="Return to UniRide home">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-blue to-primary-dark-blue text-sm font-bold text-white">U</span>
            <span>
              <span className="block text-xl font-bold text-primary-blue">UniRide</span>
              <span className="hidden text-xs leading-none text-neutral-secondary-text sm:block">Student Wallet</span>
            </span>
          </a>
          <a href="/" className="font-semibold text-primary-blue transition-colors hover:text-primary-dark-blue">Back to home</a>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent-orange">Student portal</p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Student Wallet</h1>
          <p className="mt-2 max-w-2xl text-neutral-secondary-text">Manage your travel balance and choose a university ride.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          <section className="rounded-xl bg-gradient-to-br from-primary-blue to-primary-dark-blue p-6 text-white shadow-lg" aria-labelledby="balance-heading">
            <p className="text-sm font-medium text-blue-100">Available balance</p>
            <h2 id="balance-heading" className="mt-3 text-4xl font-bold">LKR 1,250.00</h2>
            <p className="mt-2 text-sm text-blue-100">Ready to use for your next ride</p>
            <button type="button" className="mt-8 rounded-lg bg-white px-5 py-3 font-semibold text-primary-blue transition hover:bg-blue-50">Top up wallet</button>
          </section>

          <section className="rounded-xl border border-neutral-border bg-white p-6 shadow-sm" aria-labelledby="ride-heading">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-accent-orange">Book a ride</p>
                <h2 id="ride-heading" className="mt-1 text-2xl font-bold">Choose your route</h2>
              </div>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-primary-blue">2 available</span>
            </div>
            <div className="mt-6 space-y-3">
              <button
                type="button"
                aria-expanded={morningRouteOpen}
                onClick={() => setMorningRouteOpen((isOpen) => !isOpen)}
                className={`flex w-full items-center justify-between rounded-lg border p-4 text-left transition hover:border-primary-blue hover:bg-blue-50 ${morningRouteOpen ? 'border-2 border-primary-blue bg-blue-50' : 'border-neutral-border'}`}
              >
                <span><strong className="block">Morning Campus Route</strong><span className="text-sm text-neutral-secondary-text">Select a pickup route</span></span>
                <span className="font-semibold text-primary-blue">Select</span>
              </button>
              {morningRouteOpen && (
                <div className="rounded-lg border border-neutral-border bg-neutral-background p-4">
                  <label htmlFor="morning-campus-route" className="block text-sm font-medium text-neutral-main-text">Choose your pickup route</label>
                  <select id="morning-campus-route" value={selectedMorningRoute} onChange={(event) => setSelectedMorningRoute(event.target.value)} className="mt-2 block w-full rounded-lg border border-neutral-border bg-white px-3 py-2 text-neutral-main-text focus:border-primary-blue focus:outline-none focus:ring-2 focus:ring-primary-blue/20">
                    <option value="" disabled>Select a route</option>
                    <option value="peradeniya-campus">Peradeniya → Campus</option>
                    <option value="kandy-campus">Kandy → Campus</option>
                  </select>
                  {selectedMorningRoute === 'peradeniya-campus' && (
                    <p className="mt-2 text-sm font-medium text-neutral-secondary-text">7:30 AM · LKR 150</p>
                  )}
                  {selectedMorningRoute === 'kandy-campus' && (
                    <p className="mt-2 text-sm font-medium text-neutral-secondary-text">8:00 AM · LKR 100</p>
                  )}
                </div>
              )}
              <button type="button" className="flex w-full items-center justify-between rounded-lg border border-neutral-border p-4 text-left transition hover:border-primary-blue hover:bg-blue-50">
                <span><strong className="block">Evening Campus Route</strong><span className="text-sm text-neutral-secondary-text">04:30 PM · LKR 150</span></span>
                <span className="font-semibold text-primary-blue">Select</span>
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
