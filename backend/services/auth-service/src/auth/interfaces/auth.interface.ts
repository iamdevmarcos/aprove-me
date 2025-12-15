export interface JwtPayload {
  sub: string;
  login: string;
  type?: 'access' | 'refresh';
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  token: string;
}
