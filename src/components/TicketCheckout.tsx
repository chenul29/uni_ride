import { FormEvent, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

type TicketCheckoutProps = {
  onClose: () => void
  onPurchase: (ticket: TicketDetails) => void | Promise<void>
}

type TicketDetails = {
  route: string
  tickets: number
  payment: string
  total: number
  token: string
}

type Route = {
  id: string
  starting_point: string
  ending_point: string
  ticket_price: number
}

export function TicketCheckout({ onClose, onPurchase }: TicketCheckoutProps) {
  const [routes, setRoutes] = useState<Route[]>([])
  const [selectedRouteId, setSelectedRouteId] = useState('')
  const [routesLoading, setRoutesLoading] = useState(true)
  const [routesError, setRoutesError] = useState('')
  const [tickets, setTickets] = useState(1)
  const [payment, setPayment] = useState('UniRide wallet')
  const [ticket, setTicket] = useState<TicketDetails | null>(null)
  const [cardholder, setCardholder] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [securityCode, setSecurityCode] = useState('')
  const route = routes.find(({ id }) => id === selectedRouteId)
  const routeName = route ? `${route.starting_point} → ${route.ending_point}` : ''
  const total = route ? Number(route.ticket_price) * tickets : 0

  const [purchaseError, setPurchaseError] = useState('')

  useEffect(() => {
    let active = true

    const loadRoutes = async () => {
      if (!supabase) {
        setRoutesError('Routes are unavailable because Supabase is not configured.')
        setRoutesLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('routes')
        .select('id, starting_point, ending_point, ticket_price')
        .order('created_at', { ascending: true })

      if (!active) return
      if (error) {
        setRoutesError(error.message)
      } else {
        const availableRoutes = (data || []) as Route[]
        setRoutes(availableRoutes)
        setSelectedRouteId(availableRoutes[0]?.id || '')
      }
      setRoutesLoading(false)
    }

    void loadRoutes()
    return () => { active = false }
  }, [])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setPurchaseError('')
    if (!route) {
      setPurchaseError('Select an available route before continuing.')
      return
    }
    const purchasedTicket = {
      route: routeName,
      tickets,
      payment,
      total,
      token: `UR${Math.floor(1000 + Math.random() * 9000)}`,
    }
    try {
      await onPurchase(purchasedTicket)
      setTicket(purchasedTicket)
    } catch (error) {
      setPurchaseError(error instanceof Error ? error.message : 'Could not complete the purchase.')
    }
  }

  return (
    <div className="checkout-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="checkout-modal" role="dialog" aria-modal="true" aria-labelledby="checkout-title">
        <button className="checkout-close" onClick={onClose} aria-label="Close ticket checkout">×</button>
        {ticket ? (
          <div className="checkout-success">
            <div className="checkout-success-icon">✓</div>
            <span className="checkout-eyebrow">Booking confirmed</span>
            <h2 id="checkout-title">Your ride is ready.</h2>
            <p>Show this booking token to the conductor when you board.</p>
            <div className="booking-token">{ticket.token}</div>
            <dl className="booking-summary">
              <div><dt>Route</dt><dd>{ticket.route}</dd></div>
              <div><dt>Tickets</dt><dd>{ticket.tickets}</dd></div>
              <div><dt>Paid from</dt><dd>{ticket.payment}</dd></div>
              <div><dt>Total</dt><dd>LKR {ticket.total.toLocaleString()}</dd></div>
            </dl>
            <button className="checkout-primary" onClick={onClose}>Done</button>
          </div>
        ) : (
          <>
            <div className="checkout-heading">
              <span className="checkout-eyebrow">Student ticket purchase</span>
              <h2 id="checkout-title">Book Your University Ride</h2>
              <p>Choose a route and reserve your seat in a few seconds.</p>
            </div>
            <form onSubmit={handleSubmit}>
              <label>
                Route
                <div className="route-picker">
                  {routesLoading ? <p className="admin-empty-state">Loading available routes...</p> : routesError ? <p className="database-status database-status-error" role="alert">{routesError}</p> : routes.length === 0 ? <p className="admin-empty-state">No routes are currently available.</p> : <div className="route-options">
                    {routes.map((item) => (
                      <button
                        className={`route-option${selectedRouteId === item.id ? ' selected' : ''}`}
                        type="button"
                        key={item.id}
                        aria-pressed={selectedRouteId === item.id}
                        onClick={() => setSelectedRouteId(item.id)}
                      >
                        <span><strong>{item.starting_point} → {item.ending_point}</strong></span>
                        <b>LKR {Number(item.ticket_price).toFixed(2)}</b>
                      </button>
                    ))}
                  </div>}
                </div>
              </label>
              <label>
                Number of tickets
                <select value={tickets} onChange={(event) => setTickets(Number(event.target.value))}>
                  {[1, 2, 3, 4, 5, 6].map((count) => <option value={count} key={count}>{count} {count === 1 ? 'ticket' : 'tickets'}</option>)}
                </select>
              </label>
              <label>
                Payment method
                <select value={payment} onChange={(event) => setPayment(event.target.value)}>
                  <option>UniRide wallet</option>
                  <option>Pay at university office</option>
                  <option>Pay online by card</option>
                </select>
              </label>
              {payment === 'Pay online by card' && (
                <fieldset className="card-details">
                  <legend>Credit or debit card</legend>
                  <label>
                    Cardholder name
                    <input value={cardholder} onChange={(event) => setCardholder(event.target.value)} placeholder="Name on card" required />
                  </label>
                  <label>
                    Card number
                    <input value={cardNumber} onChange={(event) => setCardNumber(event.target.value)} inputMode="numeric" placeholder="1234 5678 9012 3456" minLength={12} maxLength={19} required />
                  </label>
                  <div className="checkout-fields">
                    <label>
                      Expiry
                      <input value={expiry} onChange={(event) => setExpiry(event.target.value)} placeholder="MM / YY" maxLength={7} required />
                    </label>
                    <label>
                      CVV
                      <input value={securityCode} onChange={(event) => setSecurityCode(event.target.value)} inputMode="numeric" placeholder="123" maxLength={4} required />
                    </label>
                  </div>
                  <p className="card-note">Secure card processing will be connected before launch.</p>
                </fieldset>
              )}
              <div className="checkout-total"><span>Total</span><strong>LKR {total.toLocaleString()}</strong></div>
              {purchaseError && <p className="database-status database-status-error" role="alert">{purchaseError}</p>}
              <button className="checkout-primary" type="submit" disabled={routesLoading || !route}>Confirm and purchase</button>
              <p className="checkout-note">Payment processing will be connected to your student wallet.</p>
            </form>
          </>
        )}
      </section>
    </div>
  )
}
