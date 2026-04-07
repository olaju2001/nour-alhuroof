// Reusable Islamic geometric background & decorative elements

interface Props {
  variant?: 'full' | 'top' | 'bottom' | 'minimal'
  className?: string
}

export function IslamicBackground({ variant = 'full', className = '' }: Props) {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {/* Subtle geometric pattern overlay */}
      <div className="absolute inset-0 bg-islamic-pattern opacity-40" />

      {/* Decorative corner ornaments */}
      {(variant === 'full' || variant === 'top') && (
        <>
          <svg className="absolute top-0 left-0 w-24 h-24 text-gold opacity-20" viewBox="0 0 100 100">
            <path d="M0,0 L100,0 L100,20 Q50,20 50,50 Q20,50 20,100 L0,100 Z" fill="currentColor"/>
            <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="2"/>
            <path d="M35,50 L50,35 L65,50 L50,65 Z" fill="currentColor" opacity="0.5"/>
          </svg>
          <svg className="absolute top-0 right-0 w-24 h-24 text-gold opacity-20 scale-x-[-1]" viewBox="0 0 100 100">
            <path d="M0,0 L100,0 L100,20 Q50,20 50,50 Q20,50 20,100 L0,100 Z" fill="currentColor"/>
            <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="2"/>
            <path d="M35,50 L50,35 L65,50 L50,65 Z" fill="currentColor" opacity="0.5"/>
          </svg>
        </>
      )}

      {/* Floating crescent */}
      {variant === 'full' && (
        <div className="absolute top-6 right-8 animate-float">
          <CrescentMoon size={40} color="#D4A017" opacity={0.3} />
        </div>
      )}

      {/* Stars scattered */}
      {variant === 'full' && (
        <>
          <StarIcon className="absolute top-20 left-6 animate-float" size={12} style={{ animationDelay: '0.5s', opacity: 0.25 }} />
          <StarIcon className="absolute top-32 right-12 animate-float" size={8}  style={{ animationDelay: '1.2s', opacity: 0.2  }} />
          <StarIcon className="absolute bottom-32 left-10 animate-float" size={10} style={{ animationDelay: '0.8s', opacity: 0.2 }} />
        </>
      )}
    </div>
  )
}

// ── Crescent Moon SVG ─────────────────────────────────────────────
interface CrescentProps {
  size?: number
  color?: string
  opacity?: number
  className?: string
}

export function CrescentMoon({ size = 40, color = '#D4A017', opacity = 1, className = '' }: CrescentProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className={className} style={{ opacity }}>
      <path
        d="M20 4 C11.16 4 4 11.16 4 20 C4 28.84 11.16 36 20 36 C25.5 36 30.34 33.24 33.18 29 C31.44 29.64 29.56 30 27.6 30 C19.32 30 12.6 23.28 12.6 15 C12.6 10.84 14.36 7.08 17.16 4.42 C18.08 4.15 19.04 4 20 4Z"
        fill={color}
      />
      <circle cx="30" cy="10" r="2.5" fill={color} opacity={0.7} />
    </svg>
  )
}

// ── Star icon ─────────────────────────────────────────────────────
interface StarProps {
  size?: number
  color?: string
  filled?: boolean
  className?: string
  style?: React.CSSProperties
}

export function StarIcon({ size = 24, color = '#D4A017', filled = true, className = '', style }: StarProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style}>
      <polygon
        points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
        fill={filled ? color : 'none'}
        stroke={color}
        strokeWidth={filled ? 0 : 1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// ── Islamic divider line ──────────────────────────────────────────
export function IslamicDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex-1 h-px bg-gold opacity-30" />
      <CrescentMoon size={16} color="#D4A017" opacity={0.6} />
      <div className="flex-1 h-px bg-gold opacity-30" />
    </div>
  )
}

// ── Stars row (for scoring display) ──────────────────────────────
export function StarsRow({ count, max = 3, size = 32 }: { count: number; max?: number; size?: number }) {
  return (
    <div className="flex gap-1 justify-center">
      {Array.from({ length: max }).map((_, i) => (
        <StarIcon
          key={i}
          size={size}
          filled={i < count}
          color={i < count ? '#D4A017' : '#CBD5E0'}
        />
      ))}
    </div>
  )
}
