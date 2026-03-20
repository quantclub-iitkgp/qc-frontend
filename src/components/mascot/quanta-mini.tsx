import type { SVGProps } from "react"

interface QuantaMiniProps extends SVGProps<SVGSVGElement> {
  size?: number
}

/**
 * Quanta Mini — compact owl face for tight spaces (marquee, nav, inline badges).
 */
export default function QuantaMini({ size = 40, className, ...props }: QuantaMiniProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 56 60"
      width={size}
      height={Math.round(size * (60 / 56))}
      role="img"
      aria-label="Quanta mini"
      className={className}
      {...props}
    >
      {/* Ear tufts */}
      <polygon points="16,14 10,2 22,8" fill="var(--main)" stroke="black" strokeWidth="2" strokeLinejoin="round" />
      <polygon points="40,14 46,2 34,8" fill="var(--main)" stroke="black" strokeWidth="2" strokeLinejoin="round" />

      {/* Head */}
      <circle cx="28" cy="32" r="26" fill="var(--main)" stroke="black" strokeWidth="3" />

      {/* Eyes */}
      <circle cx="17" cy="29" r="11" fill="white" stroke="black" strokeWidth="2.5" />
      <circle cx="39" cy="29" r="11" fill="white" stroke="black" strokeWidth="2.5" />
      <circle cx="18" cy="30" r="7" fill="#0a0a1a" />
      <circle cx="40" cy="30" r="7" fill="#0a0a1a" />
      <circle cx="18" cy="30" r="4" fill="var(--main)" />
      <circle cx="40" cy="30" r="4" fill="var(--main)" />
      {/* Highlights */}
      <circle cx="14" cy="26" r="2.5" fill="white" />
      <circle cx="36" cy="26" r="2.5" fill="white" />

      {/* Beak */}
      <polygon points="28,38 23,46 33,46" fill="#e8a000" stroke="black" strokeWidth="2" strokeLinejoin="round" />

      {/* Tiny Σ below eyes on beak area */}
      <text x="28" y="57" textAnchor="middle" fontFamily="sans-serif" fontSize="7" fontWeight="900" fill="var(--main)" stroke="black" strokeWidth="0.3">
        Σ
      </text>
    </svg>
  )
}
