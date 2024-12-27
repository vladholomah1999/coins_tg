import { Friend } from '@/types'

interface FriendListProps {
  friends: Friend[]
}

export const FriendList = ({ friends }: FriendListProps) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="font-semibold mb-4">Мої друзі</h3>
      <div className="space-y-3">
        {friends.map((friend) => (
          <div key={friend.id} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200" />
            <div>
              <p className="font-medium">{friend.username}</p>
              <p className="text-sm text-gray-500">
                Приєднався {new Date(friend.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}