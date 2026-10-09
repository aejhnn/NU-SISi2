// Vector stand-ins for the NU seal and the THE Sustainability Impact Network badge.
const SEAL_POINTS = Array.from({ length: 24 }, (_, i) => {
  const radius = i % 2 ? 26.5 : 30;
  const angle = (Math.PI * i) / 12;
  return `${(30 + radius * Math.sin(angle)).toFixed(2)},${(30 - radius * Math.cos(angle)).toFixed(2)}`;
}).join(" ");

const RING_COLORS = ["#e3342f", "#f6993f", "#ffd43b", "#38c172", "#16a3c4", "#3f6fd8"];
const RING_RADIUS = 15;
const RING_SEGMENT = (2 * Math.PI * RING_RADIUS) / RING_COLORS.length;

function NuSeal({ className }) {
  return (
    <svg viewBox="0 0 60 60" role="img" aria-label="National University seal" className={className}>
      <polygon points={SEAL_POINTS} fill="#1b2142" stroke="#d6b25c" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="30" cy="30" r="21" fill="none" stroke="#d6b25c" strokeOpacity="0.6" strokeWidth="0.7" />
      <rect x="23" y="23" width="14" height="14" rx="2" fill="#e8b84a" />
      <path d="M30 25.5v9M25.5 30h9M26.8 26.8l6.4 6.4M33.2 26.8l-6.4 6.4" stroke="#7a4b0c" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M20 16.5h20M22 44h16M20.5 47.5h19" stroke="#d6b25c" strokeOpacity="0.7" strokeWidth="1.4" strokeDasharray="2 1.2" />
    </svg>
  );
}

function ImpactNetworkTile({ className }) {
  return (
    <svg viewBox="0 0 60 60" aria-hidden="true" className={className}>
      <rect width="60" height="60" rx="11" fill="#0b0b10" />
      {RING_COLORS.map((color, i) => (
        <circle
          key={color}
          cx="30"
          cy="30"
          r={RING_RADIUS}
          fill="none"
          stroke={color}
          strokeWidth="5.5"
          strokeLinecap="round"
          strokeDasharray={`${RING_SEGMENT - 4} ${2 * Math.PI * RING_RADIUS}`}
          transform={`rotate(${i * 60 - 90} 30 30)`}
        />
      ))}
    </svg>
  );
}

function PartnerLogos({ className = "" }) {
  return (
    <div className={`flex items-center ${className}`}>
      <NuSeal className="w-[3.8rem]" />
      <div className="ml-[0.7rem] flex items-center gap-[0.6rem]">
        <ImpactNetworkTile className="w-[3.6rem]" />
        <p className="leading-[1.1] text-[#111]">
          <span className="block text-[0.72rem] font-medium tracking-tight">Times Higher Education</span>
          <span className="block text-[1.08rem] font-semibold tracking-tight">
            Sustainability
            <br />
            Impact Network
          </span>
        </p>
      </div>
    </div>
  );
}

export default PartnerLogos;
