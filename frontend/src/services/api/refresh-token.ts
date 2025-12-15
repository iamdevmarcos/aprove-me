import { authApi } from '@/src/features/auth/services/auth-api';
import { authStorage } from '@/src/features/auth/utils/auth-storage';

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
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
    const { token: newToken } = await authApi.refreshToken(refreshToken);
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

