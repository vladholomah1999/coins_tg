'use client'

import { useState, useEffect } from 'react'

export default function Home() {
  const [balance, setBalance] = useState<number>(0)
  const [telegramId, setTelegramId] = useState<string>('')
  const [username, setUsername] = useState<string>('')
  const [friends, setFriends] = useState<any[]>([])
  const [pricePerThousand, setPerThousand] = useState<number>(9.17) // Ціна за 1000 монет

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp
      tg.ready()
      tg.expand()

      const userData = tg.initDataUnsafe.user
      if (userData) {
        setTelegramId(userData.id.toString())
        setUsername(userData.first_name)
        // Додаємо 1000 монет при першому вході
        initializeUser(userData.id.toString())
      }
    }
  }, [])

  const initializeUser = async (id: string) => {
    const response = await fetch('/api/user/initialize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ telegramId: id })
    })
    const data = await response.json()
    if (data.success) {
      setBalance(data.balance)
      setFriends(data.friends)
    }
  }

  const addFriend = async () => {
    const response = await fetch('/api/user/addFriend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ telegramId })
    })
    const data = await response.json()
    if (data.success) {
      setBalance(data.balance)
      setFriends(data.friends)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-gray-50">
      <div className="w-full max-w-md space-y-4">
        {/* Профіль */}
        <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-gray-200" />
            <div>
              <h2 className="font-semibold">{username || 'Користувач'}</h2>
              <p className="text-sm text-gray-500">Місячний план</p>
            </div>
          </div>
          <span className="text-blue-500">Telegram</span>
        </div>

        {/* Баланс */}
        <div className="p-4 bg-white rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white">N</div>
              <span className="font-semibold">NOT</span>
            </div>
            <span className="font-bold">{balance}</span>
          </div>
          <p className="text-right text-gray-500 text-sm">{((balance/1000) * pricePerThousand).toFixed(2)}$</p>
        </div>

        {/* Друзі */}
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="font-semibold mb-4">Мої друзі</h3>
          <div className="space-y-3">
            {friends.map((friend, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200" />
                <div>
                  <p className="font-medium">{friend.username}</p>
                  <p className="text-sm text-gray-500">
                    Приєднався {new Date(friend.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Кнопка додавання друга */}
        <button
          onClick={addFriend}
          className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Додати друга (+5000 NOT)
        </button>
      </div>
    </main>
  )
}