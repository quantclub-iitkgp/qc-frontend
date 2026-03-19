import type { SVGProps } from "react"

interface QuantaProps extends SVGProps<SVGSVGElement> {
  size?: number
}

/**
 * Quanta owl — coding pose. Both wings on a laptop keyboard, focused eyes.
 */
export default function QuantaCode({ size = 130, className, ...props }: QuantaProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 130 200"
      width={size}
      height={Math.round(size * (200 / 130))}
      role="img"
      aria-label="Quanta the owl mascot coding"
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

      {/* EYES — focused/squinting slightly */}
      <circle cx="47" cy="55" r="17" fill="white" stroke="black" strokeWidth="3.5" />
      <circle cx="83" cy="55" r="17" fill="white" stroke="black" strokeWidth="3.5" />
      {/* Focused pupils (slightly squinted — use ellipses) */}
      <ellipse cx="47" cy="57" rx="10" ry="9" fill="#0a0a1a" />
      <ellipse cx="83" cy="57" rx="10" ry="9" fill="#0a0a1a" />
      <ellipse cx="47" cy="57" rx="5.5" ry="5" fill="var(--main)" />
      <ellipse cx="83" cy="57" rx="5.5" ry="5" fill="var(--main)" />
      <circle cx="43" cy="52" r="3" fill="white" />
      <circle cx="79" cy="52" r="3" fill="white" />
      {/* Focus lines above eyes */}
      <path d="M 33,40 Q 47,35 58,39" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" />
      <path d="M 74,39 Q 83,35 96,40" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" />

      {/* BEAK */}
      <polygon points="65,68 57,80 73,80" fill="#e8a000" stroke="black" strokeWidth="2.5" strokeLinejoin="round" />

      {/* BODY */}
      <ellipse cx="65" cy="120" rx="32" ry="40" fill="var(--main)" stroke="black" strokeWidth="4" />

      {/* BELLY */}
      <ellipse cx="65" cy="123" rx="20" ry="28" fill="white" stroke="black" strokeWidth="2.5" />
      <path d="M 50,108 Q 65,102 80,108" fill="none" stroke="black" strokeWidth="1.5" opacity="0.35" />
      <path d="M 48,116 Q 65,110 82,116" fill="none" stroke="black" strokeWidth="1.5" opacity="0.35" />
      {/* Code on belly */}
      <text x="65" y="128" textAnchor="middle" fontFamily="monospace" fontSize="10" fontWeight="700" fill="black" opacity="0.8">
        {"</>"}
      </text>
      <text x="65" y="141" textAnchor="middle" fontFamily="sans-serif" fontSize="12" fontWeight="900" fill="black" opacity="0.6">
        Σ
      </text>

      {/* WINGS — angled down toward keyboard */}
      <path
        d="M 36,100 C 26,110 22,130 26,150 C 28,160 36,156 38,148 C 40,136 38,118 36,100 Z"
        fill="var(--main)"
        stroke="black"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d="M 94,100 C 104,110 108,130 104,150 C 102,160 94,156 92,148 C 90,136 92,118 94,100 Z"
        fill="var(--main)"
        stroke="black"
        strokeWidth="4"
        strokeLinejoin="round"
      />

      {/* LAPTOP */}
      {/* Screen */}
      <rect x="14" y="148" width="102" height="24" rx="3" fill="white" stroke="black" strokeWidth="3.5" />
      <rect x="18" y="151" width="94" height="18" rx="2" fill="#0a0a1a" />
      {/* Code on screen */}
      <text x="65" y="163" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="var(--main)">
        return α * Σ(x)
      </text>
      {/* Cursor */}
      <line x1="102" y1="158" x2="102" y2="166" stroke="var(--main)" strokeWidth="1.5" />

      {/* Keyboard base */}
      <rect x="10" y="172" width="110" height="28" rx="3" fill="white" stroke="black" strokeWidth="3.5" />
      {/* Keys row 1 */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <rect key={`r1-${i}`} x={14 + i * 12} y={176} width={9} height={6} rx={1} fill="var(--main)" opacity={0.35} />
      ))}
      {/* Keys row 2 */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <rect key={`r2-${i}`} x={16 + i * 12} y={185} width={9} height={6} rx={1} fill="var(--main)" opacity={0.28} />
      ))}
      {/* Spacebar */}
      <rect x="34" y="193" width="62" height="5" rx="1" fill="var(--main)" opacity="0.35" />

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
