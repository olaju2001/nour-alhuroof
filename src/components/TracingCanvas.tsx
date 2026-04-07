import { useRef, useEffect, useState, useCallback } from 'react'
import type { Letter } from '../types'
import { StarsRow } from './IslamicBackground'

interface Props {
  letter: Letter
  onComplete: (stars: number) => void
}

export function TracingCanvas({ letter, onComplete }: Props) {
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const isDrawing  = useRef(false)
  const strokeCount = useRef(0)
  const [attempts, setAttempts] = useState(0)
  const [stars,    setStars]    = useState(0)
  const [done,     setDone]     = useState(false)
  const [showGuide, setShowGuide] = useState(true)

  // Draw the faint guide letter behind the canvas
  const drawGuide = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Guide letter (very light, to trace over)
    ctx.globalAlpha = 0.08
    ctx.fillStyle   = '#1A6B6B'
    ctx.font = `bold ${canvas.width * 0.62}px Lemonada, Noto Naskh Arabic, sans-serif`
    ctx.textAlign   = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(letter.arabic, canvas.width / 2, canvas.height / 2)
    ctx.globalAlpha = 1
  }, [letter.arabic])

  useEffect(() => {
    drawGuide()
  }, [drawGuide])

  // ── Touch / Mouse drawing ──────────────────────────────────────
  const getPos = (e: React.TouchEvent | React.MouseEvent) => {
    const canvas = canvasRef.current!
    const rect   = canvas.getBoundingClientRect()
    const scaleX = canvas.width  / rect.width
    const scaleY = canvas.height / rect.height

    if ('touches' in e) {
      const touch = e.touches[0]
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top)  * scaleY,
      }
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top)  * scaleY,
    }
  }

  const startDraw = (e: React.TouchEvent | React.MouseEvent) => {
    if (done) return
    isDrawing.current = true
    strokeCount.current++
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    const { x, y } = getPos(e)
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDrawing.current || done) return
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    const { x, y } = getPos(e)

    ctx.lineTo(x, y)
    ctx.strokeStyle = '#D4A017'   // Gold tracing color
    ctx.lineWidth   = 12
    ctx.lineCap     = 'round'
    ctx.lineJoin    = 'round'
    ctx.stroke()
  }

  const endDraw = () => {
    isDrawing.current = false
  }

  // ── Clear and retry ───────────────────────────────────────────
  const handleClear = () => {
    setAttempts(a => a + 1)
    drawGuide()
    strokeCount.current = 0
  }

  // ── Done — calculate stars ────────────────────────────────────
  const handleDone = () => {
    // Simple scoring: based on attempts
    // In a real app, you'd do pixel coverage analysis
    let earnedStars = 3
    if (attempts >= 1) earnedStars = 2
    if (attempts >= 3) earnedStars = 1

    setStars(earnedStars)
    setDone(true)
    onComplete(earnedStars)
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* Step guide */}
      {showGuide && (
        <div className="bg-teal/10 border border-teal/20 rounded-2xl p-4 w-full">
          <p className="text-teal font-body font-bold text-center text-lg mb-2">
            Wie schreibe ich {letter.name_german}?
          </p>
          <ol className="space-y-1">
            {letter.tracing.steps.map((step, i) => (
              <li key={i} className="flex gap-2 text-night/80 font-body text-base">
                <span className="font-bold text-gold">{i + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <button
            onClick={() => setShowGuide(false)}
            className="mt-3 w-full btn-kid bg-teal text-white text-base py-2"
          >
            Los geht's! ✏️
          </button>
        </div>
      )}

      {/* Canvas */}
      {!showGuide && (
        <>
          <div className="relative w-full" style={{ maxWidth: 340 }}>
            {/* Decorative border */}
            <div className="absolute inset-0 rounded-3xl border-4 border-gold/40 pointer-events-none z-10" />

            <canvas
              ref={canvasRef}
              width={340}
              height={300}
              className="w-full rounded-3xl bg-cream-dark touch-none"
              style={{ fontFamily: "'Lemonada', 'Noto Naskh Arabic', sans-serif" }}
              onMouseDown={startDraw}
              onMouseMove={draw}
              onMouseUp={endDraw}
              onMouseLeave={endDraw}
              onTouchStart={startDraw}
              onTouchMove={draw}
              onTouchEnd={endDraw}
            />

            {/* Tracing hint overlay (first draw) */}
            {attempts === 0 && strokeCount.current === 0 && (
              <div className="absolute inset-0 flex items-end justify-center pb-4 pointer-events-none">
                <p className="text-night/40 font-body text-sm animate-bounce">
                  👆 Mit dem Finger nachzeichnen
                </p>
              </div>
            )}
          </div>

          {/* Done screen */}
          {done ? (
            <div className="flex flex-col items-center gap-3 animate-bounce-in">
              <p className="font-arabic text-2xl text-teal font-bold">ماشاء الله! 🎉</p>
              <StarsRow count={stars} size={40} />
              <p className="font-body text-night/70 text-lg">
                {stars === 3 ? 'Perfekt!' : stars === 2 ? 'Sehr gut!' : 'Gut gemacht!'}
              </p>
            </div>
          ) : (
            /* Controls */
            <div className="flex gap-3 w-full">
              <button
                onClick={handleClear}
                className="btn-kid flex-1 bg-cream-dark text-night text-lg border-2 border-gold/30"
              >
                🔄 Nochmal
              </button>
              <button
                onClick={handleDone}
                className="btn-kid flex-1 bg-success text-white text-lg"
              >
                ✓ Fertig!
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
