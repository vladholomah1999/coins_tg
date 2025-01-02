import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import WebApp from '@twa-dev/sdk';

const TelegramWebAppWrapper: React.FC = () => {
  useEffect(() => {
    const initTelegramWebApp = () => {
      if (WebApp.initDataUnsafe.query_id) {
        WebApp.ready();
        WebApp.expand();

        // Встановлення теми
        const root = document.documentElement;
        root.style.setProperty('--tg-theme-bg-color', WebApp.themeParams.bg_color);
        root.style.setProperty('--tg-theme-text-color', WebApp.themeParams.text_color);
        root.style.setProperty('--tg-theme-button-color', WebApp.themeParams.button_color);
        root.style.setProperty('--tg-theme-button-text-color', WebApp.themeParams.button_text_color);

        console.log('WebApp theme params:', WebApp.themeParams);
        console.log('WebApp user:', WebApp.initDataUnsafe.user);
        console.log('WebApp start_param:', WebApp.initDataUnsafe.start_param);

        // Зберігаємо userId в localStorage
        if (WebApp.initDataUnsafe.user?.id) {
          localStorage.setItem('userId', WebApp.initDataUnsafe.user.id.toString());
        }

        // Обробка start_param, якщо це реферальний код
        if (WebApp.initDataUnsafe.start_param) {
          localStorage.setItem('referralCode', WebApp.initDataUnsafe.start_param);
        }
      } else {
        console.log('Running outside of Telegram WebApp');
        // Встановлення значень за замовчуванням для браузерної версії
        const root = document.documentElement;
        root.style.setProperty('--tg-theme-bg-color', '#ffffff');
        root.style.setProperty('--tg-theme-text-color', '#000000');
        root.style.setProperty('--tg-theme-button-color', '#3390ec');
        root.style.setProperty('--tg-theme-button-text-color', '#ffffff');

        // Перевіряємо наявність userId в URL
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('userId');
        if (userId) {
          localStorage.setItem('userId', userId);
        }

        // Перевіряємо наявність start в URL (для реферального коду)
        const startParam = urlParams.get('start');
        if (startParam) {
          localStorage.setItem('referralCode', startParam);
        }
      }
    };

    initTelegramWebApp();
  }, []);

  return <App />;
};

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <TelegramWebAppWrapper />
  </React.StrictMode>
);

// Функція для виклику reportWebVitals
const runReportWebVitals = () => {
  reportWebVitals(console.log).catch(error => console.error('Error in reportWebVitals:', error));
};

// Викликаємо функцію та ігноруємо попередження про невикористаний проміс
// eslint-disable-next-line @typescript-eslint/no-floating-promises
runReportWebVitals();