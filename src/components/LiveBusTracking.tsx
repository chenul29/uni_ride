import { useEffect, useState } from 'react'
import { mockLiveBus, mockStudentLocation, specialEventSchedules, type LiveBus, type StudentLocation } from '../lib/liveBus'

function BusMarker({ className = '' }: { className?: string }) {
  return <span className={`bus-marker ${className}`} aria-hidden="true">🚌</span>
}

function projectStudentLocation(location: StudentLocation) {
  // Project GPS coordinates into the illustrated campus map bounds.
  const x = ((location.longitude - 80.625) / (80.645 - 80.625)) * 100
  const y = (1 - (location.latitude - 7.275) / (7.305 - 7.275)) * 100
  return { x: Math.max(8, Math.min(92, x)), y: Math.max(12, Math.min(88, y)) }
}

export function LiveBusTracking() {
  const [bus, setBus] = useState<LiveBus>(mockLiveBus)
  const [studentLocation, setStudentLocation] = useState(() => ({
    ...projectStudentLocation(mockStudentLocation),
    status: 'requesting' as 'requesting' | 'live' | 'denied' | 'unavailable',
    accuracy: mockStudentLocation.accuracy,
  }))

  const requestStudentLocation = () => {
    if (!navigator.geolocation) {
      setStudentLocation((current) => ({ ...current, status: 'unavailable' }))
      return
    }

    setStudentLocation((current) => ({ ...current, status: 'requesting' }))
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        }
        setStudentLocation({ ...projectStudentLocation(location), status: 'live', accuracy: location.accuracy })
      },
      () => setStudentLocation((current) => ({ ...current, status: 'denied' })),
      { enableHighAccuracy: true, maximumAge: 15_000, timeout: 10_000 },
    )
  }

  useEffect(() => {
    requestStudentLocation()
    // Replace this interval with a Firebase subscription when GPS data is available.
    const refresh = window.setInterval(() => {
      setBus((current) => ({ ...current, status: 'On route' }))
    }, 30_000)
    return () => window.clearInterval(refresh)
  }, [])

  const locationMessage = studentLocation.status === 'live'
    ? `Your location · ±${Math.round(studentLocation.accuracy)}m accuracy`
    : studentLocation.status === 'requesting'
      ? 'Requesting your location...'
      : 'Location permission is needed to show you here'

  return (
    <div className="tracking-shell">
      <header className="tracking-header">
        <a className="tracking-back" href="/" aria-label="Back to UniRide home">←</a>
        <div className="tracking-brand">
          <span className="tracking-brand-mark">U</span>
          <span><strong>UniRide</strong><small>Live bus tracking</small></span>
        </div>
        <span className="tracking-live-pill"><i /> Live now</span>
      </header>

      <main className="tracking-content">
        <section className="tracking-intro">
          <div>
            <p className="tracking-kicker">Your ride, in motion</p>
            <h1>Live Bus Tracking</h1>
            <p>Follow your university bus and see the next stop in real time.</p>
          </div>
          <div className="tracking-updated"><span className="tracking-pulse" /> Updated just now</div>
        </section>

        <section className="tracking-layout">
          <div className="tracking-map-panel">
            <div className="tracking-map-toolbar">
              <div><strong>{bus.routeName}</strong><span>Route 04 · Weekday service</span></div>
              <button type="button" className="tracking-locate-button" aria-label="Center map on bus">⌖</button>
            </div>
            <div className="tracking-map" aria-label="Map showing your GPS location, the Kandy City Loop bus, and bus stops">
              <div className="map-road road-one" /><div className="map-road road-two" /><div className="map-road road-three" />
              <div className="map-block block-one" /><div className="map-block block-two" /><div className="map-block block-three" />
              <svg className="route-line" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                <path d="M 15 72 L 32 54 L 65 44 L 84 22" />
              </svg>
              {bus.stops.map((stop) => (
                <div
                  className={`stop-marker ${stop.passed ? 'stop-passed' : ''}`}
                  key={stop.name}
                  style={{ left: `${stop.x}%`, top: `${stop.y}%` }}
                  title={stop.name}
                >
                  <span />
                </div>
              ))}
              <div className="bus-location" style={{ left: `${bus.x}%`, top: `${bus.y}%` }}>
                <span className="bus-location-ring" /><BusMarker />
              </div>
              <div className="student-location" style={{ left: `${studentLocation.x}%`, top: `${studentLocation.y}%` }} title={locationMessage}>
                <span className="student-location-ring" /><span className="student-location-marker" aria-hidden="true">📍</span>
              </div>
              <div className="map-label label-city">Kandy City</div>
              <div className="map-label label-campus">Campus</div>
            </div>
            <div className="map-legend"><span><i className="legend-student" /> Your location</span><span><i className="legend-bus" /> Bus location</span><span><i className="legend-stop" /> Stop</span><span><i className="legend-passed" /> Passed</span></div>
          </div>

          <aside className="tracking-sidebar">
            <div className={`location-permission-card location-${studentLocation.status}`}>
              <div><span className="permission-pin">📍</span><div><strong>{studentLocation.status === 'live' ? 'Your location is live' : 'Show your location'}</strong><small>{locationMessage}</small></div></div>
              {studentLocation.status !== 'live' && <button type="button" onClick={requestStudentLocation}>{studentLocation.status === 'requesting' ? 'Waiting...' : 'Allow location'}</button>}
            </div>
            <div className="bus-status-card">
              <div className="bus-status-heading"><div><span className="status-dot" /> {bus.status}</div><span className="bus-id">{bus.id}</span></div>
              <div className="bus-summary"><BusMarker /><div><strong>{bus.routeName}</strong><span>Heading to North Campus</span></div></div>
              <div className="eta-row"><div><small>Next stop</small><strong>{bus.nextStop}</strong></div><div className="eta-value"><small>Arrives in</small><strong>{bus.eta}</strong></div></div>
              <div className="progress-track"><span style={{ width: `${bus.progress}%` }} /></div>
              <a className="driver-contact" href={`tel:${bus.driverPhone}`}><span>☎</span><span><small>Driver contact</small><strong>{bus.driverPhone}</strong></span></a>
              <a className="support-contact" href={`tel:${bus.supportPhone}`}><span>24/7</span><span><small>Student support</small><strong>{bus.supportPhone}</strong></span></a>
              <p className="tracking-note">GPS location refreshes automatically</p>
            </div>
            <div className="event-schedules-card">
              <div className="event-schedules-heading"><div><span className="tracking-kicker">Plan ahead</span><h2>Special campus events</h2></div><span className="event-calendar-icon">▦</span></div>
              <div className="event-schedule-list">
                {specialEventSchedules.map((schedule) => (
                  <article className="event-schedule" key={schedule.event}>
                    <div className="event-schedule-top"><strong>{schedule.event}</strong><span>{schedule.date}</span></div>
                    <p>{schedule.route}</p>
                    <div className="event-schedule-times"><span>Departures</span><b>{schedule.times}</b></div>
                    <small>{schedule.note}</small>
                  </article>
                ))}
              </div>
            </div>
            <a className="tracking-home-link" href="/">Back to UniRide home <span>→</span></a>
          </aside>
        </section>
      </main>
    </div>
  )
}

export function LiveBusLauncher() {
  return <a className="live-bus-launcher" href="/tracking" aria-label="Open Live Bus Tracking"><span className="live-bus-emoji">🚌</span><span className="live-bus-badge">LIVE</span><span className="live-bus-tooltip">Live Bus Tracking</span></a>
}
