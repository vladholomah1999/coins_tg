// Імпорт розширень Jest для тестування React компонентів
import '@testing-library/jest-dom';

// Імпорт для мокання fetch API
import 'whatwg-fetch';

// Налаштування мок-об'єкта для localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Налаштування мок-об'єкта для matchMedia
Object.defineProperty(window, 'matchMedia', {
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
  })),
});

// Налаштування мок-об'єкта для Telegram Web App
Object.defineProperty(window, 'Telegram', {
  value: {
    WebApp: {
      ready: jest.fn(),
      close: jest.fn(),
      expand: jest.fn(),
      // Додайте інші методи Telegram Web App, які ви використовуєте
    },
  },
  writable: true,
});

// Очищення всіх моків після кожного тесту
afterEach(() => {
  jest.clearAllMocks();
});