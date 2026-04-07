import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useLetters }  from '../hooks/useLetters'
import { useProgress } from '../hooks/useProgress'
import { useAudio }    from '../hooks/useAudio'
import { IslamicBackground, IslamicDivider } from '../components/IslamicBackground'

export function VocabularyPage() {
  const { id }   = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getLetter }       = useLetters()
  const { completeVocabulary, isLetterUnlocked } = useProgress()
  const { playWord, playSfx } = useAudio()

  const letterId = Number(id)
  const letter   = getLetter(letterId)

  const [heard,    setHeard]    = useState<Set<string>>(new Set())
  const [tapped,   setTapped]   = useState<string | null>(null)
  const [allDone,  setAllDone]  = useState(false)

  if (!letter || !isLetterUnlocked(letterId)) {
    navigate('/')
    return null
  }

  const handleWordTap = async (wordId: string, audioSrc: string, arabicWord: string) => {
    setTapped(wordId)
    await playWord(audioSrc, arabicWord)
    await playSfx('correct')

    const newHeard = new Set(heard).add(wordId)
    setHeard(newHeard)

    // All 3 words heard → enable continue
    if (newHeard.size === letter.vocabulary.length) {
      setAllDone(true)
    }
    setTimeout(() => setTapped(null), 600)
  }

  const handleContinue = () => {
    completeVocabulary(letterId)
    navigate(`/tracing/${letterId}`)
  }

  return (
    <div className="min-h-dvh bg-cream flex flex-col relative">
      <IslamicBackground variant="top" />

      {/* ── Top bar ─────────────────────────────────────────── */}
      <div className="relative z-10 flex items-center justify-between px-5 py-4 bg-teal">
        <button
          onClick={() => navigate(`/letter/${letterId}`)}
          className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-xl text-white active:scale-95"
        >
          ←
        </button>
        <div className="text-center">
          <p className="font-body text-white/80 text-sm">Wörter mit</p>
          <p className="font-arabic text-gold text-3xl leading-none">{letter.arabic}</p>
        </div>
        <div className="w-12" />
      </div>

      {/* ── Content ─────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center px-5 pt-6 pb-8 gap-4">

        <p className="font-body text-night/60 text-center text-base">
          Tippe auf jedes Bild um das Wort zu hören! 👆
        </p>
        <p className="font-arabic text-teal text-center text-lg">
          اضغط على كل صورة لتسمع الكلمة
        </p>

        <IslamicDivider className="w-full" />

        {/* Word cards */}
        <div className="flex flex-col gap-4 w-full">
          {letter.vocabulary.map((word) => {
            const isHeard   = heard.has(word.id)
            const isTapped  = tapped === word.id

            return (
              <button
                key={word.id}
                onClick={() => handleWordTap(word.id, word.audio, word.word)}
                className={`
                  card-kid w-full flex items-center gap-5 p-5
                  transition-all duration-200
                  ${isTapped  ? 'scale-95 bg-gold/20 border-2 border-gold' : ''}
                  ${isHeard   ? 'bg-success/10 border-2 border-success shadow-md'
                              : 'bg-white border-2 border-transparent shadow-md'}
                `}
              >
                {/* Emoji (placeholder until real images) */}
                <div className={`
                  text-6xl w-20 h-20 flex items-center justify-center
                  rounded-2xl transition-transform duration-200
                  ${isTapped ? 'scale-110 animate-wiggle' : ''}
                  ${isHeard ? 'bg-success/10' : 'bg-cream-dark'}
                `}>
                  {word.emoji}
                </div>

                {/* Word info */}
                <div className="flex-1 text-right" dir="rtl">
                  <p className="vocab-arabic text-night mb-1">
                    {word.word}
                  </p>
                  <p className="font-body text-night/50 text-base">
                    {word.transliteration}
                  </p>
                  <p className="font-body text-teal text-lg font-semibold">
                    🇩🇪 {word.german}
                  </p>
                </div>

                {/* Heard checkmark */}
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-xl
                  transition-all duration-300
                  ${isHeard ? 'bg-success text-white' : 'bg-cream-dark text-night/30'}
                `}>
                  {isHeard ? '✓' : '🔈'}
                </div>
              </button>
            )
          })}
        </div>

        {/* Progress dots */}
        <div className="flex gap-2 my-2">
          {letter.vocabulary.map((word) => (
            <div
              key={word.id}
              className={`
                h-3 rounded-full transition-all duration-300
                ${heard.has(word.id) ? 'w-8 bg-success' : 'w-3 bg-night/20'}
              `}
            />
          ))}
        </div>

        {/* Hint if not all heard */}
        {!allDone && (
          <p className="font-body text-night/40 text-center text-sm">
            Tippe auf alle {letter.vocabulary.length} Wörter! ({heard.size}/{letter.vocabulary.length})
          </p>
        )}

        {/* Continue button — enabled after all words heard */}
        <button
          onClick={handleContinue}
          disabled={!allDone}
          className={`
            btn-kid w-full text-xl mt-2
            ${allDone
              ? 'bg-gold text-night animate-bounce-in'
              : 'bg-night/10 text-night/30 cursor-not-allowed shadow-none'}
          `}
        >
          {allDone ? 'Weiter: Schreiben ✏️ →' : `Noch ${letter.vocabulary.length - heard.size} Wörter... 👂`}
        </button>
      </div>
    </div>
  )
}
