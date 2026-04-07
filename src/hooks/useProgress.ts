import { useState, useCallback } from 'react'
import type { ChildProfile, LetterProgress } from '../types'

const STORAGE_KEY = 'nour_alhuroof_profile'

// ── Default profile for a brand new child ─────────────────────────
const createDefaultProfile = (name: string, avatarId: number): ChildProfile => ({
  name,
  avatar_id: avatarId,
  total_stars: 0,
  created_at: new Date().toISOString(),
  letters: {
    1: { unlocked: true, recognition_done: false, vocabulary_done: false, tracing_stars: 0, game_score: 0, mastered: false }
    // All other letters start locked — we unlock them progressively
  }
})

// ── Default progress for a newly unlocked letter ──────────────────
const defaultLetterProgress = (): LetterProgress => ({
  unlocked: false,
  recognition_done: false,
  vocabulary_done: false,
  tracing_stars: 0,
  game_score: 0,
  mastered: false
})

// ── Hook ──────────────────────────────────────────────────────────
export function useProgress() {
  const [profile, setProfile] = useState<ChildProfile | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  // Save profile both to state and localStorage
  const saveProfile = useCallback((updated: ChildProfile) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      setProfile(updated)
    } catch (err) {
      console.error('Failed to save progress:', err)
    }
  }, [])

  // Create a new child profile
  const createProfile = useCallback((name: string, avatarId: number) => {
    const newProfile = createDefaultProfile(name, avatarId)
    saveProfile(newProfile)
    return newProfile
  }, [saveProfile])

  // Get progress for a specific letter
  const getLetterProgress = useCallback((letterId: number): LetterProgress => {
    if (!profile) return defaultLetterProgress()
    return profile.letters[letterId] ?? defaultLetterProgress()
  }, [profile])

  // Mark recognition (letter screen) as done
  const completeRecognition = useCallback((letterId: number) => {
    if (!profile) return
    const updated: ChildProfile = {
      ...profile,
      letters: {
        ...profile.letters,
        [letterId]: {
          ...getLetterProgress(letterId),
          unlocked: true,
          recognition_done: true,
          last_practiced: new Date().toISOString()
        }
      }
    }
    saveProfile(updated)
  }, [profile, getLetterProgress, saveProfile])

  // Mark vocabulary as done
  const completeVocabulary = useCallback((letterId: number) => {
    if (!profile) return
    const updated: ChildProfile = {
      ...profile,
      letters: {
        ...profile.letters,
        [letterId]: {
          ...getLetterProgress(letterId),
          vocabulary_done: true,
          last_practiced: new Date().toISOString()
        }
      }
    }
    saveProfile(updated)
  }, [profile, getLetterProgress, saveProfile])

  // Save tracing stars (1–3)
  const completeTracing = useCallback((letterId: number, stars: number) => {
    if (!profile) return
    const current = getLetterProgress(letterId)
    const bestStars = Math.max(current.tracing_stars, stars)
    const starsGained = Math.max(0, bestStars - current.tracing_stars)

    const updated: ChildProfile = {
      ...profile,
      total_stars: profile.total_stars + starsGained,
      letters: {
        ...profile.letters,
        [letterId]: {
          ...current,
          tracing_stars: bestStars,
          last_practiced: new Date().toISOString()
        }
      }
    }
    saveProfile(updated)
    return starsGained
  }, [profile, getLetterProgress, saveProfile])

  // Save game score and unlock next letter
  const completeGame = useCallback((letterId: number, score: number, starsEarned: number) => {
    if (!profile) return
    const current = getLetterProgress(letterId)
    const bestScore = Math.max(current.game_score, score)
    const starsGained = current.game_score === 0 ? starsEarned : 0 // Only award stars first time

    // Check if letter is now mastered (all sections done + game played)
    const mastered =
      current.recognition_done &&
      current.vocabulary_done &&
      current.tracing_stars > 0 &&
      score > 0

    // Unlock next letter
    const nextId = letterId + 1
    const nextLetterProgress = profile.letters[nextId] ?? defaultLetterProgress()

    const updated: ChildProfile = {
      ...profile,
      total_stars: profile.total_stars + starsGained,
      letters: {
        ...profile.letters,
        [letterId]: {
          ...current,
          game_score: bestScore,
          mastered,
          last_practiced: new Date().toISOString()
        },
        // Unlock next letter if it exists (up to 28)
        ...(nextId <= 28 ? {
          [nextId]: { ...nextLetterProgress, unlocked: true }
        } : {})
      }
    }
    saveProfile(updated)
    return starsGained
  }, [profile, getLetterProgress, saveProfile])

  // Check if a letter is accessible
  const isLetterUnlocked = useCallback((letterId: number): boolean => {
    if (letterId === 1) return true
    return profile?.letters[letterId]?.unlocked ?? false
  }, [profile])

  // Total mastered letters count
  const masteredCount = profile
    ? Object.values(profile.letters).filter(l => l.mastered).length
    : 0

  // Reset everything (for testing)
  const resetProgress = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setProfile(null)
  }, [])

  return {
    profile,
    createProfile,
    getLetterProgress,
    completeRecognition,
    completeVocabulary,
    completeTracing,
    completeGame,
    isLetterUnlocked,
    masteredCount,
    resetProgress,
    hasProfile: profile !== null
  }
}
