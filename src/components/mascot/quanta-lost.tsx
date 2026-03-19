import type { SVGProps } from "react"

interface QuantaProps extends SVGProps<SVGSVGElement> {
  size?: number
}

/**
 * Quanta owl — lost / 404 pose. X eyes, wings spread wide, confused.
 */
export default function QuantaLost({ size = 160, className, ...props }: QuantaProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 180 175"
      width={size}
      height={Math.round(size * (175 / 180))}
      role="img"
      aria-label="Quanta the owl mascot looking lost"
      className={className}
      {...props}
    >
      {/* Floating ? marks */}
      <text x="14" y="36" fontFamily="sans-serif" fontSize="22" fontWeight="900" fill="var(--main)" stroke="black" strokeWidth="0.5">
        ?
      </text>
      <text x="152" y="50" fontFamily="sans-serif" fontSize="16" fontWeight="900" fill="var(--main)" stroke="black" strokeWidth="0.5" opacity="0.85">
        ?
      </text>
      <text x="24" y="72" fontFamily="sans-serif" fontSize="11" fontWeight="900" fill="var(--main)" stroke="black" strokeWidth="0.5" opacity="0.6">
        ?
      </text>

      {/* Drop shadow */}
      <ellipse cx="90" cy="168" rx="38" ry="8" fill="black" opacity="0.12" />

      {/* EAR TUFTS — one drooping (comical) */}
      <polygon points="62,28 52,8 72,18" fill="var(--main)" stroke="black" strokeWidth="3.5" strokeLinejoin="round" />
      {/* Right tuft drooping */}
      <polygon points="118,30 132,22 114,20" fill="var(--main)" stroke="black" strokeWidth="3.5" strokeLinejoin="round" />

      {/* HEAD */}
      <circle cx="90" cy="65" r="40" fill="var(--main)" stroke="black" strokeWidth="4" />

      {/* EYE SCLERA */}
      <circle cx="72" cy="62" r="17" fill="white" stroke="black" strokeWidth="3.5" />
      <circle cx="108" cy="62" r="17" fill="white" stroke="black" strokeWidth="3.5" />

      {/* X EYES — confused/broken */}
      <line x1="62" y1="52" x2="82" y2="72" stroke="#0a0a1a" strokeWidth="4" strokeLinecap="round" />
      <line x1="82" y1="52" x2="62" y2="72" stroke="#0a0a1a" strokeWidth="4" strokeLinecap="round" />
      <line x1="98" y1="52" x2="118" y2="72" stroke="#0a0a1a" strokeWidth="4" strokeLinecap="round" />
      <line x1="118" y1="52" x2="98" y2="72" stroke="#0a0a1a" strokeWidth="4" strokeLinecap="round" />
      {/* Color X centers */}
      <line x1="64" y1="54" x2="80" y2="70" stroke="var(--main)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="80" y1="54" x2="64" y2="70" stroke="var(--main)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="100" y1="54" x2="116" y2="70" stroke="var(--main)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="116" y1="54" x2="100" y2="70" stroke="var(--main)" strokeWidth="2.5" strokeLinecap="round" />

      {/* BEAK — tilted slightly (confused) */}
      <polygon points="90,75 84,85 96,87" fill="#e8a000" stroke="black" strokeWidth="2.5" strokeLinejoin="round" transform="rotate(8, 90, 80)" />

      {/* BODY */}
      <ellipse cx="90" cy="128" rx="32" ry="38" fill="var(--main)" stroke="black" strokeWidth="4" />

      {/* BELLY */}
      <ellipse cx="90" cy="130" rx="20" ry="26" fill="white" stroke="black" strokeWidth="2.5" />
      {/* Error text */}
      <text x="90" y="120" textAnchor="middle" fontFamily="monospace" fontSize="11" fontWeight="700" fill="black" opacity="0.7">
        ERROR
      </text>
      <text x="90" y="134" textAnchor="middle" fontFamily="monospace" fontSize="14" fontWeight="900" fill="black" opacity="0.85">
        404
      </text>
      <text x="90" y="148" textAnchor="middle" fontFamily="sans-serif" fontSize="9" fontWeight="700" fill="black" opacity="0.5">
        not found
      </text>

      {/* WINGS — spread wide (confused/panicked) */}
      {/* Left wing spread far left */}
      <path
        d="M 62,108 C 44,96 22,88 10,96 C 0,102 4,114 14,114 C 24,114 44,108 62,108 Z"
        fill="var(--main)"
        stroke="black"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/* Right wing spread far right */}
      <path
        d="M 118,108 C 136,96 158,88 170,96 C 180,102 176,114 166,114 C 156,114 136,108 118,108 Z"
        fill="var(--main)"
        stroke="black"
        strokeWidth="4"
        strokeLinejoin="round"
      />

      {/* FEET */}
      <line x1="76" y1="162" x2="76" y2="168" stroke="black" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="76" y1="168" x2="64" y2="174" stroke="black" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="76" y1="168" x2="76" y2="175" stroke="black" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="76" y1="168" x2="88" y2="174" stroke="black" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="104" y1="162" x2="104" y2="168" stroke="black" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="104" y1="168" x2="92" y2="174" stroke="black" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="104" y1="168" x2="104" y2="175" stroke="black" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="104" y1="168" x2="116" y2="174" stroke="black" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  )
}
