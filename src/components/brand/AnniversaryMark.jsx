// Vector stand-in for NU's 126th-anniversary mark. Each digit sits on its own navy
// outline so overlapping digits stay separated, like the official logo.
const DIGITS = [
  { glyph: "1", x: 30 },
  { glyph: "2", x: 72 },
  { glyph: "6", x: 115 },
];

function AnniversaryMark({ className }) {
  return (
    <svg viewBox="0 0 148 74" role="img" aria-label="126 years of National University" className={className}>
      <defs>
        <linearGradient id="nu126-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fde98f" />
          <stop offset="0.45" stopColor="#f2c53a" />
          <stop offset="1" stopColor="#cf9414" />
        </linearGradient>
      </defs>
      <g
        fontFamily="'Inter Variable', Inter, sans-serif"
        fontSize="82"
        fontWeight="900"
        textAnchor="middle"
        stroke="#29368f"
        strokeLinejoin="round"
      >
        {DIGITS.map(({ glyph, x }) => (
          <text key={`outline-${glyph}`} x={x} y="66" strokeWidth="13" fill="#29368f">
            {glyph}
          </text>
        ))}
        {DIGITS.map(({ glyph, x }) => (
          <text key={glyph} x={x} y="66" strokeWidth="7" paintOrder="stroke" fill="url(#nu126-gold)">
            {glyph}
          </text>
        ))}
      </g>
    </svg>
  );
}

export default AnniversaryMark;
