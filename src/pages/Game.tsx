import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useLetters }  from '../hooks/useLetters'
import { useProgress } from '../hooks/useProgress'
import { useAudio }    from '../hooks/useAudio'
import { IslamicBackground, StarsRow } from '../components/IslamicBackground'
import messagesData from '../data/messages.json'
import type { Letter } from '../types'

const pickRandom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]
const shuffle    = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5)

// ── Game 1: Letter Tap ────────────────────────────────────────────
// Show 4 letters, tap the correct one
function LetterTapGame({
  letter, distractors, onResult
}: {
  letter: Letter
  distractors: Letter[]
  onResult: (correct: boolean) => void
}) {
  const options   = shuffle([letter, ...distractors.slice(0, 3)])
  const [chosen,  setChosen]  = useState<number | null>(null)
  const { playLetterName } = useAudio()

  const handleTap = (id: number) => {
    if (chosen !== null) return
    setChosen(id)
    setTimeout(() => onResult(id === letter.id), 800)
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div className="bg-teal/10 rounded-2xl p-5 text-center w-full">
        <p className="font-body text-teal font-bold text-lg mb-1">
          Tippe auf den richtigen Buchstaben:
        </p>
        <p className="font-arabic text-3xl text-night font-bold">{letter.name_arabic}</p>
        <p className="font-body text-night/60">{letter.name_german}</p>
      </div>

      <button
        onClick={() => playLetterName(letter.audio.name, letter.name_arabic)}
        className="btn-kid bg-teal text-white text-lg px-8"
      >
        🔊 Nochmal hören
      </button>

      <div className="grid grid-cols-2 gap-4 w-full">
        {options.map((opt) => {
          const isCorrect  = opt.id === letter.id
          const isChosen   = chosen === opt.id
          const showResult = chosen !== null

          return (
            <button
              key={opt.id}
              onClick={() => handleTap(opt.id)}
              className={`
                flex flex-col items-center justify-center
                rounded-3xl aspect-square text-center
                transition-all duration-300 border-4
                ${!showResult ? 'bg-white border-gold/20 shadow-lg active:scale-95' : ''}
                ${showResult && isCorrect  ? 'bg-success/20 border-success scale-105' : ''}
                ${showResult && isChosen && !isCorrect ? 'bg-rose/20 border-rose' : ''}
                ${showResult && !isChosen && !isCorrect ? 'bg-white border-gold/20 opacity-50' : ''}
              `}
            >
              <span
                className="font-arabic leading-none"
                className="game-letter" style={{ color: opt.color }}
              >
                {opt.arabic}
              </span>
              <span className="font-body text-night/50 text-sm mt-1">
                {opt.name_german}
              </span>
              {showResult && isCorrect && <span className="text-2xl mt-1">✅</span>}
              {showResult && isChosen && !isCorrect && <span className="text-2xl mt-1">❌</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Game 2: Word Match ────────────────────────────────────────────
// Show a word, tap the correct emoji/image
function WordMatchGame({
  letter, onResult
}: {
  letter: Letter
  onResult: (correct: boolean) => void
}) {
  const [target]  = useState(() => pickRandom(letter.vocabulary))
  const options   = shuffle(letter.vocabulary)
  const [chosen,  setChosen] = useState<string | null>(null)
  const { playWord } = useAudio()

  useEffect(() => {
    // Auto-play the word when game starts
    playWord(target.audio, target.word)
  }, []) // eslint-disable-line

  const handleTap = (wordId: string) => {
    if (chosen !== null) return
    setChosen(wordId)
    setTimeout(() => onResult(wordId === target.id), 800)
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div className="bg-gold/10 rounded-2xl p-5 text-center w-full">
        <p className="font-body text-teal font-bold text-lg mb-2">
          Welches Bild passt zum Wort?
        </p>
        <p className="font-arabic text-4xl text-night font-bold">{target.word}</p>
        <p className="font-body text-night/50 text-lg">{target.transliteration}</p>
      </div>

      <button
        onClick={() => playWord(target.audio, target.word)}
        className="btn-kid bg-teal text-white text-lg px-8"
      >
        🔊 Wort nochmal hören
      </button>

      <div className="grid grid-cols-3 gap-3 w-full">
        {options.map((word) => {
          const isCorrect  = word.id === target.id
          const isChosen   = chosen === word.id
          const showResult = chosen !== null

          return (
            <button
              key={word.id}
              onClick={() => handleTap(word.id)}
              className={`
                flex flex-col items-center justify-center
                rounded-2xl p-4 aspect-square
                transition-all duration-300 border-4
                ${!showResult ? 'bg-white border-gold/20 shadow-md active:scale-95' : ''}
                ${showResult && isCorrect  ? 'bg-success/20 border-success scale-105' : ''}
                ${showResult && isChosen && !isCorrect ? 'bg-rose/20 border-rose' : ''}
                ${showResult && !isChosen && !isCorrect ? 'opacity-40' : ''}
              `}
            >
              <span className="text-5xl">{word.emoji}</span>
              <span className="font-body text-night/50 text-xs mt-1">{word.german}</span>
              {showResult && isCorrect  && <span className="text-lg">✅</span>}
              {showResult && isChosen && !isCorrect && <span className="text-lg">❌</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Game 3: Listen & Find ─────────────────────────────────────────
// Hear a letter name, tap the correct Arabic letter from 4 options
function ListenFindGame({
  letter, distractors, onResult
}: {
  letter: Letter
  distractors: Letter[]
  onResult: (correct: boolean) => void
}) {
  const options  = shuffle([letter, ...distractors.slice(0, 3)])
  const [chosen, setChosen] = useState<number | null>(null)
  const { playLetterName }  = useAudio()

  useEffect(() => {
    playLetterName(letter.audio.name, letter.name_arabic)
  }, []) // eslint-disable-line

  const handleTap = (id: number) => {
    if (chosen !== null) return
    setChosen(id)
    setTimeout(() => onResult(id === letter.id), 800)
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div className="bg-teal/10 rounded-2xl p-5 text-center w-full">
        <p className="font-body text-teal font-bold text-lg">
          Hör zu und tippe auf den richtigen Buchstaben:
        </p>
      </div>

      <button
        onClick={() => playLetterName(letter.audio.name, letter.name_arabic)}
        className="btn-kid bg-gold text-night text-2xl px-10 animate-bounce"
      >
        🔊 Hör zu!
      </button>

      <div className="grid grid-cols-2 gap-4 w-full">
        {options.map((opt) => {
          const isCorrect  = opt.id === letter.id
          const isChosen   = chosen === opt.id
          const showResult = chosen !== null

          return (
            <button
              key={opt.id}
              onClick={() => handleTap(opt.id)}
              className={`
                flex items-center justify-center rounded-3xl
                h-28 transition-all duration-300 border-4
                ${!showResult ? 'bg-white border-gold/20 shadow-lg active:scale-95' : ''}
                ${showResult && isCorrect  ? 'bg-success/20 border-success scale-105' : ''}
                ${showResult && isChosen && !isCorrect ? 'bg-rose/20 border-rose' : ''}
                ${showResult && !isChosen && !isCorrect ? 'opacity-40' : ''}
              `}
            >
              <span
                className="font-arabic leading-none"
                className="game-letter" style={{ color: opt.color }}
              >
                {opt.arabic}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Main Game Page ────────────────────────────────────────────────
const GAME_SEQUENCE = ['letter_tap', 'word_match', 'listen_find'] as const
type GameType = typeof GAME_SEQUENCE[number]

export function GamePage() {
  const { id }   = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getLetter, getRandomLetters } = useLetters()
  const { completeGame, isLetterUnlocked } = useProgress()
  const { playSfx } = useAudio()

  const letterId    = Number(id)
  const letter      = getLetter(letterId)
  const distractors = getRandomLetters(letterId, 3)

  const [gameIndex,  setGameIndex]  = useState(0)
  const [score,      setScore]      = useState(0)     // correct answers
  const [results,    setResults]    = useState<boolean[]>([])
  const [finished,   setFinished]   = useState(false)
  const [message,    setMessage]    = useState<{ arabic: string; german: string } | null>(null)

  if (!letter || !isLetterUnlocked(letterId)) {
    navigate('/')
    return null
  }

  const currentGame: GameType = GAME_SEQUENCE[gameIndex]

  const handleResult = useCallback(async (correct: boolean) => {
    const newResults = [...results, correct]
    setResults(newResults)

    if (correct) {
      await playSfx('correct')
      setScore(s => s + 1)
    } else {
      await playSfx('wrong')
    }

    const nextIndex = gameIndex + 1

    if (nextIndex >= GAME_SEQUENCE.length) {
      // All games done
      const finalScore = newResults.filter(Boolean).length
      const pct        = Math.round((finalScore / GAME_SEQUENCE.length) * 100)
      const stars      = finalScore === 3 ? 3 : finalScore === 2 ? 2 : 1

      completeGame(letterId, pct, stars)
      await playSfx('stars')
      setMessage(pickRandom(messagesData.game_won))
      setFinished(true)
    } else {
      setTimeout(() => setGameIndex(nextIndex), 500)
    }
  }, [gameIndex, results, letterId, completeGame, playSfx])

  const finalStars = score === 3 ? 3 : score === 2 ? 2 : 1

  return (
    <div className="min-h-dvh bg-cream flex flex-col relative">
      <IslamicBackground variant="top" />

      {/* ── Top bar ─────────────────────────────────────────── */}
      <div className="relative z-10 flex items-center justify-between px-5 py-4 bg-gradient-to-r from-night to-teal-dark">
        <button
          onClick={() => navigate(`/tracing/${letterId}`)}
          className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-xl text-white active:scale-95"
        >
          ←
        </button>
        <div className="text-center">
          <p className="font-body text-white/80 text-sm">Spiel 🎮</p>
          <p className="font-arabic text-gold text-3xl leading-none">{letter.arabic}</p>
        </div>
        {/* Progress dots */}
        <div className="flex gap-1">
          {GAME_SEQUENCE.map((_, i) => (
            <div
              key={i}
              className={`
                h-2 rounded-full transition-all duration-300
                ${i < gameIndex || finished
                  ? results[i] ? 'w-5 bg-success' : 'w-5 bg-rose'
                  : i === gameIndex
                  ? 'w-5 bg-gold animate-pulse'
                  : 'w-2 bg-white/30'
                }
              `}
            />
          ))}
        </div>
      </div>

      {/* ── Game area ────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center px-5 pt-6 pb-8 gap-4">

        {/* Game label */}
        {!finished && (
          <div className="flex items-center gap-2 self-start">
            <span className="bg-teal text-white font-body text-sm font-bold px-3 py-1 rounded-full">
              Spiel {gameIndex + 1} / {GAME_SEQUENCE.length}
            </span>
            <span className="text-night/40 font-body text-sm">
              {currentGame === 'letter_tap'  ? '👁️ Buchstabe finden' :
               currentGame === 'word_match'  ? '🔊 Wort zuordnen' :
                                               '👂 Hören & finden'}
            </span>
          </div>
        )}

        {/* Active game */}
        {!finished && currentGame === 'letter_tap' && (
          <LetterTapGame
            key={`tap-${gameIndex}`}
            letter={letter}
            distractors={distractors}
            onResult={handleResult}
          />
        )}
        {!finished && currentGame === 'word_match' && (
          <WordMatchGame
            key={`word-${gameIndex}`}
            letter={letter}
            onResult={handleResult}
          />
        )}
        {!finished && currentGame === 'listen_find' && (
          <ListenFindGame
            key={`listen-${gameIndex}`}
            letter={letter}
            distractors={distractors}
            onResult={handleResult}
          />
        )}

        {/* ── Finished screen ──────────────────────────────── */}
        {finished && (
          <div className="flex flex-col items-center gap-5 w-full animate-bounce-in">
            <div className="text-6xl">
              {score === 3 ? '🏆' : score === 2 ? '🌟' : '💪'}
            </div>

            <StarsRow count={finalStars} size={44} />

            <div className="bg-white rounded-2xl p-5 shadow-md w-full text-center">
              <p className="font-arabic text-2xl text-teal mb-1">{message?.arabic}</p>
              <p className="font-body text-night/70 text-lg">{message?.german}</p>
              <p className="font-body text-night/40 text-sm mt-2">
                {score} / {GAME_SEQUENCE.length} richtig
              </p>
            </div>

            {/* Results breakdown */}
            <div className="flex gap-3 justify-center">
              {results.map((correct, i) => (
                <div
                  key={i}
                  className={`
                    w-12 h-12 rounded-xl flex items-center justify-center text-xl
                    ${correct ? 'bg-success/20 text-success' : 'bg-rose/20 text-rose'}
                  `}
                >
                  {correct ? '✓' : '✗'}
                </div>
              ))}
            </div>

            {/* Navigation */}
            <button
              onClick={() => navigate('/')}
              className="btn-kid w-full bg-gold text-night text-xl"
            >
              🏠 Zurück zur Hauptseite
            </button>

            {/* Next letter if available */}
            {letterId < 28 && (
              <button
                onClick={() => navigate(`/letter/${letterId + 1}`)}
                className="btn-kid w-full bg-teal text-white text-xl"
              >
                Nächster Buchstabe →
              </button>
            )}

            {/* Retry */}
            <button
              onClick={() => {
                setGameIndex(0)
                setScore(0)
                setResults([])
                setFinished(false)
                setMessage(null)
              }}
              className="btn-kid w-full bg-white border-2 border-teal text-teal text-lg"
            >
              🔄 Nochmal spielen
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
