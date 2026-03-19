import type { SVGProps } from "react"

interface QuantaProps extends SVGProps<SVGSVGElement> {
  size?: number
}

/**
 * Quanta owl — reading pose. Both wings holding an open book, eyes looking down.
 */
export default function QuantaRead({ size = 130, className, ...props }: QuantaProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 130 200"
      width={size}
      height={Math.round(size * (200 / 130))}
      role="img"
      aria-label="Quanta the owl mascot reading"
      className={className}
      {...props}
    >
      {/* Drop shadow */}
      <ellipse cx="65" cy="195" rx="42" ry="6" fill="black" opacity="0.12" />

      {/* EAR TUFTS */}
      <polygon points="34,28 24,8 44,18" fill="var(--main)" stroke="black" strokeWidth="3.5" strokeLinejoin="round" />
      <polygon points="96,28 106,8 86,18" fill="var(--main)" stroke="black" strokeWidth="3.5" strokeLinejoin="round" />

      {/* HEAD */}
      <circle cx="65" cy="58" r="40" fill="var(--main)" stroke="black" strokeWidth="4" />

      {/* Reading glasses */}
      <circle cx="47" cy="55" r="17" fill="white" stroke="black" strokeWidth="3.5" />
      <circle cx="83" cy="55" r="17" fill="white" stroke="black" strokeWidth="3.5" />
      {/* Glasses frames */}
      <circle cx="47" cy="55" r="17" fill="none" stroke="var(--main)" strokeWidth="2" strokeOpacity="0.6" />
      <circle cx="83" cy="55" r="17" fill="none" stroke="var(--main)" strokeWidth="2" strokeOpacity="0.6" />
      {/* Glasses bridge */}
      <line x1="64" y1="55" x2="66" y2="55" stroke="black" strokeWidth="2.5" />
      {/* Temple arms */}
      <line x1="30" y1="52" x2="22" y2="50" stroke="black" strokeWidth="2" strokeLinecap="round" />
      <line x1="100" y1="52" x2="108" y2="50" stroke="black" strokeWidth="2" strokeLinecap="round" />

      {/* PUPILS — looking downward */}
      <circle cx="47" cy="62" r="10" fill="#0a0a1a" />
      <circle cx="83" cy="62" r="10" fill="#0a0a1a" />
      <circle cx="47" cy="62" r="5" fill="var(--main)" />
      <circle cx="83" cy="62" r="5" fill="var(--main)" />
      <circle cx="43" cy="58" r="2.5" fill="white" />
      <circle cx="79" cy="58" r="2.5" fill="white" />

      {/* BEAK */}
      <polygon points="65,68 57,80 73,80" fill="#e8a000" stroke="black" strokeWidth="2.5" strokeLinejoin="round" />

      {/* Small smile under beak */}
      <path d="M 55,84 Q 65,90 75,84" fill="none" stroke="var(--main)" strokeWidth="2" strokeLinecap="round" />

      {/* BODY */}
      <ellipse cx="65" cy="120" rx="32" ry="40" fill="var(--main)" stroke="black" strokeWidth="4" />

      {/* BELLY */}
      <ellipse cx="65" cy="123" rx="20" ry="28" fill="white" stroke="black" strokeWidth="2.5" />
      <path d="M 50,108 Q 65,102 80,108" fill="none" stroke="black" strokeWidth="1.5" opacity="0.35" />
      <path d="M 48,116 Q 65,110 82,116" fill="none" stroke="black" strokeWidth="1.5" opacity="0.35" />
      <text x="65" y="136" textAnchor="middle" fontFamily="sans-serif" fontSize="16" fontWeight="900" fill="black" opacity="0.75">
        Σ
      </text>

      {/* WINGS — holding book forward */}
      {/* Left wing forward-down */}
      <path
        d="M 36,100 C 26,108 24,128 28,148 C 30,158 38,152 40,144 C 42,132 40,116 36,100 Z"
        fill="var(--main)"
        stroke="black"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/* Right wing forward-down */}
      <path
        d="M 94,100 C 104,108 106,128 102,148 C 100,158 92,152 90,144 C 88,132 90,116 94,100 Z"
        fill="var(--main)"
        stroke="black"
        strokeWidth="4"
        strokeLinejoin="round"
      />

      {/* OPEN BOOK */}
      <rect x="20" y="148" width="90" height="58" rx="3" fill="white" stroke="black" strokeWidth="4" />
      {/* Book spine */}
      <line x1="65" y1="148" x2="65" y2="206" stroke="black" strokeWidth="2.5" />
      {/* Page curl top */}
      <path d="M 20,148 Q 43,143 65,148" fill="var(--main)" stroke="black" strokeWidth="2" opacity="0.5" />
      <path d="M 65,148 Q 87,143 110,148" fill="var(--main)" stroke="black" strokeWidth="2" opacity="0.5" />
      {/* Text lines left page */}
      <line x1="26" y1="162" x2="58" y2="162" stroke="black" strokeWidth="1.5" opacity="0.3" />
      <line x1="26" y1="169" x2="58" y2="169" stroke="black" strokeWidth="1.5" opacity="0.3" />
      <line x1="26" y1="176" x2="58" y2="176" stroke="black" strokeWidth="1.5" opacity="0.3" />
      <line x1="26" y1="183" x2="48" y2="183" stroke="black" strokeWidth="1.5" opacity="0.3" />
      {/* Text lines right page */}
      <line x1="72" y1="162" x2="104" y2="162" stroke="black" strokeWidth="1.5" opacity="0.3" />
      <line x1="72" y1="169" x2="104" y2="169" stroke="black" strokeWidth="1.5" opacity="0.3" />
      <line x1="72" y1="176" x2="104" y2="176" stroke="black" strokeWidth="1.5" opacity="0.3" />
      <line x1="72" y1="183" x2="96" y2="183" stroke="black" strokeWidth="1.5" opacity="0.3" />
      {/* Alpha beta sigma on left page */}
      <text x="41" y="198" textAnchor="middle" fontFamily="sans-serif" fontSize="9" fontWeight="700" fill="black" opacity="0.4">
        α β γ Σ
      </text>

      {/* FEET */}
      <line x1="52" y1="156" x2="52" y2="162" stroke="black" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="52" y1="162" x2="42" y2="167" stroke="black" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="52" y1="162" x2="52" y2="167" stroke="black" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="52" y1="162" x2="62" y2="167" stroke="black" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="78" y1="156" x2="78" y2="162" stroke="black" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="78" y1="162" x2="68" y2="167" stroke="black" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="78" y1="162" x2="78" y2="167" stroke="black" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="78" y1="162" x2="88" y2="167" stroke="black" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  )
}
