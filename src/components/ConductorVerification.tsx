import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { getTicketTokenFromQr } from '../lib/ticket'
import { supabase } from '../lib/supabase'

type VerificationResult = 'valid' | 'invalid' | null

type PurchasedTicketRow = {
  booking_token: string
  route: string
  tickets: number
  payment_method: string
  amount: number
  status: string
}

function QrFrame() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[238px] overflow-hidden rounded-2xl bg-slate-900 shadow-inner">
      <div className="absolute inset-7 rounded-xl border border-white/20" />
      <span className="absolute left-7 top-7 h-9 w-9 border-l-2 border-t-2 border-amber-400" />
      <span className="absolute right-7 top-7 h-9 w-9 border-r-2 border-t-2 border-amber-400" />
      <span className="absolute bottom-7 left-7 h-9 w-9 border-b-2 border-l-2 border-amber-400" />
      <span className="absolute bottom-7 right-7 h-9 w-9 border-b-2 border-r-2 border-amber-400" />
      <div className="absolute left-10 right-10 top-1/2 h-px bg-amber-400 shadow-[0_0_12px_2px_rgba(245,158,11,0.75)]" />
      <div className="absolute inset-0 grid place-items-center text-white/70">
        <svg aria-hidden="true" className="h-14 w-14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4h5v5H4zM15 4h5v5h-5zM4 15h5v5H4zM15 15h2m3 0v5h-5m0-5h2m3 0v2" /></svg>
      </div>
    </div>
  )
}

