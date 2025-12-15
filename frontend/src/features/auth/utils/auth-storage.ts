import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  sub: string;
  login: string;
  exp: number;
}

export const authStorage = {
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  },

  getRefreshToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refreshToken');
  },

  setToken: (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('token', token);
  },

  setRefreshToken: (refreshToken: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('refreshToken', refreshToken);
  },

  setTokens: (token: string, refreshToken: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
  },

  removeToken: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  },

  isTokenExpired: (token: string): boolean => {
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      if (!decoded.exp) return true;
      
      return decoded.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  },

  getTokenPayload: (token: string): TokenPayload | null => {
    try {
      return jwtDecode<TokenPayload>(token);
    } catch {
      return null;
    }
  },
};

