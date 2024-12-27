'use client'

import { useEffect } from 'react'

export default function Home() {
  useEffect(() => {
    // Ініціалізація Telegram Web App
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready()
      window.Telegram.WebApp.expand()
    }
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-gray-50">
      <div className="w-full max-w-md space-y-4">
        {/* Профіль користувача */}
        <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-gray-200" />
            <div>
              <h2 className="font-semibold">Ім'я користувача</h2>
              <p className="text-sm text-gray-500">Місячний план</p>
            </div>
          </div>
          <span className="text-blue-500">Telegram</span>
        </div>

        {/* Баланс */}
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

        {/* Кнопка гаманця */}
        <button 
          type="button"
          className="w-full p-4 bg-white rounded-lg shadow text-left font-medium hover:bg-gray-50 transition-colors"
          onClick={() => {
            console.log('Підключення гаманця...')
          }}
        >
          Підключити гаманець
        </button>

        {/* Кнопка завдань */}
        <button 
          type="button"
          className="w-full p-4 bg-white rounded-lg shadow text-left font-medium hover:bg-gray-50 transition-colors flex justify-between items-center"
          onClick={() => {
            console.log('Відкриття завдань...')
          }}
        >
          <span>Перейти до завдань</span>
          <span className="text-gray-400">→</span>
        </button>

        {/* Бонусний календар */}
        <div className="p-4 bg-white rounded-lg shadow">
          <div className="grid grid-cols-7 gap-2 mb-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <div 
                key={i}
                className="aspect-square rounded-full border-2 border-gray-200 flex items-center justify-center"
              />
            ))}
          </div>
          <p className="text-center text-blue-500 text-sm">BONUS</p>
        </div>

        {/* Список друзів */}
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="font-semibold mb-4">Мої друзі</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200" />
              <div>
                <p className="font-medium">Ім'я друга</p>
                <p className="text-sm text-gray-500">Приєднався 5 грудня</p>
              </div>
            </div>
          </div>
        </div>

        {/* Кнопка додавання друга */}
        <button 
          type="button"
          className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          onClick={() => {
            console.log('Додавання друга...')
          }}
        >
          Додати друга
        </button>
      </div>
    </main>
  )
}