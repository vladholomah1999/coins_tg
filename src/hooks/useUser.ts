import { useState, useEffect } from 'react'

interface UserData {
  balance: number
  friends: any[]
  daysStreak: number[]
}

export const useUser = (telegramId: string) => {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/user/initialize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ telegramId })
        })
        const data = await response.json()
        if (data.success) {
          setUserData({
            balance: Number(data.balance),
            friends: data.friends,
            daysStreak: data.daysStreak
          })
        }
      } catch (error) {
        console.error('Failed to fetch user:', error)
      } finally {
        setLoading(false)
      }
    }

    if (telegramId) {
      fetchUser()
    }
  }, [telegramId])

  return { userData, loading }
}