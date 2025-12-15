import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { authStorage } from '@/src/features/auth/utils/auth-storage';
import { refreshTokenIfNeeded } from '../refresh-token';
import { getApiBaseUrl } from '@/src/helpers/utils';

export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = authStorage.getToken();
      const url = config.url ?? '';

      const isAuthLogin = url.includes('/auth/login');
      const isAuthRefresh = url.includes('/auth/refresh');

      if (token && !isAuthLogin && !isAuthRefresh) {
        config.headers.Authorization = `Bearer ${token}`;
      }      
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (originalRequest.url?.includes('/auth')) {
        if (typeof window !== 'undefined') {
          authStorage.removeToken();
          window.location.href = '/login';
        }

        return Promise.reject(error);
      }

      originalRequest._retry = true;

      const newToken = await refreshTokenIfNeeded();

      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      }
    }

    return Promise.reject(error);
  },
);

