import { useParams, useNavigate } from 'react-router-dom'
import { useLetters }   from '../hooks/useLetters'
import { useProgress }  from '../hooks/useProgress'
import { AudioButton }  from '../components/AudioButton'
import { IslamicBackground, IslamicDivider } from '../components/IslamicBackground'
import { useEffect }    from 'react'

export function LetterPage() {
  const { id }     = useParams<{ id: string }>()
  const navigate   = useNavigate()
  const { getLetter } = useLetters()
  const { completeRecognition, isLetterUnlocked } = useProgress()

  const letterId = Number(id)
  const letter   = getLetter(letterId)

  useEffect(() => {
    if (letter) completeRecognition(letterId)
  }, [letterId]) // eslint-disable-line

  if (!letter || !isLetterUnlocked(letterId)) {
    navigate('/')
    return null
  }

  return (
    <div className="min-h-dvh bg-cream flex flex-col relative">
      <IslamicBackground variant="top" />

      {/* ── Top bar ───────────────────────────────────────────── */}
      <div
        className="relative z-10 flex items-center justify-between px-5 py-4"
        style={{ background: `linear-gradient(135deg, ${letter.color}22, ${letter.color}11)` }}
      >
        <button
          onClick={() => navigate('/')}
          className="w-14 h-14 rounded-2xl bg-white/80 flex items-center justify-center text-2xl shadow-sm active:scale-95"
        >
          ←
        </button>
        <span className="font-body font-bold text-night/70 text-lg">
          Buchstabe {letterId} / 28
        </span>
        <div className="w-14" />
      </div>

      {/* ── Main content ─────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center px-6 pt-4 pb-8 flex-1">

        {/* Letter name — big and clear */}
        <div className="text-center mb-3">
          <p
            className="letter-name-arabic animate-bounce-in"
            style={{ color: letter.color }}
          >
            {letter.name_arabic}
          </p>
          <p className="font-body text-night/60 font-bold mt-1" style={{ fontSize: 26 }}>
            {letter.name_german}
          </p>
          <p className="font-body text-night/40 mt-1" style={{ fontSize: 18 }}>
            Ähnlich wie: <strong>{letter.similar_to}</strong>
          </p>
        </div>

        {/* THE BIG LETTER */}
        <div
          className="letter-display animate-bounce-in text-center mb-3"
          style={{ color: letter.color }}
        >
          {letter.arabic}
        </div>

        {/* Memory trick */}
        <div className="bg-gold/10 border-2 border-gold/30 rounded-2xl px-5 py-4 mb-4 text-center w-full">
          <p className="font-body text-night/80" style={{ fontSize: 20 }}>
            💡 {letter.memory_trick}
          </p>
        </div>

        {/* Pronunciation guide */}
        <div className="bg-teal/5 border-2 border-teal/20 rounded-2xl px-5 py-4 mb-5 text-center w-full">
          <p className="font-body text-teal font-bold mb-1" style={{ fontSize: 16 }}>
            Aussprache:
          </p>
          <p className="font-body text-night/80" style={{ fontSize: 20 }}>
            {letter.pronunciation_guide}
          </p>
        </div>

        {/* Audio buttons */}
        <AudioButton
          src={letter.audio.name}
          ttsText={letter.name_arabic}
          label={`Hör zu: ${letter.name_german} 🔊`}
          size="lg"
          variant="primary"
          className="w-full mb-3"
        />
        <AudioButton
          src={letter.audio.pronunciation}
          ttsText={letter.arabic}
          label="Aussprache hören 🔈"
          size="md"
          variant="secondary"
          className="w-full mb-6"
        />

        <IslamicDivider className="w-full mb-5" />

        {/* 4 forms — bigger letters in each card */}
        <div className="w-full mb-6">
          <p className="font-body font-bold text-night/70 text-center mb-3" style={{ fontSize: 20 }}>
            Der Buchstabe in verschiedenen Formen:
          </p>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'Allein',  form: letter.forms.isolated, labelAr: 'مفرد' },
              { label: 'Anfang',  form: letter.forms.initial,  labelAr: 'أول'  },
              { label: 'Mitte',   form: letter.forms.medial,   labelAr: 'وسط'  },
              { label: 'Ende',    form: letter.forms.final,    labelAr: 'آخر'  },
            ].map(({ label, form, labelAr }) => (
              <div
                key={label}
                className="flex flex-col items-center bg-white rounded-2xl py-4 px-2 shadow-sm border-2 border-gold/20"
              >
                {/* Big letter form */}
                <span className="letter-form mb-1" style={{ color: letter.color }}>
                  {form}
                </span>
                <span className="font-body text-night/60 font-semibold" style={{ fontSize: 13 }}>
                  {label}
                </span>
                <span className="font-arabic-body text-night/30" style={{ fontSize: 13 }}>
                  {labelAr}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Next */}
        <button
          onClick={() => navigate(`/vocabulary/${letterId}`)}
          className="btn-kid w-full bg-gold text-night"
          style={{ fontSize: 22 }}
        >
          Weiter: Wörter 📖 →
        </button>
      </div>
    </div>
  )
}
