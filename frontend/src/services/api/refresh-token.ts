import axios from 'axios';
import { authStorage } from '@/src/features/auth/utils/auth-storage';
import { getApiBaseUrl } from '@/src/helpers/utils';

const API_BASE_URL = getApiBaseUrl();

type FailedQueueItem = {
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
};

let isRefreshing = false;
let failedQueue: FailedQueueItem[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      return prom.reject(error);
    }
    
    return prom.resolve(token);
  });

  failedQueue = [];
};

export const refreshTokenIfNeeded = async (): Promise<string | null> => {
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    });
  }

  const refreshToken = authStorage.getRefreshToken();

  if (!refreshToken) {
    return null;
  }

  isRefreshing = true;

  try {
    const { data } = await axios.post<{ token: string }>(
      `${API_BASE_URL}/auth/refresh`,
      { refreshToken },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    const newToken = data.token;

    authStorage.setToken(newToken);
    processQueue(null, newToken);
    isRefreshing = false;

    return newToken;
  } catch (error) {
    processQueue(error, null);
    isRefreshing = false;
    authStorage.removeToken();

    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }

    return null;
  }
};


