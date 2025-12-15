import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  sub: string;
  login: string;
  exp: number;
}

const TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refreshToken';
const MILLISECONDS_IN_SECOND = 1000;

export const authStorage = {
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  getRefreshToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setToken: (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_KEY, token);
  },

  setRefreshToken: (refreshToken: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },

  setTokens: (token: string, refreshToken: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },

  removeToken: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  isTokenExpired: (token: string): boolean => {
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      if (!decoded.exp) return true;

      return decoded.exp * MILLISECONDS_IN_SECOND < Date.now();
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
