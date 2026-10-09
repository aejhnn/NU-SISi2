// Vector stand-in for the official NU shield. Swap in the real artwork with
// <img src={shieldUrl} alt="National University shield" className={className} /> once it's in the repo.
function NuShield({ className }) {
  return (
    <svg viewBox="0 0 64 68" role="img" aria-label="National University shield" className={className}>
      <defs>
        <linearGradient id="nu-shield-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#36438f" />
          <stop offset="1" stopColor="#1d2768" />
        </linearGradient>
        <linearGradient id="nu-shield-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f3d98a" />
          <stop offset="1" stopColor="#c39538" />
        </linearGradient>
      </defs>
      <path
        d="M5 9C12 8 18 6 23 3C26 4.5 29 5 32 2C35 5 38 4.5 41 3C46 6 52 8 59 9V36C59 51 48 61 32 66C16 61 5 51 5 36Z"
        fill="url(#nu-shield-fill)"
        stroke="url(#nu-shield-gold)"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <path
        d="M10 13C16 12 21 10.5 25 8.5C27.5 9.5 30 9.8 32 7.5C34 9.8 36.5 9.5 39 8.5C43 10.5 48 12 54 13V36C54 48 45 56.5 32 61C19 56.5 10 48 10 36Z"
        fill="none"
        stroke="#d6b35b"
        strokeOpacity="0.55"
        strokeWidth="0.8"
      />
      <text
        x="32"
        y="42"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="27"
        fontWeight="700"
        letterSpacing="-2"
        fill="url(#nu-shield-gold)"
      >
        NU
      </text>
      <text
        x="32"
        y="53"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="6.5"
        letterSpacing="0.6"
        fill="#e2c26e"
      >
        1900
      </text>
    </svg>
  );
}

export default NuShield;
