type WalletTicket = {
  route: string
  tickets: number
  payment: string
  total: number
  token: string
}

type PurchaseHistoryEntry = WalletTicket & {
  date: string
  time: string
  status: string
}

type StudentWalletProps = {
  ticket: WalletTicket
  history: PurchaseHistoryEntry[]
  balance: number
  onClose: () => void
}

export function StudentWallet({ ticket, history, balance, onClose }: StudentWalletProps) {
  return (
    <div className="checkout-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="checkout-modal wallet-modal" role="dialog" aria-modal="true" aria-labelledby="wallet-title">
        <button className="checkout-close" onClick={onClose} aria-label="Close student wallet">×</button>
        <div className="wallet-heading">
          <div className="wallet-icon">◈</div>
          <span className="checkout-eyebrow">Student wallet</span>
          <h2 id="wallet-title">Your ride is in your wallet.</h2>
          <p>Keep this ticket ready when you board your university bus.</p>
        </div>
        <div className="wallet-balance">
          <div>
            <span>Available balance</span>
            <strong>LKR {balance.toLocaleString()}</strong>
          </div>
          <button className="wallet-top-up" type="button">Top Up Wallet</button>
        </div>
        {balance <= 100 && (
          <div className="wallet-low-balance" role="alert">
            <span aria-hidden="true">!</span>
            <p>Your wallet balance is low. Please top up your wallet.</p>
          </div>
        )}
        <div className="wallet-ticket">
          <div>
            <span className="wallet-ticket-label">Active ride ticket</span>
            <strong>{ticket.route}</strong>
          </div>
          <span className="wallet-ticket-status">Ready</span>
          <dl className="booking-summary">
            <div><dt>Booking token</dt><dd>{ticket.token}</dd></div>
            <div><dt>Tickets</dt><dd>{ticket.tickets}</dd></div>
            <div><dt>Paid from</dt><dd>{ticket.payment}</dd></div>
            <div><dt>Total</dt><dd>LKR {ticket.total.toLocaleString()}</dd></div>
          </dl>
        </div>
        <div className="wallet-history">
          <div className="wallet-section-heading">
            <h3>Ride purchase history</h3>
            <span>{history.length} {history.length === 1 ? 'ride' : 'rides'}</span>
          </div>
          <div className="wallet-history-list">
            {history.map((entry) => (
              <div className="wallet-history-item" key={entry.token}>
                <div className="wallet-history-route">
                  <strong>{entry.route}</strong>
                  <span>{entry.date} · {entry.time}</span>
                </div>
                <div className="wallet-history-meta">
                  <strong>LKR {entry.total.toLocaleString()}</strong>
                  <span className="wallet-history-status">{entry.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <button className="checkout-primary" onClick={onClose}>Done</button>
      </section>
    </div>
  )
}
