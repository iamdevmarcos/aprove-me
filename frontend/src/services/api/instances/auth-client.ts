import axios, { AxiosError, AxiosInstance } from 'axios';
import { ApiError } from '../types';

export const authApiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

authApiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

authApiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError | { message?: string; error?: string }>) => {
    if (
      error.response?.status === 401 &&
      error.config &&
      !error.config.url?.includes('/auth/refresh') &&
      !error.config.url?.includes('/auth/login')
    ) {
      if (typeof window !== 'undefined') {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        }
      }
    }

    if (error.response) {
      const responseData = error.response.data;
      const apiError: ApiError = {
        message:
          responseData?.message ||
          (responseData && 'error' in responseData
            ? responseData.error
            : undefined) ||
          'Erro ao processar requisição',
        statusCode: error.response.status,
        errors:
          responseData && 'errors' in responseData
            ? responseData.errors
            : undefined,
      };
      return Promise.reject(apiError);
    }

    if (error.request) {
      return Promise.reject({
        message: 'Serviço de autenticação não disponível. Tente novamente.',
        statusCode: 503,
      } as ApiError);
    }

    return Promise.reject({
      message: 'Erro inesperado. Tente novamente.',
      statusCode: 500,
    } as ApiError);
  },
);

