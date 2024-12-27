interface UserProfileProps {
  username: string
}

export const UserProfile = ({ username }: UserProfileProps) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 rounded-full bg-gray-200" />
        <div>
          <h2 className="font-semibold">{username}</h2>
          <p className="text-sm text-gray-500">Місячний план</p>
        </div>
      </div>
      <span className="text-blue-500">Telegram</span>
    </div>
  )
}