/// <reference types="react-scripts" />

declare namespace NodeJS {
  interface ProcessEnv {
    REACT_APP_API_URL: string;
    REACT_APP_BOT_USERNAME: string;
    // Додайте інші змінні середовища, які ви використовуєте в проекті
    REACT_APP_TELEGRAM_BOT_TOKEN?: string;
    REACT_APP_ENVIRONMENT?: 'development' | 'production' | 'test';
  }
}

// Додаткові глобальні типи, якщо потрібно
declare global {
  interface Window {
    Telegram?: {
      WebApp?: any; // Уточніть тип, якщо можливо
    };
  }
}