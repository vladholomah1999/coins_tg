'use client'

import { useState } from 'react'

interface TonConnectorProps {
  onConnect: (address: string) => void
  onDisconnect: () => void
}

export const TonConnector = ({ onConnect, onDisconnect }: TonConnectorProps) => {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState('')

  const handleConnect = async () => {
    if (!window.ton) {
      window.open('https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd', '_blank')
      return
    }

    try {
      const result = await window.ton.connect()
      setAddress(result.address)
      setIsConnected(true)
      onConnect(result.address)
    } catch (error) {
      console.error('Connect error:', error)
    }
  }

  const handleDisconnect = () => {
    setIsConnected(false)
    setAddress('')
    onDisconnect()
  }

  return (
    <button
      onClick={isConnected ? handleDisconnect : handleConnect}
      className="w-full p-4 bg-white rounded-lg shadow text-left font-medium hover:bg-gray-50 transition-colors"
    >
      {isConnected ? (
        <div className="flex justify-between items-center">
          <span>Гаманець підключено</span>
          <span className="text-sm text-gray-500">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
        </div>
      ) : (
        'Підключити TON гаманець'
      )}
    </button>
  )
}