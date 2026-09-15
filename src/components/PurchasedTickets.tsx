import { useState } from 'react'

type PurchasedTicket = {
  route: string
  tickets: number
  payment: string
  total: number
  token: string
}

type PurchaseHistoryEntry = PurchasedTicket & {
  date: string
  time: string
  status: string
  purchasedAt: number
}

type PurchasedTicketsProps = {
  history: PurchaseHistoryEntry[]
  loading: boolean
  onBookRide: () => void
  onDeleteTicket: (ticket: PurchaseHistoryEntry) => Promise<void>
}

export function PurchasedTickets({ history, loading, onBookRide, onDeleteTicket }: PurchasedTicketsProps) {
  const [deletingToken, setDeletingToken] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState('')

  const handleDelete = async (ticket: PurchaseHistoryEntry) => {
    if (!window.confirm(`Delete ticket ${ticket.token}?`)) return
    setDeletingToken(ticket.token)
    setDeleteError('')
    try {
      await onDeleteTicket(ticket)
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : 'Could not delete the ticket.')
    } finally {
      setDeletingToken(null)
    }
  }

  return <section id="my-tickets" className="purchased-tickets-home" aria-labelledby="purchased-tickets-title">
    <div className="purchased-tickets-home-inner">
      <div className="purchased-tickets-home-heading">
        <div>
          <span className="purchased-tickets-home-eyebrow">Student wallet</span>
          <h2 id="purchased-tickets-title">My Purchased Tickets</h2>
          <p>Keep track of the rides you booked through Book a Ride.</p>
        </div>
        <button type="button" className="purchased-tickets-home-action" onClick={onBookRide}>Book a Ride</button>
      </div>
      {deleteError && <p className="purchased-tickets-home-error" role="alert">{deleteError}</p>}
      {loading ? <div className="purchased-tickets-home-empty"><span aria-hidden="true">...</span><div><strong>Loading tickets...</strong><p>Checking your saved bookings.</p></div></div> : history.length === 0 ? <div className="purchased-tickets-home-empty"><span aria-hidden="true">🎟</span><div><strong>No tickets yet</strong><p>Your booked rides will appear here after you complete a purchase.</p></div></div> : <div className="purchased-tickets-home-list">{history.map((ticket) => <article className="purchased-tickets-home-item" key={ticket.token}><div className="purchased-tickets-home-route"><span>{ticket.status}</span><strong>{ticket.route}</strong><small>{ticket.date} · {ticket.time}</small></div><div className="purchased-tickets-home-details"><strong>LKR {ticket.total.toLocaleString()}</strong><span>{ticket.tickets} {ticket.tickets === 1 ? 'ticket' : 'tickets'}</span><small>{ticket.token}</small><button type="button" className="purchased-tickets-home-delete" onClick={() => handleDelete(ticket)} disabled={deletingToken === ticket.token}>{deletingToken === ticket.token ? 'Deleting...' : 'Delete ticket'}</button></div></article>)}</div>}
    </div>
  </section>
}