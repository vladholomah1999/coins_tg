'use client'

import { useEffect } from 'react'

export default function Home() {
  useEffect(() => {
    // Перевіряємо наявність об'єкта Telegram в window
    if (typeof window !== 'undefined' && 'Telegram' in window) {
      window.Telegram.WebApp.ready()
      window.Telegram.WebApp.expand()
    }
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-gray-200"></div>
            <div>
              <h2 className="font-semibold">User Name</h2>
              <p className="text-sm text-gray-500">Monthly Plan</p>
            </div>
          </div>
          <span className="text-blue-500">Telegram</span>
        </div>

        {/* Balance */}
        <div className="p-4 bg-white rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white">
                N
              </div>
              <span className="font-semibold">NOT</span>
            </div>
            <span className="font-bold">200</span>
          </div>
          <p className="text-right text-gray-500 text-sm">1834$</p>
        </div>

        {/* Wallet Button */}
        <button className="w-full p-4 bg-white rounded-lg shadow text-left font-medium">
          Connect Wallet
        </button>
      </div>
    </main>
  )
}