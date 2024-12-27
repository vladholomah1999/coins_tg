'use client'

interface MiningButtonProps {
  onMine: () => void
}

export const MiningButton = (props: MiningButtonProps) => (
  <button
    onClick={props.onMine}
    className="w-32 h-32 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-bold"
  >
    Майнити
  </button>
)