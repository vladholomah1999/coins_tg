interface TelegramUser {
  id: number;
  first_name: string;
  username?: string;
}

export interface TelegramWebApp {
  ready(): void;
  expand(): void;
  showAlert(message: string): void;
  initDataUnsafe: {
    user?: TelegramUser;
  };
}

interface TelegramWindow {
  WebApp: TelegramWebApp;
}

declare global {
  interface Window {
    Telegram?: TelegramWindow;
  }
}

export const getTelegramWebApp = (): TelegramWebApp | undefined => {
  if (typeof window === 'undefined') return undefined;
  return window.Telegram?.WebApp;
};