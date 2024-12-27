'use client'

interface BonusStreakProps {
  streak: number
  nextBonus: number
  lastClaim?: Date
}

export const BonusStreak = ({ streak, nextBonus, lastClaim }: BonusStreakProps) => {
  const canClaim = !lastClaim || new Date().getTime() - new Date(lastClaim).getTime() > 24 * 60 * 60 * 1000

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold">Щоденний бонус</h3>
        <span className="text-sm text-gray-500">Стрік: {streak} днів</span>
      </div>
      <div className="text-center mb-4">
        <p className="text-2xl font-bold text-green-500">+{nextBonus} NOT</p>
        <p className="text-sm text-gray-500">Наступний бонус</p>
      </div>
      <button
        disabled={!canClaim}
        className={`w-full py-3 rounded-lg text-white ${
          canClaim ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-300'
        }`}
      >
        {canClaim ? 'Забрати бонус' : 'Приходь завтра'}
      </button>
    </div>
  )
}