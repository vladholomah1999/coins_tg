'use client'

type TransactionButtonProps = {
  amount: number
  onTransaction(): void
  disabled?: boolean
}

export const TransactionButton = (props: TransactionButtonProps) => (
  <button
    onClick={props.onTransaction}
    disabled={props.disabled}
    className={`
      w-full py-3 rounded-lg text-white
      ${props.disabled ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}
      transition-colors
    `}
  >
    Купити {props.amount} NOT за 1 TON
  </button>
)