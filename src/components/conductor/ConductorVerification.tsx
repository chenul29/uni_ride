import { FormEvent, useEffect, useRef, useState } from 'react'
import { AdminIcon } from '../admin/AdminIcon'
import { Html5Qrcode } from 'html5-qrcode'

type VerificationState = 'idle' | 'valid' | 'invalid'
type CameraStatus = 'closed' | 'starting' | 'scanning' | 'error'

type BarcodeDetectorLike = {
  detect: (source: HTMLVideoElement) => Promise<Array<{ rawValue?: string }>>
}

type BarcodeDetectorConstructor = new (options?: { formats: string[] }) => BarcodeDetectorLike

function getBarcodeDetector() {
  const detectorWindow = window as Window & { BarcodeDetector?: BarcodeDetectorConstructor }
  return detectorWindow.BarcodeDetector ? new detectorWindow.BarcodeDetector({ formats: ['qr_code'] }) : null
}

function extractTicketId(value: string) {
  return value.match(/UR\d+/i)?.[0]?.toUpperCase() ?? value.trim().toUpperCase()
}

const recentVerifications = [
  { id: 'UR10284', student: 'Nethmi Perera', route: 'Kandy - Malabe', time: '2 min ago', status: 'Valid' },
  { id: 'UR10281', student: 'Kavindu Silva', route: 'Kandy - Colombo', time: '8 min ago', status: 'Valid' },
  { id: 'UR10276', student: 'Dineth Kausalya', route: 'Kandy - Malabe', time: '15 min ago', status: 'Already used' },
]

