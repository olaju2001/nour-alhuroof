import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useLetters }     from '../hooks/useLetters'
import { useProgress }    from '../hooks/useProgress'
import { useAudio }       from '../hooks/useAudio'
import { TracingCanvas }  from '../components/TracingCanvas'
import { IslamicBackground, StarsRow } from '../components/IslamicBackground'
import messagesData from '../data/messages.json'

const pickRandom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

export function TracingPage() {
  const { id }   = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getLetter }      = useLetters()
  const { completeTracing, isLetterUnlocked } = useProgress()
  const { playSfx }        = useAudio()

  const letterId = Number(id)
  const letter   = getLetter(letterId)

  const [stars,     setStars]     = useState(0)
  const [completed, setCompleted] = useState(false)
  const [message,   setMessage]   = useState<{ arabic: string; german: string } | null>(null)

  if (!letter || !isLetterUnlocked(letterId)) {
    navigate('/')
    return null
  }

  const handleTracingComplete = async (earnedStars: number) => {
    setStars(earnedStars)
    setCompleted(true)
    completeTracing(letterId, earnedStars)

    if (earnedStars >= 2) {
      await playSfx('stars')
      setMessage(pickRandom(messagesData.tracing_good))
    } else {
      setMessage(pickRandom(messagesData.tracing_try_again))
    }
  }

  return (
    <div className="min-h-dvh bg-cream flex flex-col relative">
      <IslamicBackground variant="top" />

      {/* ── Top bar ─────────────────────────────────────────── */}
      <div className="relative z-10 flex items-center justify-between px-5 py-4 bg-gradient-to-r from-teal to-teal-dark">
        <button
          onClick={() => navigate(`/vocabulary/${letterId}`)}
          className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-xl text-white active:scale-95"
        >
          ←
        </button>
        <div className="text-center">
          <p className="font-body text-white/80 text-sm">Buchstabe schreiben</p>
          <p className="font-arabic text-gold text-3xl leading-none">{letter.arabic}</p>
        </div>
        <div className="w-12" />
      </div>

      {/* ── Content ─────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center px-5 pt-5 pb-8 gap-5">

        {/* Letter name reminder */}
        <div className="flex items-center gap-4 bg-white rounded-2xl px-6 py-3 shadow-sm w-full justify-center">
          <span
            className="font-arabic text-5xl leading-none"
            style={{ color: letter.color }}
          >
            {letter.arabic}
          </span>
          <div>
            <p className="font-arabic text-xl text-night font-bold">{letter.name_arabic}</p>
            <p className="font-body text-night/50 text-base">{letter.name_german}</p>
          </div>
        </div>

        {/* Tracing canvas */}
        <TracingCanvas letter={letter} onComplete={handleTracingComplete} />

        {/* Completion message */}
        {completed && message && (
          <div className="bg-white rounded-2xl p-4 shadow-md w-full text-center animate-bounce-in">
            <p className="font-arabic text-2xl text-teal mb-1">{message.arabic}</p>
            <p className="font-body text-night/70 text-lg">{message.german}</p>
            <div className="mt-3">
              <StarsRow count={stars} size={36} />
            </div>
          </div>
        )}

        {/* Stars summary */}
        {completed && (
          <div className="w-full">
            <p className="font-body text-center text-night/50 text-sm mb-3">
              {stars === 3 ? '🌟 Perfekt! Alle 3 Sterne!' : stars === 2 ? '⭐ Gut gemacht!' : '✨ Weiter üben!'}
            </p>
            <button
              onClick={() => navigate(`/game/${letterId}`)}
              className="btn-kid w-full bg-gold text-night text-xl"
            >
              Weiter: Spiel 🎮 →
            </button>

            {/* Retry option */}
            {stars < 3 && (
              <button
                onClick={() => {
                  setCompleted(false)
                  setStars(0)
                  setMessage(null)
                }}
                className="btn-kid w-full bg-white border-2 border-teal text-teal text-lg mt-3"
              >
                🔄 Nochmal versuchen
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
