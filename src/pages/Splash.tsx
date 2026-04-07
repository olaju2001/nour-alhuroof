import { useState } from 'react'
import { useProgress } from '../hooks/useProgress'
import { IslamicBackground, CrescentMoon } from '../components/IslamicBackground'

const AVATARS = [
  { id: 1, emoji: '🧒', name: 'Nour' },
  { id: 2, emoji: '👦', name: 'Bilal' },
  { id: 3, emoji: '🌙', name: 'Luna' },
  { id: 4, emoji: '🦜', name: 'Hudhud' },
  { id: 5, emoji: '⭐', name: 'Najm' },
  { id: 6, emoji: '🌺', name: 'Wardah' },
]

interface Props {
  onComplete: () => void
}

export function Splash({ onComplete }: Props) {
  const { createProfile } = useProgress()
  const [name,       setName]       = useState('')
  const [avatarId,   setAvatarId]   = useState<number | null>(null)
  const [step,       setStep]       = useState<'welcome' | 'name' | 'avatar'>('welcome')

  const handleStart = () => {
    if (!name.trim() || !avatarId) return
    createProfile(name.trim(), avatarId)
    onComplete()
  }

  return (
    <div className="min-h-dvh bg-gradient-to-b from-teal to-teal-dark relative flex flex-col items-center justify-center p-6 overflow-hidden">
      <IslamicBackground variant="full" />

      {/* ── Welcome step ── */}
      {step === 'welcome' && (
        <div className="relative z-10 flex flex-col items-center gap-6 animate-fade-up text-center">
          <div className="animate-float">
            <CrescentMoon size={80} color="#D4A017" />
          </div>

          <div>
            <h1 className="font-arabic text-5xl text-gold font-bold mb-2">
              نور الحروف
            </h1>
            <p className="font-body text-cream/90 text-xl font-semibold">
              Lerne die arabischen Buchstaben!
            </p>
            <p className="font-arabic text-cream/70 text-lg mt-1 dir-rtl">
              تعلّم الحروف العربية
            </p>
          </div>

          {/* Mascot characters */}
          <div className="flex gap-4 text-6xl">
            {['🧒', '🦜', '👦'].map((e, i) => (
              <span
                key={i}
                className="animate-float"
                style={{ animationDelay: `${i * 0.3}s` }}
              >
                {e}
              </span>
            ))}
          </div>

          <button
            onClick={() => setStep('name')}
            className="btn-kid bg-gold text-night text-2xl w-full max-w-xs"
          >
            Starten! 🚀
          </button>

          {/* Stars decoration */}
          <div className="flex gap-2 text-gold/50 text-2xl">
            ✦ بِسْمِ اللَّهِ ✦
          </div>
        </div>
      )}

      {/* ── Name step ── */}
      {step === 'name' && (
        <div className="relative z-10 flex flex-col items-center gap-6 w-full max-w-sm animate-fade-up">
          <div className="text-6xl animate-bounce">👤</div>

          <div className="text-center">
            <h2 className="font-body text-cream text-2xl font-bold">
              Wie heißt du?
            </h2>
            <p className="font-arabic text-gold text-xl mt-1">ما اسمك؟</p>
          </div>

          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Dein Name..."
            maxLength={20}
            className="
              w-full text-center text-2xl font-body font-bold
              bg-white/90 rounded-2xl px-6 py-4 border-4 border-gold/40
              text-night outline-none focus:border-gold
              transition-colors duration-200
            "
            autoFocus
          />

          <button
            onClick={() => name.trim() && setStep('avatar')}
            disabled={!name.trim()}
            className={`btn-kid w-full text-2xl ${
              name.trim()
                ? 'bg-gold text-night'
                : 'bg-white/20 text-white/50 cursor-not-allowed'
            }`}
          >
            Weiter →
          </button>
        </div>
      )}

      {/* ── Avatar step ── */}
      {step === 'avatar' && (
        <div className="relative z-10 flex flex-col items-center gap-6 w-full max-w-sm animate-fade-up">
          <div className="text-center">
            <h2 className="font-body text-cream text-2xl font-bold">
              Hallo, {name}! 👋
            </h2>
            <p className="font-body text-cream/80 text-lg">
              Wähle deinen Charakter:
            </p>
            <p className="font-arabic text-gold text-lg">اختر شخصيتك</p>
          </div>

          <div className="grid grid-cols-3 gap-4 w-full">
            {AVATARS.map(avatar => (
              <button
                key={avatar.id}
                onClick={() => setAvatarId(avatar.id)}
                className={`
                  flex flex-col items-center gap-1 p-4 rounded-2xl
                  transition-all duration-200 border-4
                  ${avatarId === avatar.id
                    ? 'border-gold bg-gold/20 scale-110'
                    : 'border-white/20 bg-white/10 hover:border-white/40'
                  }
                `}
              >
                <span className="text-4xl">{avatar.emoji}</span>
                <span className="font-body text-cream text-sm font-semibold">
                  {avatar.name}
                </span>
              </button>
            ))}
          </div>

          <button
            onClick={handleStart}
            disabled={!avatarId}
            className={`btn-kid w-full text-2xl ${
              avatarId
                ? 'bg-gold text-night'
                : 'bg-white/20 text-white/50 cursor-not-allowed'
            }`}
          >
            Los geht's! 🌟
          </button>
        </div>
      )}
    </div>
  )
}
