import { useState } from 'react'
import { useAudio } from '../hooks/useAudio'

interface Props {
  src: string
  ttsText: string
  label?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary' | 'ghost'
  className?: string
}

export function AudioButton({
  src,
  ttsText,
  label = 'Hör zu! 🔊',
  size = 'md',
  variant = 'primary',
  className = ''
}: Props) {
  const { playLetterName } = useAudio()
  const [isPlaying, setIsPlaying] = useState(false)

  const handlePlay = async () => {
    if (isPlaying) return
    setIsPlaying(true)
    await playLetterName(src, ttsText)
    // Reset after estimated playback time
    setTimeout(() => setIsPlaying(false), 2000)
  }

  const sizeClasses = {
    sm: 'text-base py-3 px-5 min-h-[48px]',
    md: 'text-xl  py-4 px-8 min-h-[64px]',
    lg: 'text-2xl py-5 px-10 min-h-[72px]',
  }

  const variantClasses = {
    primary:   'bg-teal text-white shadow-lg',
    secondary: 'bg-gold text-night shadow-lg',
    ghost:     'bg-white/80 text-teal border-2 border-teal',
  }

  return (
    <button
      onClick={handlePlay}
      disabled={isPlaying}
      className={`
        btn-kid font-body font-bold rounded-2xl
        flex items-center justify-center gap-3
        transition-all duration-200
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${isPlaying ? 'scale-95 opacity-80' : 'hover:scale-105 active:scale-95'}
        ${className}
      `}
    >
      {/* Speaker wave animation when playing */}
      <span className={`text-2xl transition-transform ${isPlaying ? 'animate-bounce' : ''}`}>
        {isPlaying ? '🔊' : '🔈'}
      </span>
      <span>{isPlaying ? '...' : label}</span>
    </button>
  )
}