export function ConductorVerification() {
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const [cameraOpen, setCameraOpen] = useState(false)
  const [cameraMessage, setCameraMessage] = useState('Camera is ready when you are.')
  const [ticketScanned, setTicketScanned] = useState(false)
  const [ticketQrValid, setTicketQrValid] = useState(false)
  const [result, setResult] = useState<VerificationResult>(null)
  const [verificationError, setVerificationError] = useState('')
  const [verifying, setVerifying] = useState(false)

  const verifyTicket = async (scannedToken: string) => {
    setVerificationError('')
    if (!supabase) {
      setVerificationError('Ticket verification is unavailable because Supabase is not configured.')
      setResult('invalid')
      return
    }

    setVerifying(true)
    try {
      const { data: ticket, error: ticketError } = await supabase
        .from('wallet_transactions')
        .select('booking_token, route, tickets, payment_method, amount, status')
        .eq('booking_token', scannedToken)
        .eq('status', 'completed')
        .maybeSingle()

      if (ticketError) throw ticketError
      if (!ticket) {
        throw new Error('This ticket could not be found or is not completed.')
      }

      const purchasedTicket = ticket as PurchasedTicketRow
      const { data: previousVerification, error: previousVerificationError } = await supabase
        .from('ticket_verifications')
        .select('id')
        .eq('booking_token', purchasedTicket.booking_token)
        .maybeSingle()

      if (previousVerificationError) throw previousVerificationError
      if (previousVerification) {
        throw new Error('This ticket has already been verified.')
      }

      const { error: saveError } = await supabase.from('ticket_verifications').insert({
        booking_token: purchasedTicket.booking_token,
        ticket_number: purchasedTicket.booking_token.replace(/^UR/, ''),
        route: purchasedTicket.route,
        tickets: purchasedTicket.tickets,
        payment_method: purchasedTicket.payment_method,
        amount: purchasedTicket.amount,
        facility_code: 'CONDUCTOR_SCAN',
      })

      if (saveError) throw saveError
      setResult('valid')
    } catch (error) {
      setResult('invalid')
      setVerificationError(error instanceof Error ? error.message : 'The ticket could not be verified and saved.')
    } finally {
      setVerifying(false)
    }
  }

  useEffect(() => {
    if (!cameraOpen) return

    const scanner = new Html5Qrcode('qr-reader')
    scannerRef.current = scanner
    setCameraMessage('Point the camera at the student ticket QR code.')

    scanner.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: { width: 220, height: 220 }, aspectRatio: 1 },
      (decodedText) => {
        const ticketToken = getTicketTokenFromQr(decodedText)
        setTicketScanned(true)
        setTicketQrValid(Boolean(ticketToken))
        setCameraMessage(ticketToken
          ? `Ticket QR captured: ${ticketToken}. Verifying ticket...`
          : 'This is not a valid UniRide ticket QR code.')
        if (ticketToken) {
          void verifyTicket(ticketToken)
        } else {
          setResult('invalid')
        }
        scanner.stop().catch(() => undefined)
        scanner.clear()
        scannerRef.current = null
        setCameraOpen(false)
      },
      () => undefined,
    ).catch(() => {
      setCameraMessage('Camera permission was not granted. Use the demo scan below.')
    })

    return () => {
      scanner.stop().catch(() => undefined)
      scanner.clear()
      scannerRef.current = null
    }
  }, [cameraOpen])

  const openCamera = async () => {
    setResult(null)
    setCameraMessage('Requesting camera access...')
    setCameraOpen(true)
  }

  const closeCamera = () => {
    scannerRef.current?.stop().catch(() => undefined)
    setCameraOpen(false)
  }

  const markQrScanned = () => {
    setTicketScanned(true)
    setTicketQrValid(true)
    setCameraMessage('Ticket QR captured. Verifying ticket...')
    closeCamera()
    void verifyTicket('DEMO')
  }

  const reset = () => {
    setTicketScanned(false)
    setTicketQrValid(false)
    setResult(null)
    setVerificationError('')
    setVerifying(false)
    setCameraMessage('Camera is ready when you are.')
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8"><a href="/" className="flex items-center gap-3" aria-label="Return to UniRide home"><span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-900 text-lg font-extrabold text-white">U</span><span><strong className="block text-lg leading-none text-blue-700">UniRide</strong><small className="text-[11px] text-slate-500">Conductor portal</small></span></a><div className="hidden items-center gap-2 text-right sm:flex"><span className="h-2 w-2 rounded-full bg-emerald-500" /><span className="text-xs font-semibold text-slate-600">On duty</span></div></div></header>
      <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
        <div className="mb-8 max-w-xl"><p className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-blue-600">Ride operations / Ticket desk</p><h1 className="text-3xl font-extrabold tracking-tight text-blue-950 sm:text-4xl">Verify a student ticket</h1><p className="mt-3 text-sm leading-6 text-slate-500">Scan the ticket QR code once to verify it.</p></div>
        <div className="max-w-xl">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"><div className="mb-6 flex items-start justify-between gap-4"><div><span className="mb-2 grid h-8 w-8 place-items-center rounded-lg bg-blue-50 text-sm font-extrabold text-blue-700">01</span><h2 className="mt-3 text-xl font-bold text-blue-950">Scan ticket QR</h2><p className="mt-1 text-sm text-slate-500">Open the camera and centre the code in the frame.</p></div><span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-700">Required</span></div>
            {cameraOpen ? <div id="qr-reader" className="relative mx-auto min-h-[300px] max-w-[300px] overflow-hidden rounded-2xl bg-slate-900" /> : <QrFrame />}
            <p className="mt-4 text-center text-xs text-slate-500" role="status">{cameraMessage}</p><div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
              {!cameraOpen && !ticketScanned && <button type="button" onClick={openCamera} disabled={verifying} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"><svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8.5A1.5 1.5 0 014.5 7h2l1-1.5h5L13.5 7h2A1.5 1.5 0 0117 8.5v8A1.5 1.5 0 0115.5 18h-11A1.5 1.5 0 013 16.5v-8zM8 12.5a3 3 0 106 0 3 3 0 00-6 0z" /></svg>Open camera</button>}
              {cameraOpen && <button type="button" onClick={closeCamera} className="min-h-12 rounded-xl border border-slate-200 px-5 text-sm font-bold text-slate-600 transition hover:bg-slate-50">Close camera</button>}
              {!ticketScanned && <button type="button" onClick={markQrScanned} disabled={verifying} className="min-h-12 rounded-xl border border-blue-200 px-5 text-sm font-bold text-blue-700 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50">Use demo QR</button>}
            </div>{ticketScanned && <div className={`mt-5 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold ${ticketQrValid ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}><span className={`grid h-5 w-5 place-items-center rounded-full text-xs text-white ${ticketQrValid ? 'bg-emerald-500' : 'bg-red-500'}`}>{ticketQrValid ? '✓' : '!'}</span>{ticketQrValid ? 'Valid ticket QR scanned' : 'Invalid ticket QR code'}</div>}
          </section>
        </div><p className="mt-8 text-center text-xs text-slate-400">Scan once to verify each ticket.</p>
      </main>
      {result && <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 px-5" role="dialog" aria-modal="true" aria-labelledby="verification-result-title"><div className={`w-full max-w-sm rounded-2xl border bg-white p-6 text-center shadow-2xl ${result === 'valid' ? 'border-emerald-200' : 'border-red-200'}`}><span className={`mx-auto grid h-14 w-14 place-items-center rounded-full text-3xl font-bold text-white ${result === 'valid' ? 'bg-emerald-500' : 'bg-red-500'}`}>{result === 'valid' ? '✓' : '!'}</span><h2 id="verification-result-title" className={`mt-4 text-xl font-extrabold ${result === 'valid' ? 'text-emerald-800' : 'text-red-800'}`}>{result === 'valid' ? 'Valid ticket' : 'Ticket not valid'}</h2><p className={`mt-2 text-sm ${result === 'valid' ? 'text-emerald-700' : 'text-red-700'}`}>{result === 'valid' ? 'This ticket has been verified successfully.' : verificationError || 'The QR code or ticket record is not valid.'}</p><button type="button" onClick={reset} className="mt-6 min-h-11 w-full rounded-xl bg-blue-600 px-5 text-sm font-bold text-white transition hover:bg-blue-800">Scan another ticket</button></div></div>}
    </div>
  )
}