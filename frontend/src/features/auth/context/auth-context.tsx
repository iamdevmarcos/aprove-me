'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '../services/auth-api';
import { AuthApiError } from '../utils/auth-api-error';
import { authStorage } from '../utils/auth-storage';

interface AuthContextData {
  user: { login: string } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (login: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ login: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const logout = useCallback(async () => {
    try {
      const token = authStorage.getToken();
      if (token && !authStorage.isTokenExpired(token)) {
        await authApi.logout();
      }
    } catch (error) {
      console.error('Erro ao fazer logout na API:', error);
    } finally {
      authStorage.removeToken();
      setUser(null);
      router.push('/login');
    }
  }, [router]);

  const login = useCallback(
    async (loginValue: string, password: string) => {
      try {
        const { token, refreshToken } = await authApi.login({
          login: loginValue,
          password,
        });

        authStorage.setTokens(token, refreshToken);
        const payload = authStorage.getTokenPayload(token);

        if (payload) {
          setUser({ login: payload.login });
          router.push('/dashboard');
        } else {
          throw new Error('Token inválido');
        }
      } catch (error) {
        if (error instanceof AuthApiError) {
          throw error;
        }
        throw new AuthApiError('Erro ao fazer login. Tente novamente.');
      }
    },
    [router],
  );

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = authStorage.getToken();
        const refreshToken = authStorage.getRefreshToken();

        if (!token || !refreshToken) {
          setIsLoading(false);
          return;
        }

        if (authStorage.isTokenExpired(token)) {
          try {
            const { token: newToken } = await authApi.refreshToken(refreshToken);
            authStorage.setToken(newToken);
            const payload = authStorage.getTokenPayload(newToken);
            if (payload) {
              setUser({ login: payload.login });
            } else {
              authStorage.removeToken();
            }
          } catch (error) {
            authStorage.removeToken();
          }
        } else {
          const payload = authStorage.getTokenPayload(token);
          if (payload) {
            setUser({ login: payload.login });
          } else {
            authStorage.removeToken();
          }
        }
      } catch (error) {
        authStorage.removeToken();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    if (!user) return;

    const checkExpiration = setInterval(async () => {
      const token = authStorage.getToken();
      const refreshToken = authStorage.getRefreshToken();

      if (!token || !refreshToken) {
        logout();
        return;
      }

      if (authStorage.isTokenExpired(token)) {
        try {
          const { token: newToken } = await authApi.refreshToken(refreshToken);
          authStorage.setToken(newToken);
        } catch (error) {
          logout();
        }
      }
    }, 5000);

    return () => clearInterval(checkExpiration);
  }, [user, logout]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  
  return context;
};
