import { useEffect, useRef, useState } from 'react'

type VerificationResult = 'valid' | 'invalid' | null

const DEMO_FACILITY_CODE = '482916'

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
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [cameraOpen, setCameraOpen] = useState(false)
  const [cameraMessage, setCameraMessage] = useState('Camera is ready when you are.')
  const [ticketScanned, setTicketScanned] = useState(false)
  const [facilityCode, setFacilityCode] = useState('')
  const [result, setResult] = useState<VerificationResult>(null)

  useEffect(() => () => streamRef.current?.getTracks().forEach((track) => track.stop()), [])

  useEffect(() => {
    if (cameraOpen && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current
    }
  }, [cameraOpen])

  const openCamera = async () => {
    setResult(null)
    setCameraMessage('Requesting camera access...')
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraOpen(true)
      setCameraMessage('Camera access is unavailable here. Use the demo scan below.')
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      streamRef.current = stream
      setCameraOpen(true)
      setCameraMessage('Point the camera at the student ticket QR code.')
    } catch {
      setCameraOpen(true)
      setCameraMessage('Camera permission was not granted. Use the demo scan below.')
    }
  }

  const closeCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    setCameraOpen(false)
  }

  const markQrScanned = () => {
    setTicketScanned(true)
    setCameraMessage('Ticket QR captured. Enter the facility code to continue.')
    closeCamera()
  }

  const verifyTicket = (event: React.FormEvent) => {
    event.preventDefault()
    setResult(facilityCode === DEMO_FACILITY_CODE ? 'valid' : 'invalid')
  }

  const reset = () => {
    setTicketScanned(false)
    setFacilityCode('')
    setResult(null)
    setCameraMessage('Camera is ready when you are.')
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8"><a href="/" className="flex items-center gap-3" aria-label="Return to UniRide home"><span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-900 text-lg font-extrabold text-white">U</span><span><strong className="block text-lg leading-none text-blue-700">UniRide</strong><small className="text-[11px] text-slate-500">Conductor portal</small></span></a><div className="hidden items-center gap-2 text-right sm:flex"><span className="h-2 w-2 rounded-full bg-emerald-500" /><span className="text-xs font-semibold text-slate-600">On duty</span></div></div></header>
      <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
        <div className="mb-8 max-w-xl"><p className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-blue-600">Ride operations / Ticket desk</p><h1 className="text-3xl font-extrabold tracking-tight text-blue-950 sm:text-4xl">Verify a student ticket</h1><p className="mt-3 text-sm leading-6 text-slate-500">Scan the ticket QR code, then enter the facility code printed on the conductor device.</p></div>
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"><div className="mb-6 flex items-start justify-between gap-4"><div><span className="mb-2 grid h-8 w-8 place-items-center rounded-lg bg-blue-50 text-sm font-extrabold text-blue-700">01</span><h2 className="mt-3 text-xl font-bold text-blue-950">Scan ticket QR</h2><p className="mt-1 text-sm text-slate-500">Open the camera and centre the code in the frame.</p></div><span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-700">Required</span></div>
            {cameraOpen ? <div className="relative mx-auto max-w-[300px] overflow-hidden rounded-2xl bg-slate-900"><video ref={videoRef} autoPlay muted playsInline className="aspect-square w-full object-cover" /><div className="pointer-events-none absolute inset-7 rounded-xl border border-white/40" /><span className="absolute left-7 top-7 h-8 w-8 border-l-2 border-t-2 border-amber-400" /><span className="absolute right-7 top-7 h-8 w-8 border-r-2 border-t-2 border-amber-400" /><span className="absolute bottom-7 left-7 h-8 w-8 border-b-2 border-l-2 border-amber-400" /><span className="absolute bottom-7 right-7 h-8 w-8 border-b-2 border-r-2 border-amber-400" /></div> : <QrFrame />}
            <p className="mt-4 text-center text-xs text-slate-500" role="status">{cameraMessage}</p><div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
              {!cameraOpen && !ticketScanned && <button type="button" onClick={openCamera} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-800"><svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8.5A1.5 1.5 0 014.5 7h2l1-1.5h5L13.5 7h2A1.5 1.5 0 0117 8.5v8A1.5 1.5 0 0115.5 18h-11A1.5 1.5 0 013 16.5v-8zM8 12.5a3 3 0 106 0 3 3 0 00-6 0z" /></svg>Open camera</button>}
              {cameraOpen && <><button type="button" onClick={markQrScanned} className="min-h-12 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white transition hover:bg-blue-800">Confirm QR scan</button><button type="button" onClick={closeCamera} className="min-h-12 rounded-xl border border-slate-200 px-5 text-sm font-bold text-slate-600 transition hover:bg-slate-50">Close camera</button></>}
              {!ticketScanned && <button type="button" onClick={markQrScanned} className="min-h-12 rounded-xl border border-blue-200 px-5 text-sm font-bold text-blue-700 transition hover:bg-blue-50">Use demo QR</button>}
            </div>{ticketScanned && <div className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700"><span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-500 text-xs text-white">✓</span> Ticket QR scanned successfully</div>}
          </section>
          <section className={`rounded-2xl border p-5 shadow-sm sm:p-7 ${ticketScanned ? 'border-slate-200 bg-white' : 'border-slate-200 bg-slate-100/70'}`}><div className="mb-6"><span className="mb-2 grid h-8 w-8 place-items-center rounded-lg bg-amber-50 text-sm font-extrabold text-amber-700">02</span><h2 className="mt-3 text-xl font-bold text-blue-950">Enter facility code</h2><p className="mt-1 text-sm text-slate-500">Use the six-digit code for this conductor facility.</p></div><form onSubmit={verifyTicket}><label htmlFor="facility-code" className="text-xs font-bold uppercase tracking-wider text-slate-600">6-digit facility code</label><input id="facility-code" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} required disabled={!ticketScanned} value={facilityCode} onChange={(event) => { setFacilityCode(event.target.value.replace(/\D/g, '')); setResult(null) }} placeholder="000000" className="mt-2 block min-h-14 w-full rounded-xl border border-slate-200 bg-white px-4 text-center text-2xl font-extrabold tracking-[0.35em] text-blue-950 outline-none transition placeholder:text-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100" /><button type="submit" disabled={!ticketScanned || facilityCode.length !== 6} className="mt-5 min-h-12 w-full rounded-xl bg-amber-400 px-5 text-sm font-extrabold text-blue-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-50">Verify ticket</button></form>{!ticketScanned && <p className="mt-5 text-center text-xs text-slate-400">Complete the QR scan to unlock this step.</p>}{result && <div className={`mt-6 rounded-2xl border p-5 ${result === 'valid' ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'}`} role="alert"><div className="flex items-start gap-3"><span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-lg font-bold text-white ${result === 'valid' ? 'bg-emerald-500' : 'bg-red-500'}`}>{result === 'valid' ? '✓' : '!'}</span><div><h3 className={`font-extrabold ${result === 'valid' ? 'text-emerald-800' : 'text-red-800'}`}>{result === 'valid' ? 'Ticket is valid' : 'Ticket is not valid'}</h3><p className={`mt-1 text-xs leading-5 ${result === 'valid' ? 'text-emerald-700' : 'text-red-700'}`}>{result === 'valid' ? 'This ticket is cleared for boarding. Have a safe ride.' : 'The facility code does not match. Check the code and try again.'}</p></div></div><button type="button" onClick={reset} className="mt-4 text-xs font-bold text-slate-600 underline underline-offset-4">Start another verification</button></div>}</section>
        </div><p className="mt-8 text-center text-xs text-slate-400">Frontend demo mode · Verification results will connect to the ticket service later.</p>
      </main>
    </div>
  )
}