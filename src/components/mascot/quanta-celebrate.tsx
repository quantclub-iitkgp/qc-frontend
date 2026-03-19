import type { SVGProps } from "react"

interface QuantaProps extends SVGProps<SVGSVGElement> {
  size?: number
}

/**
 * Quanta owl — celebrating! Both wings raised high, star-sparkle eyes, confetti.
 */
export default function QuantaCelebrate({ size = 140, className, ...props }: QuantaProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 160 185"
      width={size}
      height={Math.round(size * (185 / 160))}
      role="img"
      aria-label="Quanta the owl mascot celebrating"
      className={className}
      {...props}
    >
      {/* Confetti / stars */}
      <polygon points="22,20 25,30 22,40 19,30" fill="var(--main)" stroke="black" strokeWidth="1.5" />
      <polygon points="138,14 141,24 138,34 135,24" fill="var(--main)" stroke="black" strokeWidth="1.5" />
      <polygon points="8,60 10,68 8,76 6,68" fill="var(--main)" stroke="black" strokeWidth="1" opacity="0.8" />
      <polygon points="152,55 154,63 152,71 150,63" fill="var(--main)" stroke="black" strokeWidth="1" opacity="0.8" />
      {/* Confetti rects */}
      <rect x="30" y="44" width="10" height="10" rx="2" fill="var(--main)" stroke="black" strokeWidth="1.5" transform="rotate(25, 35, 49)" />
      <rect x="120" y="38" width="10" height="10" rx="2" fill="var(--main)" stroke="black" strokeWidth="1.5" transform="rotate(-20, 125, 43)" />
      <rect x="12" y="88" width="8" height="8" rx="2" fill="var(--main)" stroke="black" strokeWidth="1" opacity="0.7" transform="rotate(15, 16, 92)" />
      <rect x="140" y="84" width="8" height="8" rx="2" fill="var(--main)" stroke="black" strokeWidth="1" opacity="0.7" transform="rotate(-15, 144, 88)" />
      {/* Small dots */}
      <circle cx="18" cy="44" r="4" fill="var(--main)" stroke="black" strokeWidth="1" opacity="0.6" />
      <circle cx="142" cy="44" r="4" fill="var(--main)" stroke="black" strokeWidth="1" opacity="0.6" />

      {/* Drop shadow */}
      <ellipse cx="80" cy="178" rx="38" ry="8" fill="black" opacity="0.12" />

      {/* EAR TUFTS */}
      <polygon points="48,30 38,10 58,20" fill="var(--main)" stroke="black" strokeWidth="3.5" strokeLinejoin="round" />
      <polygon points="112,30 122,10 102,20" fill="var(--main)" stroke="black" strokeWidth="3.5" strokeLinejoin="round" />

      {/* HEAD */}
      <circle cx="80" cy="68" r="40" fill="var(--main)" stroke="black" strokeWidth="4" />

      {/* STAR/SPARKLE EYES (joyful) */}
      <circle cx="62" cy="65" r="17" fill="white" stroke="black" strokeWidth="3.5" />
      <circle cx="98" cy="65" r="17" fill="white" stroke="black" strokeWidth="3.5" />
      {/* Star shapes in eyes */}
      <text x="62" y="70" textAnchor="middle" fontFamily="sans-serif" fontSize="16" fill="#e8a000">★</text>
      <text x="98" y="70" textAnchor="middle" fontFamily="sans-serif" fontSize="16" fill="#e8a000">★</text>
      {/* Eye highlights */}
      <circle cx="57" cy="60" r="3" fill="white" opacity="0.9" />
      <circle cx="93" cy="60" r="3" fill="white" opacity="0.9" />

      {/* BEAK — big happy open beak */}
      <polygon points="80,78 70,92 90,92" fill="#e8a000" stroke="black" strokeWidth="2.5" strokeLinejoin="round" />
      {/* Open beak interior */}
      <ellipse cx="80" cy="90" rx="6" ry="3" fill="#c07000" />

      {/* Big smile arc below head */}
      <path d="M 60,95 Q 80,108 100,95" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" />

      {/* BODY */}
      <ellipse cx="80" cy="132" rx="32" ry="40" fill="var(--main)" stroke="black" strokeWidth="4" />

      {/* BELLY */}
      <ellipse cx="80" cy="135" rx="20" ry="28" fill="white" stroke="black" strokeWidth="2.5" />
      <path d="M 65,120 Q 80,114 95,120" fill="none" stroke="black" strokeWidth="1.5" opacity="0.35" />
      <path d="M 63,128 Q 80,122 97,128" fill="none" stroke="black" strokeWidth="1.5" opacity="0.35" />
      {/* 100% on belly */}
      <text x="80" y="140" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fontWeight="900" fill="black">
        100%
      </text>
      <text x="80" y="154" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fontWeight="900" fill="black">
        ↑ Σ ↑
      </text>

      {/* WINGS — raised high (celebrating) */}
      {/* Left wing high */}
      <path
        d="M 52,112 C 36,98 18,72 18,52 C 18,36 30,32 36,42 C 42,52 46,82 52,112 Z"
        fill="var(--main)"
        stroke="black"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/* Wing tip — small round end */}
      <circle cx="20" cy="46" r="9" fill="var(--main)" stroke="black" strokeWidth="3" />
      <path d="M 26,58 Q 38,50 44,68" fill="none" stroke="black" strokeWidth="1.5" opacity="0.4" />

      {/* Right wing high */}
      <path
        d="M 108,112 C 124,98 142,72 142,52 C 142,36 130,32 124,42 C 118,52 114,82 108,112 Z"
        fill="var(--main)"
        stroke="black"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <circle cx="140" cy="46" r="9" fill="var(--main)" stroke="black" strokeWidth="3" />
      <path d="M 134,58 Q 122,50 116,68" fill="none" stroke="black" strokeWidth="1.5" opacity="0.4" />

      {/* FEET */}
      <line x1="67" y1="168" x2="67" y2="175" stroke="black" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="67" y1="175" x2="55" y2="181" stroke="black" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="67" y1="175" x2="67" y2="182" stroke="black" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="67" y1="175" x2="79" y2="181" stroke="black" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="93" y1="168" x2="93" y2="175" stroke="black" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="93" y1="175" x2="81" y2="181" stroke="black" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="93" y1="175" x2="93" y2="182" stroke="black" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="93" y1="175" x2="105" y2="181" stroke="black" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  )
}
