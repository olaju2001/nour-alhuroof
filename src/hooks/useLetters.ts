import { useMemo } from 'react'
import lettersData from '../data/letters.json'
import type { Letter } from '../types'

const allLetters = lettersData.letters as Letter[]

export function useLetters() {
  const letters = useMemo(() => allLetters, [])

  const getLetter = (id: number): Letter | undefined =>
    letters.find(l => l.id === id)

  const getLetterByArabic = (arabic: string): Letter | undefined =>
    letters.find(l => l.arabic === arabic)

  // Get N random letters excluding a specific one (for games)
  const getRandomLetters = (excludeId: number, count: number): Letter[] => {
    const pool = letters.filter(l => l.id !== excludeId)
    const shuffled = [...pool].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, count)
  }

  return { letters, getLetter, getLetterByArabic, getRandomLetters }
}
