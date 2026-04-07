// ── Letter types ──────────────────────────────────────────────────

export interface LetterForms {
  isolated: string
  initial:  string
  medial:   string
  final:    string
}

export interface VocabularyWord {
  id:             string
  word:           string
  transliteration: string
  german:         string
  emoji:          string
  audio:          string
}

export interface TracingInfo {
  strokes:     number
  description: string
  steps:       string[]
}

export interface Letter {
  id:                 number
  arabic:             string
  name_arabic:        string
  name_german:        string
  transliteration:    string
  pronunciation_guide: string
  memory_trick:       string
  similar_to:         string
  color:              string
  forms:              LetterForms
  audio: {
    name:          string
    pronunciation: string
  }
  vocabulary: VocabularyWord[]
  tracing:    TracingInfo
}

// ── Progress types ─────────────────────────────────────────────────

export interface LetterProgress {
  unlocked:        boolean
  recognition_done: boolean
  vocabulary_done:  boolean
  tracing_stars:   number   // 0–3
  game_score:      number   // 0–100
  mastered:        boolean
  last_practiced?: string   // ISO date string
}

export interface ChildProfile {
  name:       string
  avatar_id:  number
  total_stars: number
  created_at: string
  letters:    Record<number, LetterProgress>
}

// ── Message types ──────────────────────────────────────────────────

export interface BilingualMessage {
  arabic:  string
  german:  string
}

export interface MessagesData {
  correct_answer:   BilingualMessage[]
  wrong_answer:     BilingualMessage[]
  letter_complete:  BilingualMessage[]
  tracing_good:     BilingualMessage[]
  tracing_try_again: BilingualMessage[]
  game_won:         BilingualMessage[]
  daily_greeting:   BilingualMessage[]
  stars_earned: {
    one:   BilingualMessage
    two:   BilingualMessage
    three: BilingualMessage
  }
}

// ── Game types ─────────────────────────────────────────────────────

export type GameType = 'letter_tap' | 'word_match' | 'listen_find'

export interface GameResult {
  score:       number
  stars:       number
  completed:   boolean
  time_seconds: number
}
