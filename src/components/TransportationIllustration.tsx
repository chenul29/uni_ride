/**
 * TransportationIllustration Component
 * Minimal, professional transportation-themed SVG illustration with subtle animations
 */

export function TransportationIllustration() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg
        viewBox="0 0 500 400"
        className="w-full h-full max-w-lg"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background gradient definition */}
        <defs>
          <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E0F2FE" />
            <stop offset="100%" stopColor="#F8FAFC" />
          </linearGradient>

          {/* Animation for bus movement */}
          <style>{`
            @keyframes busBounce {
              0%, 100% { transform: translateX(0px) translateY(0px); }
              50% { transform: translateX(20px) translateY(-5px); }
            }
            @keyframes routeAppear {
              from { strokeDashoffset: 200; opacity: 0; }
              to { strokeDashoffset: 0; opacity: 1; }
            }
            @keyframes floatingMarker {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-8px); }
            }
            .bus-animated {
              animation: busBounce 4s ease-in-out infinite;
              transform-origin: center;
            }
            .route-animated {
              animation: routeAppear 2s ease-out forwards;
              stroke-dasharray: 200;
            }
            .marker-animated {
              animation: floatingMarker 3s ease-in-out infinite;
            }
          `}</style>
        </defs>

        {/* Sky background */}
        <rect width="500" height="400" fill="url(#skyGradient)" />

        {/* Road */}
        <rect x="50" y="280" width="400" height="60" rx="8" fill="#E2E8F0" />
        <rect x="50" y="310" width="400" height="8" rx="4" fill="#CBD5E1" strokeDasharray="20,20" stroke="#94A3B8" strokeWidth="2" />

        {/* Route path line with animation */}
        <path
          d="M 150 200 Q 250 160, 350 180 T 420 220"
          stroke="#2563EB"
          strokeWidth="3"
          className="route-animated"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Start location marker */}
        <g className="marker-animated" style={{ animationDelay: '0s' }}>
          <circle cx="150" cy="200" r="12" fill="#10B981" opacity="0.2" />
          <circle cx="150" cy="200" r="8" fill="#10B981" />
          <circle cx="150" cy="200" r="4" fill="white" />
        </g>

        {/* End/University location marker */}
        <g className="marker-animated" style={{ animationDelay: '0.5s' }}>
          <circle cx="420" cy="220" r="12" fill="#F59E0B" opacity="0.2" />
          <circle cx="420" cy="220" r="8" fill="#F59E0B" />
          <circle cx="420" cy="220" r="4" fill="white" />
        </g>

        {/* University icon at end location */}
        <g transform="translate(420, 160)">
          {/* Building shape */}
          <rect x="-15" y="-15" width="30" height="35" rx="2" fill="none" stroke="#1E3A8A" strokeWidth="2" />
          {/* Windows */}
          <rect x="-10" y="-10" width="6" height="6" fill="#1E3A8A" />
          <rect x="4" y="-10" width="6" height="6" fill="#1E3A8A" />
          <rect x="-10" y="-1" width="6" height="6" fill="#1E3A8A" />
          <rect x="4" y="-1" width="6" height="6" fill="#1E3A8A" />
          {/* Flag/roof */}
          <path d="M -12 -18 L 0 -25 L 12 -18" fill="#2563EB" />
        </g>

        {/* Bus with animation */}
        <g className="bus-animated">
          {/* Bus body */}
          <rect x="220" y="270" width="60" height="35" rx="4" fill="#2563EB" />

          {/* Bus cabin */}
          <rect x="220" y="270" width="18" height="20" rx="2" fill="#1E3A8A" />

          {/* Bus windows */}
          <rect x="228" y="275" width="8" height="6" rx="1" fill="#E0F2FE" />
          <rect x="244" y="275" width="12" height="8" rx="1" fill="#E0F2FE" />
          <rect x="260" y="275" width="10" height="8" rx="1" fill="#E0F2FE" />

          {/* Bus door */}
          <line x1="240" y1="270" x2="240" y2="305" stroke="#1E3A8A" strokeWidth="1.5" />

          {/* Wheels */}
          <circle cx="235" cy="310" r="6" fill="#1E293B" />
          <circle cx="235" cy="310" r="3.5" fill="#94A3B8" />

          <circle cx="265" cy="310" r="6" fill="#1E293B" />
          <circle cx="265" cy="310" r="3.5" fill="#94A3B8" />

          {/* Bus light accent */}
          <circle cx="280" cy="280" r="3" fill="#F59E0B" />
        </g>

        {/* Passenger icon at starting point */}
        <g transform="translate(120, 240)">
          {/* Head */}
          <circle cx="0" cy="-8" r="4" fill="#1E293B" />
          {/* Body */}
          <rect x="-3" y="-2" width="6" height="8" rx="2" fill="#2563EB" />
          {/* Legs */}
          <line x1="-2" y1="6" x2="-2" y2="12" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
          <line x1="2" y1="6" x2="2" y2="12" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* Arrow showing direction */}
        <g transform="translate(380, 110)" className="marker-animated" style={{ animationDelay: '1s' }}>
          <path
            d="M 0 0 L -8 -6 L -2 0 L -8 6 Z"
            fill="#F59E0B"
            opacity="0.7"
          />
        </g>
      </svg>
    </div>
  )
}
