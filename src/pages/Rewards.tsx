import { useNavigate } from 'react-router-dom'
import { useProgress }  from '../hooks/useProgress'
import { useLetters }   from '../hooks/useLetters'
import { IslamicBackground, StarIcon, CrescentMoon } from '../components/IslamicBackground'

// All 28 letters for the full progress map
const ARABIC_LETTERS = [
  'ا','ب','ت','ث','ج','ح','خ','د','ذ','ر',
  'ز','س','ش','ص','ض','ط','ظ','ع','غ','ف',
  'ق','ك','ل','م','ن','ه','و','ي'
]

const BADGES = [
  { id: 'first_letter',   emoji: '🌟', label: 'Erster Buchstabe',  threshold: 1  },
  { id: 'five_letters',   emoji: '🏅', label: '5 Buchstaben',       threshold: 5  },
  { id: 'ten_letters',    emoji: '🥈', label: '10 Buchstaben',      threshold: 10 },
  { id: 'halfway',        emoji: '🥇', label: 'Halbzeit! 14/28',    threshold: 14 },
  { id: 'twenty_letters', emoji: '🏆', label: '20 Buchstaben',      threshold: 20 },
  { id: 'all_letters',    emoji: '👑', label: 'Alle Buchstaben!',   threshold: 28 },
]

export function RewardsPage() {
  const navigate   = useNavigate()
  const { profile, masteredCount, getLetterProgress } = useProgress()
  const { letters } = useLetters()

  if (!profile) {
    navigate('/')
    return null
  }

  const totalStars  = profile.total_stars
  const pct         = Math.round((masteredCount / 28) * 100)

  return (
    <div className="min-h-dvh bg-cream flex flex-col relative pb-10">
      <IslamicBackground variant="full" />

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="relative z-10 bg-gradient-to-b from-night to-teal-dark px-5 pt-safe pb-8 rounded-b-[2.5rem]">
        <button
          onClick={() => navigate('/')}
          className="absolute top-4 left-5 w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white text-lg"
        >
          ←
        </button>

        <div className="flex flex-col items-center gap-2 pt-2">
          <CrescentMoon size={48} color="#D4A017" />
          <h1 className="font-arabic text-gold text-3xl font-bold">جوائزي</h1>
          <p className="font-body text-cream/80 text-lg font-semibold">Meine Belohnungen</p>

          {/* Big star count */}
          <div className="flex items-center gap-3 mt-2 bg-white/10 rounded-2xl px-8 py-3">
            <StarIcon size={36} color="#D4A017" />
            <span className="font-body font-black text-gold text-5xl">{totalStars}</span>
            <span className="font-body text-cream/60 text-lg">Sterne</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 px-5 mt-6 flex flex-col gap-6">

        {/* ── Overall progress ─────────────────────────────── */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between mb-2">
            <p className="font-body font-bold text-night text-lg">Fortschritt</p>
            <p className="font-body text-teal font-bold">{masteredCount} / 28</p>
          </div>
          <div className="h-4 bg-cream-dark rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-gradient-to-r from-teal to-gold rounded-full transition-all duration-1000"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="font-body text-night/50 text-sm text-center">
            {pct}% abgeschlossen 🎉
          </p>
        </div>

        {/* ── Badges ───────────────────────────────────────── */}
        <div>
          <h2 className="font-body font-bold text-night text-xl mb-3 flex items-center gap-2">
            🏅 Abzeichen
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {BADGES.map((badge) => {
              const earned = masteredCount >= badge.threshold
              return (
                <div
                  key={badge.id}
                  className={`
                    flex flex-col items-center justify-center rounded-2xl p-3
                    border-2 transition-all duration-300
                    ${earned
                      ? 'bg-gold/10 border-gold shadow-md'
                      : 'bg-white border-night/10 opacity-40'
                    }
                  `}
                >
                  <span className={`text-4xl ${earned ? '' : 'grayscale'}`}>
                    {badge.emoji}
                  </span>
                  <span className="font-body text-night/70 text-xs text-center mt-1 leading-tight">
                    {badge.label}
                  </span>
                  {!earned && (
                    <span className="font-body text-night/30 text-xs mt-1">
                      🔒 {badge.threshold - masteredCount} mehr
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Letter-by-letter detail ──────────────────────── */}
        <div>
          <h2 className="font-body font-bold text-night text-xl mb-3">
            📊 Buchstaben-Übersicht
          </h2>
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="grid grid-cols-7 gap-1">
              {ARABIC_LETTERS.map((arabic, index) => {
                const letterId = index + 1
                const progress = getLetterProgress(letterId)
                const letter   = letters.find(l => l.id === letterId)

                if (!progress.unlocked) {
                  return (
                    <div
                      key={letterId}
                      className="aspect-square rounded-lg bg-night/5 flex items-center justify-center"
                    >
                      <span className="text-night/20 text-xs">🔒</span>
                    </div>
                  )
                }

                return (
                  <button
                    key={letterId}
                    onClick={() => navigate(`/letter/${letterId}`)}
                    className={`
                      aspect-square rounded-lg flex flex-col items-center justify-center
                      transition-all active:scale-95
                      ${progress.mastered
                        ? 'bg-success/15 border border-success/30'
                        : 'bg-cream-dark border border-gold/20'
                      }
                    `}
                  >
                    <span
                      className="font-arabic text-xl leading-none"
                      style={{ color: letter?.color ?? '#1A6B6B' }}
                    >
                      {arabic}
                    </span>
                    {progress.tracing_stars > 0 && (
                      <span className="text-[8px] text-gold">
                        {'⭐'.repeat(progress.tracing_stars)}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Legend */}
            <div className="flex gap-4 justify-center mt-3 pt-3 border-t border-night/10">
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded bg-success/15 border border-success/30" />
                <span className="font-body text-night/50 text-xs">Gemeistert</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded bg-cream-dark border border-gold/20" />
                <span className="font-body text-night/50 text-xs">In Bearbeitung</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded bg-night/5" />
                <span className="font-body text-night/50 text-xs">Gesperrt</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Islamic quote ────────────────────────────────── */}
        <div className="bg-teal/10 border border-teal/20 rounded-2xl p-5 text-center">
          <p className="font-arabic text-teal text-xl mb-1">
            ﴿ اقْرَأْ بِاسْمِ رَبِّكَ ﴾
          </p>
          <p className="font-body text-night/60 text-sm">
            "Lies im Namen deines Herrn" — Sure Al-Alaq 96:1
          </p>
        </div>

      </div>
    </div>
  )
}
