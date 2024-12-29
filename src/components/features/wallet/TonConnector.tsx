'use client'

import { useState } from 'react'
import type { TonWallet } from '@/types/ton'

interface TonConnectorProps {
  onConnect: (address: string) => void
  onDisconnect: () => void
}

export const TonConnector = ({ onConnect, onDisconnect }: TonConnectorProps) => {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState('')

  const handleConnect = async () => {
    try {
      const ton = window.ton as TonWallet | undefined
      if (!ton) {
        window.open('https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd', '_blank')
        return
      }

      const { address } = await ton.connect()
      setIsConnected(true)
      setAddress(address)
      onConnect(address)
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