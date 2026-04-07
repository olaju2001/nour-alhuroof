import { useNavigate } from 'react-router-dom'
import { useProgress }  from '../hooks/useProgress'
import { useLetters }   from '../hooks/useLetters'
import { IslamicBackground, CrescentMoon, StarIcon } from '../components/IslamicBackground'
import { useState, useEffect } from 'react'

const AVATARS: Record<number, string> = {
  1: '🧒', 2: '👦', 3: '🌙', 4: '🦜', 5: '⭐', 6: '🌺'
}

const ARABIC_LETTERS = [
  'ا','ب','ت','ث','ج','ح','خ','د','ذ','ر',
  'ز','س','ش','ص','ض','ط','ظ','ع','غ','ف',
  'ق','ك','ل','م','ن','ه','و','ي'
]

export function Home() {
  const navigate = useNavigate()
  const { profile, getLetterProgress, isLetterUnlocked, masteredCount } = useProgress()
  const { letters } = useLetters()

  // ── PWA Install logic ─────────────────────────────────────────
  const [installPrompt, setInstallPrompt] = useState<any>(null)
  const [showInstallTip, setShowInstallTip] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if already running as installed PWA
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
    }

    // Capture Chrome/Android native install prompt
    const handler = (e: any) => {
      e.preventDefault()
      setInstallPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (installPrompt) {
      // Chrome/Android — trigger native prompt
      installPrompt.prompt()
      await installPrompt.userChoice
      setInstallPrompt(null)
    } else {
      // Edge, Safari, Firefox — show manual instructions
      setShowInstallTip(true)
    }
  }

  if (!profile) return null

  const avatar     = AVATARS[profile.avatar_id] ?? '🌟'
  const totalStars = profile.total_stars

  return (
    <div className="min-h-dvh bg-cream relative pb-8">
      <IslamicBackground variant="top" />

      {/* ── Header ────────────────────────────────────────────── */}
      <div className="relative z-10 bg-teal pt-safe px-5 pb-6 rounded-b-[2rem] shadow-xl">
        <div className="flex items-center justify-between mb-4">

          {/* Greeting */}
          <div>
            <p className="font-body text-cream/70 text-sm">السلام عليكم!</p>
            <h1 className="font-body text-cream font-bold text-2xl">
              {avatar} {profile.name}
            </h1>
          </div>

          {/* Stars — tap to open Rewards */}
          <button
            onClick={() => navigate('/rewards')}
            className="flex items-center gap-1 bg-gold/20 rounded-2xl px-4 py-2 active:scale-95 transition-transform"
          >
            <span className="text-xl">🏆</span>
            <StarIcon size={22} color="#D4A017" />
            <span className="font-body font-black text-gold text-xl">
              {totalStars}
            </span>
          </button>
        </div>

        {/* Progress bar */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="font-body text-cream/70 text-sm">
              {masteredCount} / 28 Buchstaben gelernt
            </span>
            <span className="font-arabic text-gold text-sm">
              {masteredCount} / ٢٨
            </span>
          </div>
          <div className="h-3 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-gold rounded-full transition-all duration-700"
              style={{ width: `${(masteredCount / 28) * 100}%` }}
            />
          </div>
        </div>

        {/* Install button — hidden if already installed as PWA */}
        {!isInstalled && (
          <button
            onClick={handleInstall}
            className="mt-4 w-full flex items-center justify-center gap-2
                       bg-white/15 hover:bg-white/25 text-cream
                       rounded-2xl py-3 px-4 font-body font-bold text-base
                       active:scale-95 transition-all duration-200 border border-white/20"
          >
            <span className="text-lg">📲</span>
            App auf Gerät installieren
          </button>
        )}
      </div>

      {/* ── Section title ─────────────────────────────────────── */}
      <div className="relative z-10 px-5 mt-6 mb-4 flex items-center justify-between">
        <h2 className="font-body font-bold text-night text-xl">
          Wähle einen Buchstaben:
        </h2>
        <div className="flex items-center gap-1">
          <CrescentMoon size={20} color="#D4A017" opacity={0.7} />
          <span className="font-arabic text-teal text-lg">الحروف</span>
        </div>
      </div>

      {/* ── Letter Grid ───────────────────────────────────────── */}
      <div className="relative z-10 px-4 grid grid-cols-4 gap-3" dir="rtl">
        {ARABIC_LETTERS.map((arabicChar, index) => {
          const letterId = index + 1
          const letter   = letters.find(l => l.id === letterId)
          const unlocked = isLetterUnlocked(letterId)
          const progress = getLetterProgress(letterId)
          const mastered = progress.mastered
          const stars    = progress.tracing_stars

          return (
            <button
              key={letterId}
              onClick={() => unlocked && navigate(`/letter/${letterId}`)}
              disabled={!unlocked}
              className={`
                relative flex flex-col items-center justify-center
                rounded-2xl aspect-square
                transition-all duration-200 select-none border-2
                ${unlocked
                  ? mastered
                    ? 'bg-success/15 border-success shadow-md active:scale-95'
                    : 'bg-white border-gold/30 shadow-md active:scale-95 hover:border-gold'
                  : 'bg-night/5 border-night/10 opacity-50'
                }
              `}
            >
              {/* Lock icon */}
              {!unlocked && (
                <span className="text-xl text-night/30">🔒</span>
              )}

              {/* Arabic letter */}
              {unlocked && (
                <>
                  <span
                    className="letter-grid leading-none"
                    style={{ color: letter?.color ?? '#1A6B6B' }}
                  >
                    {arabicChar}
                  </span>
                  <span className="font-body text-night/50 text-xs mt-1">
                    {letter?.name_german ?? `#${letterId}`}
                  </span>

                  {/* Stars earned */}
                  {stars > 0 && (
                    <div className="absolute top-1 left-1 flex">
                      {Array.from({ length: stars }).map((_, i) => (
                        <span key={i} className="text-gold text-[10px]">⭐</span>
                      ))}
                    </div>
                  )}

                  {/* Mastered checkmark */}
                  {mastered && (
                    <div className="absolute bottom-1 left-1 text-success text-xs">✓</div>
                  )}
                </>
              )}
            </button>
          )
        })}
      </div>

      {/* ── Legend ────────────────────────────────────────────── */}
      <div className="relative z-10 mx-4 mt-6 bg-white rounded-2xl p-4 flex gap-4 justify-center shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-white border-2 border-gold/30" />
          <span className="font-body text-night/60 text-sm">Verfügbar</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-success/15 border-2 border-success" />
          <span className="font-body text-night/60 text-sm">Gelernt ✓</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-night/5 border-2 border-night/10 opacity-50" />
          <span className="font-body text-night/60 text-sm">🔒 Gesperrt</span>
        </div>
      </div>

      <div className="h-8" />

      {/* ── Install Instructions Popup ────────────────────────── */}
      {showInstallTip && (
        <div
          className="fixed inset-0 bg-night/60 z-50 flex items-end justify-center p-4"
          onClick={() => setShowInstallTip(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 w-full max-w-sm animate-bounce-in"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="font-body font-bold text-night text-xl mb-1 text-center">
              📲 App installieren
            </h3>
            <p className="font-body text-night/50 text-sm text-center mb-5">
              Wähle dein Gerät / Browser:
            </p>

            <div className="space-y-3">
              {/* Android Chrome */}
              <div className="bg-cream-dark rounded-2xl p-4">
                <p className="font-body font-bold text-teal mb-1">
                  🤖 Android — Chrome
                </p>
                <p className="font-body text-night/70 text-sm">
                  Tippe auf <strong>⋮</strong> oben rechts →
                  "Zum Startbildschirm hinzufügen"
                </p>
              </div>

              {/* Android Edge */}
              <div className="bg-cream-dark rounded-2xl p-4">
                <p className="font-body font-bold text-teal mb-1">
                  🤖 Android — Edge
                </p>
                <p className="font-body text-night/70 text-sm">
                  Tippe auf <strong>···</strong> unten →
                  "Zum Startbildschirm hinzufügen"
                </p>
              </div>

              {/* iPhone Safari */}
              <div className="bg-cream-dark rounded-2xl p-4">
                <p className="font-body font-bold text-teal mb-1">
                  🍎 iPhone — Safari
                </p>
                <p className="font-body text-night/70 text-sm">
                  Tippe auf <strong>□↑</strong> teilen →
                  "Zum Home-Bildschirm"
                </p>
              </div>

              {/* Tip: use Chrome */}
              <div className="bg-gold/10 border border-gold/30 rounded-2xl p-3">
                <p className="font-body text-night/70 text-sm text-center">
                  💡 <strong>Tipp:</strong> Chrome auf Android gibt die
                  einfachste Installation!
                </p>
              </div>
            </div>

            <button
              className="btn-kid w-full bg-teal text-white mt-5"
              onClick={() => setShowInstallTip(false)}
            >
              Verstanden ✓
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
