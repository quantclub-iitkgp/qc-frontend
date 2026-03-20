import type { SVGProps } from "react"

interface QuantaProps extends SVGProps<SVGSVGElement> {
  size?: number
}

/**
 * Quanta owl — thinking pose. Right wing raised near beak, thought bubbles above.
 */
export default function QuantaThink({ size = 130, className, ...props }: QuantaProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 155 168"
      width={size}
      height={Math.round(size * (168 / 155))}
      role="img"
      aria-label="Quanta the owl mascot thinking"
      className={className}
      {...props}
    >
      {/* Thought bubbles (upper-right) — GPU-accelerated CSS pulse */}
      <circle cx="122" cy="44" r="6" fill="var(--main)" stroke="black" strokeWidth="2" className="quanta-bubble" />
      <circle cx="136" cy="28" r="9" fill="var(--main)" stroke="black" strokeWidth="2" className="quanta-bubble quanta-bubble-d1" />
      <circle cx="150" cy="12" r="12" fill="var(--main)" stroke="black" strokeWidth="2" className="quanta-bubble quanta-bubble-d2" />
      <text x="150" y="16" textAnchor="middle" fontFamily="sans-serif" fontSize="12" fontWeight="900" fill="black">
        ?
      </text>

      {/* Drop shadow */}
      <ellipse cx="65" cy="160" rx="36" ry="8" fill="black" opacity="0.12" />

      {/* EAR TUFTS */}
      <polygon points="34,28 24,8 44,18" fill="var(--main)" stroke="black" strokeWidth="3.5" strokeLinejoin="round" />
      <polygon points="96,28 106,8 86,18" fill="var(--main)" stroke="black" strokeWidth="3.5" strokeLinejoin="round" />

      {/* HEAD */}
      <circle cx="65" cy="58" r="40" fill="var(--main)" stroke="black" strokeWidth="4" />

      {/* EYE SCLERA */}
      <circle cx="47" cy="55" r="17" fill="white" stroke="black" strokeWidth="3.5" />
      <circle cx="83" cy="55" r="17" fill="white" stroke="black" strokeWidth="3.5" />

      {/* PUPILS — shifted upper-right (looking at thought) */}
      <circle cx="52" cy="52" r="11" fill="#0a0a1a" />
      <circle cx="88" cy="52" r="11" fill="#0a0a1a" />

      {/* IRIS */}
      <circle cx="52" cy="52" r="6" fill="var(--main)" />
      <circle cx="88" cy="52" r="6" fill="var(--main)" />

      {/* HIGHLIGHTS */}
      <circle cx="47" cy="47" r="3.5" fill="white" />
      <circle cx="83" cy="47" r="3.5" fill="white" />

      {/* BEAK */}
      <polygon points="65,68 57,80 73,80" fill="#e8a000" stroke="black" strokeWidth="2.5" strokeLinejoin="round" />

      {/* Raised eyebrow line (thoughtful) */}
      <path d="M 33,40 Q 47,34 58,38" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 74,38 Q 83,34 96,40" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" />

      {/* BODY */}
      <ellipse cx="65" cy="120" rx="32" ry="40" fill="var(--main)" stroke="black" strokeWidth="4" />

      {/* BELLY */}
      <ellipse cx="65" cy="123" rx="20" ry="28" fill="white" stroke="black" strokeWidth="2.5" />
      <path d="M 50,108 Q 65,102 80,108" fill="none" stroke="black" strokeWidth="1.5" opacity="0.35" />
      <path d="M 48,116 Q 65,110 82,116" fill="none" stroke="black" strokeWidth="1.5" opacity="0.35" />
      <path d="M 48,124 Q 65,118 82,124" fill="none" stroke="black" strokeWidth="1.5" opacity="0.35" />
      <text x="65" y="141" textAnchor="middle" fontFamily="sans-serif" fontSize="16" fontWeight="900" fill="black" opacity="0.75">
        Σ
      </text>

      {/* LEFT WING — relaxed/down */}
      <path
        d="M 36,100 C 20,106 10,120 12,136 C 14,148 24,146 28,138 C 32,126 34,112 36,100 Z"
        fill="var(--main)"
        stroke="black"
        strokeWidth="4"
        strokeLinejoin="round"
      />

      {/* RIGHT WING — raised toward beak (thinking gesture) */}
      <path
        d="M 94,100 C 110,88 124,68 120,50 C 118,36 108,38 106,48 C 104,58 98,78 94,100 Z"
        fill="var(--main)"
        stroke="black"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/* Wing tip near beak */}
      <ellipse cx="120" cy="46" rx="8" ry="12" fill="var(--main)" stroke="black" strokeWidth="3" transform="rotate(20, 120, 46)" />

      {/* FEET */}
      <line x1="52" y1="156" x2="52" y2="163" stroke="black" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="52" y1="163" x2="40" y2="168" stroke="black" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="52" y1="163" x2="52" y2="168" stroke="black" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="52" y1="163" x2="64" y2="168" stroke="black" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="78" y1="156" x2="78" y2="163" stroke="black" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="78" y1="163" x2="66" y2="168" stroke="black" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="78" y1="163" x2="78" y2="168" stroke="black" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="78" y1="163" x2="90" y2="168" stroke="black" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  )
}
