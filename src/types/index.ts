export interface User {
  id: number
  telegramId: string
  username?: string
  balance: bigint
  wallet?: string
  lastBonus?: Date
  dailyStreak: number
  createdAt: Date
  updatedAt: Date
}

export interface Referral {
  id: number
  referrerId: number
  referredId: number
  claimed: boolean
  createdAt: Date
}

// Створюємо окремий файл для декларацій
declare global {
  interface Window {
    Telegram: {
      WebApp: {
        ready(): void
        expand(): void
        close(): void
        initData: string
        initDataUnsafe: {
          query_id: string
          user: {
            id: number
            first_name: string
            last_name?: string
            username?: string
            language_code?: string
          }
          auth_date: number
          hash: string
        }
      }
    }
  }
}

// Необхідно для роботи декларацій модуля
export {}