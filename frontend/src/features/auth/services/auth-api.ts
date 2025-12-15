import { apiClient } from '@/src/services/api/instances/client';
import type {
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
} from '../types';
import { handleAuthApiError } from '../utils/auth-api-error';

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      const { data } = await apiClient.post<LoginResponse>(
        '/auth/login',
        credentials,
      );
      return data;
    } catch (error) {
      handleAuthApiError(error, 'Erro ao fazer login');
    }
  },

  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    try {
      const { data } = await apiClient.post<RefreshTokenResponse>(
        '/auth/refresh',
        { refreshToken },
      );
      return data;
    } catch (error) {
      handleAuthApiError(error, 'Erro ao renovar token');
    }
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      handleAuthApiError(error, 'Erro ao fazer logout');
    }
  },
};

