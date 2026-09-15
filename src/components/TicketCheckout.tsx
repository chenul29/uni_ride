import { FormEvent, useState } from 'react'

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

const routes = [
  { name: 'Peradeniya → SLIIT KandyUni', time: '7:20 AM', price: 150 },
  { name: 'Kandy → SLIIT KandyUni', time: '7:50 AM', price: 100 },
  { name: 'SLIIT KandyUni → Kandy', price: 100 },
  { name: 'SLIIT KandyUni → Peradeniya', price: 150 },
]

export function TicketCheckout({ onClose, onPurchase }: TicketCheckoutProps) {
  const [routeIndex, setRouteIndex] = useState(0)
  const [morningExpanded, setMorningExpanded] = useState(false)
  const [eveningExpanded, setEveningExpanded] = useState(false)
  const [tickets, setTickets] = useState(1)
  const [payment, setPayment] = useState('UniRide wallet')
  const [ticket, setTicket] = useState<TicketDetails | null>(null)
  const [cardholder, setCardholder] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [securityCode, setSecurityCode] = useState('')
  const route = routes[routeIndex]
  const total = route.price * tickets

  const [purchaseError, setPurchaseError] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setPurchaseError('')
    const purchasedTicket = {
      route: route.name,
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
                  <button
                    className="route-toggle"
                    type="button"
                    aria-expanded={morningExpanded}
                    onClick={() => setMorningExpanded((expanded) => !expanded)}
                  >
                    <span>Morning Route</span>
                    <span className="route-toggle-detail">Departure Time: 7.20AM</span>
                    <span className="route-toggle-icon">{morningExpanded ? '−' : '+'}</span>
                  </button>
                  {morningExpanded && (
                    <div className="route-options">
                      {routes.slice(0, 2).map((item, index) => (
                        <button
                          className={`route-option${routeIndex === index ? ' selected' : ''}`}
                          type="button"
                          key={item.name}
                          onClick={() => setRouteIndex(index)}
                        >
                          <span>
                            <strong>{item.name}</strong>
                            <small>Departure time: {item.time}</small>
                          </span>
                          <b>LKR {item.price}</b>
                        </button>
                      ))}
                    </div>
                  )}
                  <button
                    className="route-toggle evening-route"
                    type="button"
                    aria-expanded={eveningExpanded}
                    onClick={() => setEveningExpanded((expanded) => !expanded)}
                  >
                    <span>Evening Route</span>
                    <span className="route-toggle-detail">Departure Time: 5:30 PM</span>
                    <span className="route-toggle-icon">{eveningExpanded ? '−' : '+'}</span>
                  </button>
                  {eveningExpanded && (
                    <div className="route-options evening-options">
                      {routes.slice(2).map((item, index) => {
                        const actualIndex = index + 2
                        return (
                          <button
                            className={`route-option${routeIndex === actualIndex ? ' selected' : ''}`}
                            type="button"
                            key={item.name}
                            onClick={() => setRouteIndex(actualIndex)}
                          >
                            <span>
                              <strong>{item.name}</strong>
                              {item.time && <small>Departure time: {item.time}</small>}
                            </span>
                            <b>LKR {item.price}</b>
                          </button>
                        )
                      })}
                    </div>
                  )}
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
              <button className="checkout-primary" type="submit">Confirm and purchase</button>
              <p className="checkout-note">Payment processing will be connected to your student wallet.</p>
            </form>
          </>
        )}
      </section>
    </div>
  )
}
