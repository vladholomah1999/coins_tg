import { WebAppInstance } from '@twa-dev/sdk';

declare global {
  interface Window {
    Telegram?: {
      WebApp?: WebAppInstance & {
        shareUrl?: (url: string) => void;
      };
    };
  }
}

// Додаємо інші глобальні типи, які можуть бути корисними
declare global {
  interface Navigator {
    // Додаємо підтримку для clipboard API
    clipboard?: {
      writeText(text: string): Promise<void>;
      readText(): Promise<string>;
    };
  }
}

// Додаємо типи для змінних середовища
declare namespace NodeJS {
  interface ProcessEnv {
    REACT_APP_API_URL: string;
    REACT_APP_BOT_USERNAME: string;
    REACT_APP_TELEGRAM_BOT_TOKEN?: string;
    REACT_APP_ENVIRONMENT?: 'development' | 'production' | 'test';
  }
}

export {};