import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { ticketNumberFromToken } from '../lib/ticket'

type TicketQrCodeProps = {
  token: string
}

export function TicketQrCode({ token }: TicketQrCodeProps) {
  const [source, setSource] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setSource('')
    setError('')

    QRCode.toDataURL(ticketNumberFromToken(token), {
      errorCorrectionLevel: 'M',
      margin: 2,
      width: 180,
    }).then((dataUrl) => {
      if (active) setSource(dataUrl)
    }).catch(() => {
      if (active) setError('The ticket QR code could not be generated.')
    })

    return () => { active = false }
  }, [token])

  if (error) return <p className="database-status database-status-error" role="alert">{error}</p>
  if (!source) return <div className="ticket-qr-loading" aria-label="Generating ticket QR code">Generating QR code...</div>

  return (
    <div className="ticket-qr">
      <img src={source} alt={`QR code for ticket ${token}`} />
      <span>Scan this code when boarding</span>
    </div>
  )
}
