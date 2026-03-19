import type { SVGProps } from "react"

interface QuantaProps extends SVGProps<SVGSVGElement> {
  size?: number
}

/**
 * Quanta — the Quant Club mascot. A cute neobrutalist owl, wisdom meets markets.
 * Pose: waving hello with left wing raised.
 */
export default function QuantaWave({ size = 130, className, ...props }: QuantaProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 130 168"
      width={size}
      height={Math.round(size * (168 / 130))}
      role="img"
      aria-label="Quanta the owl mascot waving hello"
      className={className}
      {...props}
    >
      {/* Drop shadow — matches site 4px offset */}
      <ellipse cx="68" cy="160" rx="36" ry="8" fill="black" opacity="0.12" />

      {/* EAR TUFTS */}
      <polygon points="34,28 24,8 44,18" fill="var(--main)" stroke="black" strokeWidth="3.5" strokeLinejoin="round" />
      <polygon points="96,28 106,8 86,18" fill="var(--main)" stroke="black" strokeWidth="3.5" strokeLinejoin="round" />

      {/* HEAD */}
      <circle cx="65" cy="58" r="40" fill="var(--main)" stroke="black" strokeWidth="4" />

      {/* EYE SCLERA (white rings — big expressive owl eyes) */}
      <circle cx="47" cy="55" r="17" fill="white" stroke="black" strokeWidth="3.5" />
      <circle cx="83" cy="55" r="17" fill="white" stroke="black" strokeWidth="3.5" />

      {/* EYE PUPILS */}
      <circle cx="49" cy="57" r="11" fill="#0a0a1a" />
      <circle cx="85" cy="57" r="11" fill="#0a0a1a" />

      {/* EYE IRIS (teal) */}
      <circle cx="49" cy="57" r="6" fill="var(--main)" />
      <circle cx="85" cy="57" r="6" fill="var(--main)" />

      {/* EYE HIGHLIGHTS */}
      <circle cx="44" cy="51" r="3.5" fill="white" />
      <circle cx="80" cy="51" r="3.5" fill="white" />

      {/* BEAK */}
      <polygon points="65,68 57,80 73,80" fill="#e8a000" stroke="black" strokeWidth="2.5" strokeLinejoin="round" />

      {/* BODY */}
      <ellipse cx="65" cy="120" rx="32" ry="40" fill="var(--main)" stroke="black" strokeWidth="4" />

      {/* BELLY (white chest with feather arc details) */}
      <ellipse cx="65" cy="123" rx="20" ry="28" fill="white" stroke="black" strokeWidth="2.5" />

      {/* Feather arc details on belly */}
      <path d="M 50,108 Q 65,102 80,108" fill="none" stroke="black" strokeWidth="1.5" opacity="0.35" />
      <path d="M 48,116 Q 65,110 82,116" fill="none" stroke="black" strokeWidth="1.5" opacity="0.35" />
      <path d="M 48,124 Q 65,118 82,124" fill="none" stroke="black" strokeWidth="1.5" opacity="0.35" />

      {/* Sigma on belly */}
      <text x="65" y="141" textAnchor="middle" fontFamily="sans-serif" fontSize="16" fontWeight="900" fill="black" opacity="0.75">
        Σ
      </text>

      {/* LEFT WING — raised (waving), curving upward */}
      <g className="quanta-wing-wave">
        <path
          d="M 36,100 C 20,90 6,70 8,50 C 10,34 22,34 26,44 C 30,54 32,76 36,100 Z"
          fill="var(--main)"
          stroke="black"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        {/* Wing feather detail */}
        <path d="M 18,60 Q 28,55 36,68" fill="none" stroke="black" strokeWidth="1.5" opacity="0.4" />
        <path d="M 14,72 Q 24,67 34,80" fill="none" stroke="black" strokeWidth="1.5" opacity="0.4" />

        {/* Small waving "tip" of the wing */}
        <ellipse cx="10" cy="42" rx="8" ry="12" fill="var(--main)" stroke="black" strokeWidth="3" transform="rotate(-25, 10, 42)" />
      </g>

      {/* RIGHT WING — relaxed, down */}
      <path
        d="M 94,100 C 110,106 120,120 118,136 C 116,148 106,146 102,138 C 98,126 96,112 94,100 Z"
        fill="var(--main)"
        stroke="black"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/* Wing feather detail */}
      <path d="M 112,122 Q 102,117 96,130" fill="none" stroke="black" strokeWidth="1.5" opacity="0.4" />

      {/* FEET */}
      {/* Left foot */}
      <line x1="52" y1="156" x2="52" y2="163" stroke="black" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="52" y1="163" x2="40" y2="168" stroke="black" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="52" y1="163" x2="52" y2="168" stroke="black" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="52" y1="163" x2="64" y2="168" stroke="black" strokeWidth="3.5" strokeLinecap="round" />
      {/* Right foot */}
      <line x1="78" y1="156" x2="78" y2="163" stroke="black" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="78" y1="163" x2="66" y2="168" stroke="black" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="78" y1="163" x2="78" y2="168" stroke="black" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="78" y1="163" x2="90" y2="168" stroke="black" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  )
}
