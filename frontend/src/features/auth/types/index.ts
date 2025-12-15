export interface LoginRequest {
  login: string
  password: string
}

export interface LoginResponse {
  token: string
  refreshToken: string
}

export interface RefreshTokenResponse {
  token: string
}

export interface AuthUser {
  login: string
  token: string
  refreshToken: string
  expiresAt: number
}

