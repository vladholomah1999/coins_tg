'use client'

import { useState, useEffect } from 'react'

interface MiningButtonProps {
  onMine: () => void
  cooldown?: number
  isDisabled?: boolean
}

export const MiningButton = ({
  onMine,
  cooldown = 5,
  isDisabled = false
}: MiningButtonProps) => {
  const [isAnimating, setIsAnimating] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [timeLeft])

  const handleClick = () => {
    if (isDisabled || timeLeft > 0 || isAnimating) return

    setIsAnimating(true)
    // Анімація майнінгу
    setTimeout(() => {
      setIsAnimating(false)
      onMine()
      setTimeLeft(cooldown)
    }, 1000)
  }

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled || timeLeft > 0}
      className={`
        w-32 h-32 rounded-full 
        ${isDisabled 
          ? 'bg-gray-300' 
          : isAnimating 
            ? 'bg-yellow-400 animate-pulse' 
            : timeLeft > 0 
              ? 'bg-blue-300' 
              : 'bg-blue-500 hover:bg-blue-600'
        }
        transition-colors duration-300
        flex items-center justify-center
        text-white font-bold text-xl
        relative
        overflow-hidden
      `}
    >
      {isAnimating ? (
        'Майнінг...'
      ) : timeLeft > 0 ? (
        `${timeLeft}с`
      ) : (
        'Майнити'
      )}
      {isAnimating && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-shine" />
      )}
    </button>
  )
}