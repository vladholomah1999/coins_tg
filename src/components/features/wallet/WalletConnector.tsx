'use client'

import { useState } from 'react'

export const WalletConnector = () => {
  const [isConnected, setIsConnected] = useState(false)

  const connectWallet = async () => {
    if (typeof window.ton !== 'undefined') {
      try {
        await window.ton.connect()
        setIsConnected(true)
      } catch (error) {
        console.error('Wallet connection error:', error)
      }
    }
  }

  return (
    <button
      onClick={connectWallet}
      className="w-full p-4 bg-white rounded-lg shadow text-left font-medium hover:bg-gray-50 transition-colors"
    >
      {isConnected ? (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          Гаманець підключено
        </div>
      ) : (
        'Підключити гаманець'
      )}
    </button>
  )
}