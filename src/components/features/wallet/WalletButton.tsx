'use client'

declare global {
  interface Window {
    ton?: {
      connect: () => Promise<void>
    }
  }
}

interface WalletButtonProps {
  onConnect: () => void
}

export const WalletButton = (props: WalletButtonProps) => (
  <button
    onClick={props.onConnect}
    className="w-full p-4 bg-white rounded-lg shadow text-left font-medium hover:bg-gray-50 transition-colors"
  >
    Підключити гаманець
  </button>
)