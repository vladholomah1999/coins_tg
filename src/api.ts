import axios, { AxiosError } from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

interface ApiError {
  message: string;
  error?: string;
  details?: string;
  status?: number;
}

interface User {
  telegramId: string;
  firstName: string;
  lastName?: string;
  username?: string;
  coins: string;
  totalCoins: string;
  level: string;
  referralCode: string;
  referralLink: string;
  photoUrl?: string;
  hasUnclaimedRewards: boolean;
  friends: Friend[];
}

interface Friend {
  telegramId: string;
  firstName: string;
  lastName?: string;
  username?: string;
  coins: string;
  totalCoins: string;
  level: string;
  photoUrl?: string;
}

interface Reward {
  id: number;
  referredUser: {
    id: string;
    name: string;
    username?: string;
  };
  amount: string;
  createdAt: string;
}

interface RewardsResponse {
  success: boolean;
  rewards: Reward[];
  error?: string;
}

interface ClaimRewardResponse {
  success: boolean;
  claimedAmount: string;
  newBalance: string;
  error?: string;
}

interface ReferralResponse {
  success: boolean;
  message: string;
  bonusCoins: string;
  error?: string;
}

interface UserLevelResponse {
  level: string;
  coins: string;
  totalCoins: string;
}

interface UpdateCoinsResponse {
  success: boolean;
  newCoins: string;
  newTotalCoins: string;
  error?: string;
}

// Створюємо екземпляр axios з базовими налаштуваннями
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Додаємо обробку помилок
const handleApiError = (error: AxiosError<ApiError>) => {
  console.error('API Error:', {
    message: error.message,
    response: error.response?.data,
    status: error.response?.status
  });

  let errorMessage = 'An error occurred while processing your request.';

  if (error.response?.data?.message) {
    errorMessage = error.response.data.message;
  } else if (error.response) {
    switch (error.response.status) {
      case 400:
        errorMessage = 'Invalid request. Please check your data.';
        break;
      case 401:
        errorMessage = 'Authentication required. Please log in again.';
        break;
      case 403:
        errorMessage = 'You do not have permission to perform this action.';
        break;
      case 404:
        errorMessage = 'The requested resource was not found.';
        break;
      case 429:
        errorMessage = 'Too many requests. Please try again later.';
        break;
      case 500:
        errorMessage = 'Server error. Please try again later.';
        break;
      default:
        errorMessage = error.response.data?.error || 'Unknown error occurred';
    }
  }

  const apiError = new Error(errorMessage) as Error & { status?: number };
  apiError.status = error.response?.status;
  return Promise.reject(apiError);
};

// Додаємо перехоплювачі запитів
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`, config.data || config.params);
    return config;
  },
  (error: AxiosError<ApiError>) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Додаємо перехоплювачі відповідей
api.interceptors.response.use(
  (response) => {
    console.log(`Response from ${response.config.url}:`, response.data);
    return response;
  },
  (error: AxiosError<ApiError>) => {
    return handleApiError(error);
  }
);

// Оновлена функція оновлення монет з додатковою обробкою помилок і ретраями
export const updateUserCoins = async (userId: string, coinsToAdd: number): Promise<UpdateCoinsResponse> => {
  const maxRetries = 3;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      console.log(`Updating user coins: userId=${userId}, coinsToAdd=${coinsToAdd}`);
      const response = await api.post<UpdateCoinsResponse>('/api/updateUserCoins', {
        userId,
        coinsToAdd: coinsToAdd.toString()
      });

      if (response.data.success) {
        console.log('Coins updated successfully:', response.data);
        return response.data;
      } else {
        throw new Error(response.data.error || 'Failed to update coins');
      }
    } catch (error) {
      console.error(`Error updating coins (attempt ${retries + 1}/${maxRetries}):`, error);
      retries++;

      if (retries === maxRetries) {
        throw error;
      }

      // Чекаємо перед наступною спробою
      await new Promise(resolve => setTimeout(resolve, 1000 * retries));
    }
  }

  throw new Error('Failed to update coins after multiple attempts');
};

// Оновлена функція отримання даних користувача з кешуванням
const userCache: Map<string, { data: User; timestamp: number }> = new Map();
const CACHE_DURATION = 60000; // 1 хвилина

export const getUserData = async (userId: string): Promise<User> => {
  const now = Date.now();
  const cached = userCache.get(userId);

  if (cached && (now - cached.timestamp) < CACHE_DURATION) {
    console.log('Returning cached user data for userId:', userId);
    return cached.data;
  }

  try {
    console.log(`Getting user data for userId: ${userId}`);
    const response = await api.get<User>('/api/getUserData', {
      params: { userId }
    });

    // Оновлюємо кеш
    userCache.set(userId, {
      data: response.data,
      timestamp: now
    });

    console.log('User data received:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error getting user data:', error);
    throw error;
  }
};

// Оновлення рівня користувача
export const updateUserLevel = async (userId: string, newLevel: string): Promise<UserLevelResponse> => {
  try {
    console.log(`Updating user level: userId=${userId}, newLevel=${newLevel}`);
    const response = await api.post<UserLevelResponse>('/api/updateUserLevel', {
      userId,
      newLevel
    });
    console.log('User level updated:', response.data);

    // Інвалідуємо кеш при оновленні рівня
    userCache.delete(userId);

    return response.data;
  } catch (error) {
    console.error('Error updating user level:', error);
    throw error;
  }
};

// Обробка реферальних кодів
export const processReferral = async (referralCode: string, userId: string): Promise<ReferralResponse> => {
  try {
    console.log(`Processing referral: referralCode=${referralCode}, userId=${userId}`);
    const response = await api.post<ReferralResponse>('/api/processReferral', {
      referralCode,
      userId
    });
    console.log('Referral processed:', response.data);

    // Інвалідуємо кеш при обробці реферала
    userCache.delete(userId);

    return response.data;
  } catch (error) {
    console.error('Error processing referral:', error);
    throw error;
  }
};

// Отримання винагороди
export const claimReward = async (userId: string, rewardId: number): Promise<ClaimRewardResponse> => {
  try {
    console.log(`Claiming reward: userId=${userId}, rewardId=${rewardId}`);
    const response = await api.post<ClaimRewardResponse>('/api/claimReward', {
      userId,
      rewardId
    });
    console.log('Reward claimed:', response.data);

    // Інвалідуємо кеш при отриманні винагороди
    userCache.delete(userId);

    return response.data;
  } catch (error) {
    console.error('Error claiming reward:', error);
    throw error;
  }
};

export default api;