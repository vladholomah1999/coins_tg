interface BalanceCardProps {
  balance: number
  pricePerThousand: number
}

export const BalanceCard = ({ balance, pricePerThousand }: BalanceCardProps) => {
  const usdValue = ((balance/1000) * pricePerThousand).toFixed(2)

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white">
            N
          </div>
          <span className="font-semibold">NOT</span>
        </div>
        <span className="font-bold">{balance}</span>
      </div>
      <p className="text-right text-gray-500 text-sm">${usdValue}</p>
    </div>
  )
}