export interface TelegramUser {
  id: number
  first_name: string
  username?: string
}

export interface TelegramWebApp {
  ready: () => void
  expand: () => void
  showAlert: (message: string) => void
  initDataUnsafe: {
    user?: TelegramUser
  }
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp
    }
  }
}