import { authApiClient } from '@/src/services/api/instances/auth-client';
import { ApiError } from '@/src/services/api/types';
import type {
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
} from '../types';

export class AuthApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public errors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = 'AuthApiError';
  }
}

function handleApiError(error: unknown, defaultMessage: string): never {
  if (error && typeof error === 'object' && 'message' in error) {
    const apiError = error as ApiError;
    throw new AuthApiError(
      apiError.message,
      apiError.statusCode,
      apiError.errors,
    );
  }
  throw new AuthApiError(defaultMessage);
}

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      const { data } = await authApiClient.post<LoginResponse>(
        '/auth/login',
        credentials,
      );
      return data;
    } catch (error) {
      handleApiError(error, 'Erro ao fazer login');
    }
  },

  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    try {
      const { data } = await authApiClient.post<RefreshTokenResponse>(
        '/auth/refresh',
        { refreshToken },
      );
      return data;
    } catch (error) {
      handleApiError(error, 'Erro ao renovar token');
    }
  },

  logout: async (): Promise<void> => {
    try {
      await authApiClient.post('/auth/logout');
    } catch (error) {
      handleApiError(error, 'Erro ao fazer logout');
    }
  },
};



