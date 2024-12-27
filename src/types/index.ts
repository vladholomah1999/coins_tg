export interface User {
  id: number
  telegramId: string
  username: string
  balance: bigint
  createdAt: Date
  updatedAt: Date
}

export interface Friend {
  id: number
  username: string
  createdAt: Date
}

export interface ReferralBonus {
  amount: number
  friend: Friend
}