export function ConductorVerification() {
  const [ticketId, setTicketId] = useState('')
  const [verificationState, setVerificationState] = useState<VerificationState>('idle')
  const [cameraOpen, setCameraOpen] = useState(false)
  const [cameraStatus, setCameraStatus] = useState<CameraStatus>('closed')
  const [cameraMessage, setCameraMessage] = useState('')
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  function verifyTicket(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const normalizedTicketId = extractTicketId(ticketId)
    setTicketId(normalizedTicketId)
    setVerificationState(normalizedTicketId === 'UR10284' ? 'valid' : 'invalid')
  }

  useEffect(() => {
    if (!cameraOpen) return

    let animationFrame = 0
    let scanning = false
    let cancelled = false

    async function startCamera() {
      const detector = getBarcodeDetector()
      if (!detector) {
        setCameraStatus('error')
        setCameraMessage('QR scanning is not supported in this browser. Use the ticket ID field below.')
        return
      }

      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraStatus('error')
        setCameraMessage('Camera access is unavailable. Use the ticket ID field below.')
        return
      }

      try {
        setCameraStatus('starting')
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false })
        if (cancelled || !videoRef.current) {
          stream.getTracks().forEach((track) => track.stop())
          return
        }
        streamRef.current = stream
        videoRef.current.srcObject = stream
        await videoRef.current.play()
        setCameraStatus('scanning')

        const scan = async () => {
          if (cancelled) return
          if (!scanning && videoRef.current && videoRef.current.readyState >= 2) {
            scanning = true
            try {
              const results = await detector.detect(videoRef.current)
              const rawValue = results[0]?.rawValue
              if (rawValue) {
                const decodedTicketId = extractTicketId(rawValue)
                setTicketId(decodedTicketId)
                setVerificationState(decodedTicketId === 'UR10284' ? 'valid' : 'invalid')
                setCameraOpen(false)
              }
            } catch {
              setCameraStatus('error')
              setCameraMessage('We could not read that QR code. Try again or enter the ticket ID manually.')
            } finally {
              scanning = false
            }
          }
          if (!cancelled) animationFrame = requestAnimationFrame(scan)
        }
        animationFrame = requestAnimationFrame(scan)
      } catch {
        setCameraStatus('error')
        setCameraMessage('Camera permission was not granted. Use the ticket ID field below.')
      }
    }

    void startCamera()
    return () => {
      cancelled = true
      cancelAnimationFrame(animationFrame)
      streamRef.current?.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
  }, [cameraOpen])

  function closeCamera() {
    setCameraOpen(false)
    setCameraStatus('closed')
    setCameraMessage('')
  }

  function resetVerification() {
    setTicketId('')
    setVerificationState('idle')
  }

  return <div className="conductor-shell">
    <header className="conductor-topbar">
      <div className="conductor-brand"><div className="brand-mark">U</div><div><strong>UniRide</strong><span>Conductor Portal</span></div></div>
      <div className="conductor-profile"><div className="admin-avatar">CW</div><div><strong>Chamara Wijesinghe</strong><small>Conductor</small></div><button aria-label="Open profile menu"><AdminIcon name="chevron" size={16} /></button></div>
    </header>

    <main className="conductor-content">
      <div className="conductor-heading"><div><span className="eyebrow">Today&apos;s service</span><h1>Verify a ticket</h1><p>Check a student ticket before they board.</p></div><span className="service-status"><i /> On duty</span></div>

      <section className="verification-card" aria-labelledby="verification-title">
        <div className="verification-card-heading"><span className="verification-icon"><AdminIcon name="ticket" size={22} /></span><div><h2 id="verification-title">Ticket verification</h2><p>Enter the ticket ID shown on the student&apos;s phone.</p></div></div>
        <div className="verification-modes"><span>Choose a verification method</span><button type="button" className={!cameraOpen ? 'mode-button mode-button-active' : 'mode-button'} onClick={closeCamera}><AdminIcon name="ticket" size={15} /> Enter ID</button><button type="button" className={cameraOpen ? 'mode-button mode-button-active' : 'mode-button'} onClick={() => { setCameraOpen(true); setCameraMessage('') }}><AdminIcon name="activity" size={15} /> Scan QR code</button></div>
        {cameraOpen && <div className="camera-scanner"><video ref={videoRef} autoPlay muted playsInline aria-label="Camera preview for scanning a ticket QR code" /><div className="camera-frame" aria-hidden="true" /><div className="camera-scanner-footer">{cameraStatus === 'starting' ? 'Starting camera...' : cameraStatus === 'scanning' ? 'Point the camera at the student ticket QR code.' : cameraMessage}<button type="button" onClick={closeCamera}>Close camera</button></div></div>}
        {cameraStatus === 'error' && !cameraOpen && <p className="camera-error" role="status">{cameraMessage}</p>}
        <form onSubmit={verifyTicket} className="ticket-form">
          <label htmlFor="ticket-id">Ticket ID</label>
          <div className="ticket-input-row"><input id="ticket-id" value={ticketId} onChange={(event) => { setTicketId(event.target.value); setVerificationState('idle') }} placeholder="e.g. UR10284" autoComplete="off" /><button type="submit"><AdminIcon name="check" size={17} /> Verify ticket</button></div>
        </form>

        {verificationState === 'idle' && <div className="scan-hint"><span><AdminIcon name="activity" size={17} /></span><p>Ask the student to show their ticket ID clearly.</p></div>}
        {verificationState === 'valid' && <div className="ticket-result ticket-result-valid" role="status"><span className="result-icon"><AdminIcon name="check" size={22} /></span><div><strong>Ticket is valid</strong><p>UR10284 · Nethmi Perera</p><small>Kandy - Malabe · Valid for today</small></div><button onClick={resetVerification}>Verify another</button></div>}
        {verificationState === 'invalid' && <div className="ticket-result ticket-result-invalid" role="alert"><span className="result-icon"><AdminIcon name="alert" size={22} /></span><div><strong>Ticket could not be verified</strong><p>Check the ID and try again.</p></div><button onClick={resetVerification}>Try again</button></div>}
      </section>

      <section className="conductor-stats" aria-label="Today&apos;s verification summary"><div><span className="stat-icon stat-icon-blue"><AdminIcon name="check" size={16} /></span><strong>42</strong><small>Verified today</small></div><div><span className="stat-icon stat-icon-amber"><AdminIcon name="clock" size={16} /></span><strong>6</strong><small>Rides remaining</small></div><div><span className="stat-icon stat-icon-slate"><AdminIcon name="ticket" size={16} /></span><strong>8:30 AM</strong><small>Next departure</small></div></section>

      <section className="recent-verifications"><div className="section-heading"><div><h2>Recent verifications</h2><p>Your latest ticket checks</p></div><button>View all <span aria-hidden="true">-&gt;</span></button></div><div className="verification-list">{recentVerifications.map((verification) => <div className="verification-row" key={verification.id}><span className="row-ticket"><AdminIcon name="ticket" size={16} /></span><div className="row-details"><strong>{verification.id}</strong><span>{verification.student} · {verification.route}</span></div><div className="row-meta"><strong className={verification.status === 'Valid' ? 'status-valid' : 'status-used'}>{verification.status}</strong><small>{verification.time}</small></div></div>)}</div></section>
    </main>
  </div>
}