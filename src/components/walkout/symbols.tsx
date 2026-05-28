import type { SVGProps } from 'react'

export function KoreanFlag(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="-120 -80 240 160" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="-120" y="-80" width="240" height="160" fill="#ffffff" />
      <g transform="rotate(-33)">
        <circle cx="0" cy="0" r="40" fill="#cd2e3a" />
        <path
          d="M -40 0 A 40 40 0 0 1 40 0 A 20 20 0 0 1 0 0 A 20 20 0 0 0 -40 0 Z"
          fill="#0047a0"
        />
      </g>
      <g fill="#000" transform="translate(-86 -55) rotate(-56.31)">
        <rect x="-13" y="-10" width="26" height="4" />
        <rect x="-13" y="-3" width="26" height="4" />
        <rect x="-13" y="4" width="26" height="4" />
      </g>
      <g fill="#000" transform="translate(86 -55) rotate(56.31)">
        <rect x="-13" y="-10" width="26" height="4" />
        <rect x="-13" y="-3" width="11" height="4" />
        <rect x="2" y="-3" width="11" height="4" />
        <rect x="-13" y="4" width="26" height="4" />
      </g>
      <g fill="#000" transform="translate(-86 55) rotate(56.31)">
        <rect x="-13" y="-10" width="11" height="4" />
        <rect x="2" y="-10" width="11" height="4" />
        <rect x="-13" y="-3" width="26" height="4" />
        <rect x="-13" y="4" width="11" height="4" />
        <rect x="2" y="4" width="11" height="4" />
      </g>
      <g fill="#000" transform="translate(86 55) rotate(-56.31)">
        <rect x="-13" y="-10" width="11" height="4" />
        <rect x="2" y="-10" width="11" height="4" />
        <rect x="-13" y="-3" width="11" height="4" />
        <rect x="2" y="-3" width="11" height="4" />
        <rect x="-13" y="4" width="11" height="4" />
        <rect x="2" y="4" width="11" height="4" />
      </g>
    </svg>
  )
}

export function JBNUShield(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="-100 -110 200 230" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id="jbnu-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff7c2" />
          <stop offset="50%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
      </defs>
      <path
        d="M -90 -100 L 90 -100 L 90 60 Q 90 100 0 120 Q -90 100 -90 60 Z"
        fill="#0a3d62"
        stroke="url(#jbnu-gold)"
        strokeWidth="3"
      />
      <path
        d="M -76 -86 L 76 -86 L 76 56 Q 76 90 0 106 Q -76 90 -76 56 Z"
        fill="none"
        stroke="rgba(253,224,71,0.5)"
        strokeWidth="1"
      />
      <text
        x="0"
        y="-30"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontSize="46"
        fontWeight="900"
        fill="url(#jbnu-gold)"
      >
        J
      </text>
      <text
        x="0"
        y="20"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontSize="46"
        fontWeight="900"
        fill="url(#jbnu-gold)"
      >
        B
      </text>
      <text
        x="0"
        y="70"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontSize="46"
        fontWeight="900"
        fill="url(#jbnu-gold)"
      >
        N
      </text>
      <text
        x="0"
        y="100"
        textAnchor="middle"
        fontFamily="Verdana, sans-serif"
        fontSize="14"
        fontWeight="700"
        fill="rgba(253,224,71,0.85)"
        letterSpacing="2"
      >
        EST·1947
      </text>
    </svg>
  )
}

export function PhDBadge(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="-130 -130 260 260" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id="phd-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff7c2" />
          <stop offset="50%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
        <radialGradient id="phd-bg" cx="50%" cy="35%" r="80%">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="40%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#1e1b4b" />
        </radialGradient>
        <filter id="phd-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>
      {/* Dark backdrop ring to block rays */}
      <circle cx="0" cy="0" r="125" fill="#0a0226" opacity="0.92" />
      {/* Glow underlay */}
      <circle cx="0" cy="0" r="118" fill="#8b5cf6" opacity="0.4" filter="url(#phd-glow)" />
      {/* Main disc */}
      <circle cx="0" cy="0" r="110" fill="url(#phd-bg)" stroke="url(#phd-gold)" strokeWidth="6" />
      <circle cx="0" cy="0" r="100" fill="none" stroke="rgba(253,224,71,0.6)" strokeWidth="1.5" />
      <circle cx="0" cy="0" r="90" fill="none" stroke="rgba(253,224,71,0.3)" strokeWidth="1" />
      {/* Laurel-ish accents */}
      <path
        d="M -82 8 Q -64 -36 -30 -42"
        fill="none"
        stroke="rgba(253,224,71,0.7)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M 82 8 Q 64 -36 30 -42"
        fill="none"
        stroke="rgba(253,224,71,0.7)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Side stars */}
      <g fill="#fde68a">
        <path d="M -90 -50 l 3 8 l 8 1 l -6 6 l 1.5 8 l -6.5 -4 l -6.5 4 l 1.5 -8 l -6 -6 l 8 -1 z" transform="scale(0.6) translate(-150 -80)" />
        <path d="M 90 -50 l 3 8 l 8 1 l -6 6 l 1.5 8 l -6.5 -4 l -6.5 4 l 1.5 -8 l -6 -6 l 8 -1 z" transform="scale(0.6) translate(150 -80)" />
      </g>
      <text
        x="0"
        y="-2"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontSize="56"
        fontWeight="900"
        fill="url(#phd-gold)"
      >
        Ph.D
      </text>
      <text
        x="0"
        y="36"
        textAnchor="middle"
        fontFamily="Verdana, sans-serif"
        fontSize="14"
        fontWeight="800"
        letterSpacing="4"
        fill="#fde68a"
      >
        CANDIDATE
      </text>
      <text
        x="0"
        y="60"
        textAnchor="middle"
        fontFamily="Verdana, sans-serif"
        fontSize="11"
        fontWeight="700"
        letterSpacing="2"
        fill="rgba(255,255,255,0.95)"
      >
        COMPUTER SCIENCE
      </text>
    </svg>
  )
}

export function RayBurst({ count = 16 }: { count?: number }) {
  const rays = Array.from({ length: count }, (_, i) => (i * 360) / count)
  return (
    <svg
      viewBox="-200 -200 400 400"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%' }}
    >
      <defs>
        <linearGradient id="ray-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(251,191,36,0)" />
          <stop offset="40%" stopColor="rgba(251,191,36,0.8)" />
          <stop offset="100%" stopColor="rgba(251,191,36,0)" />
        </linearGradient>
      </defs>
      {rays.map((angle, idx) => (
        <rect
          key={idx}
          x="-3"
          y="-200"
          width="6"
          height="400"
          fill="url(#ray-grad)"
          transform={`rotate(${angle})`}
        />
      ))}
    </svg>
  )
}
