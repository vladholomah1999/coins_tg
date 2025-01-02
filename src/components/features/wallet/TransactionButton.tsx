'use client'

interface TransactionButtonProps {
  amount: number;
  onTransaction: () => Promise<void>;
  disabled?: boolean;
}

export const TransactionButton = ({
  amount,
  onTransaction,
  disabled
}: TransactionButtonProps) => {
  return (
    <button
      onClick={onTransaction}
      disabled={disabled}
      className={`
        w-full py-3 rounded-lg text-white
        ${disabled ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}
        transition-colors
      `}
    >
      Купити {amount} NOT за 1 TON
    </button>
  );
};