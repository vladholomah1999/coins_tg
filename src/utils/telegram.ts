import type { TelegramUser, TelegramWebApp } from '@/types/telegram'

export const getTelegramWebApp = (): TelegramWebApp | undefined => {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    return window.Telegram.WebApp
  }
  return undefined
}

export const getTelegramUser = (): TelegramUser | undefined => {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    return window.Telegram.WebApp.initDataUnsafe.user
  }
  return undefined
}

export const showAlert = (message: string): void => {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    window.Telegram.WebApp.showAlert(message)
  }
}