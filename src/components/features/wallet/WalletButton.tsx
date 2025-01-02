'use client'

type WalletButtonProps = {
  isConnected: boolean
  address?: string
  onConnect(): void
  onDisconnect(): void
}

export const WalletButton = (props: WalletButtonProps) => (
  <button
    onClick={props.isConnected ? props.onDisconnect : props.onConnect}
    className="w-full p-4 bg-white rounded-lg shadow text-left font-medium hover:bg-gray-50 transition-colors"
  >
    {props.isConnected ? (
      <div className="flex justify-between items-center">
        <span>Гаманець підключено</span>
        {props.address && (
          <span className="text-sm text-gray-500">
            {props.address.slice(0, 6)}...{props.address.slice(-4)}
          </span>
        )}
      </div>
    ) : (
      'Підключити TON гаманець'
    )}
  </button>
)