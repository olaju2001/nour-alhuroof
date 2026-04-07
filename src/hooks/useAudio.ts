import { useCallback, useRef } from 'react'

// ── Howler lazy import (only loads when needed) ───────────────────
let HowlClass: typeof import('howler').Howl | null = null
const getHowl = async () => {
  if (!HowlClass) {
    const mod = await import('howler')
    HowlClass = mod.Howl
  }
  return HowlClass
}

// ── Track which audio files actually exist (to avoid 404 spam) ────
const existingFiles = new Set<string>()
const missingFiles  = new Set<string>()

const checkFileExists = async (src: string): Promise<boolean> => {
  if (existingFiles.has(src)) return true
  if (missingFiles.has(src))  return false
  try {
    const res = await fetch(src, { method: 'HEAD' })
    if (res.ok) { existingFiles.add(src); return true }
    else         { missingFiles.add(src);  return false }
  } catch {
    missingFiles.add(src)
    return false
  }
}

// ── Web Speech API fallback (TTS) ─────────────────────────────────
const speakTTS = (text: string, lang = 'ar-SA', rate = 0.75) => {
  if (!window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang  = lang
  utterance.rate  = rate
  utterance.pitch = 1.1   // Slightly higher = friendlier for kids
  window.speechSynthesis.speak(utterance)
}

// ── Hook ──────────────────────────────────────────────────────────
export function useAudio() {
  const currentSound = useRef<InstanceType<typeof import('howler').Howl> | null>(null)

  // Stop any currently playing audio
  const stop = useCallback(() => {
    if (currentSound.current) {
      currentSound.current.stop()
      currentSound.current = null
    }
    window.speechSynthesis?.cancel()
  }, [])

  /**
   * Play an audio file. Falls back to TTS if file doesn't exist.
   * @param src       - path to MP3 file e.g. "/audio/letters/alif.mp3"
   * @param ttsText   - Arabic text to speak via TTS if file missing
   * @param ttsLang   - BCP-47 language tag, default 'ar-SA'
   */
  const play = useCallback(async (
    src: string,
    ttsText?: string,
    ttsLang = 'ar-SA'
  ) => {
    stop()

    const fileExists = await checkFileExists(src)

    if (fileExists) {
      // Use Howler for real MP3 playback
      const Howl = await getHowl()
      const sound = new Howl({
        src: [src],
        html5: true,  // Better for mobile
        onloaderror: () => {
          // File exists but can't load → try TTS
          if (ttsText) speakTTS(ttsText, ttsLang)
        }
      })
      currentSound.current = sound
      sound.play()
    } else if (ttsText) {
      // No file → use Web Speech API
      speakTTS(ttsText, ttsLang)
    }
  }, [stop])

  // Play letter name (convenience)
  const playLetterName = useCallback((
    src: string,
    arabicName: string
  ) => play(src, arabicName, 'ar-SA'), [play])

  // Play vocabulary word (convenience)
  const playWord = useCallback((
    src: string,
    arabicWord: string
  ) => play(src, arabicWord, 'ar-SA'), [play])

  // Play a sound effect (correct, wrong, stars)
  const playSfx = useCallback(async (sfxName: 'correct' | 'wrong' | 'stars' | 'complete') => {
    const src = `/audio/sfx/${sfxName}.mp3`
    const fileExists = await checkFileExists(src)
    if (!fileExists) return  // SFX are optional, no TTS fallback

    const Howl = await getHowl()
    const sound = new Howl({ src: [src], volume: 0.6 })
    sound.play()
  }, [])

  return { play, playLetterName, playWord, playSfx, stop }
}
