import type { AxiosRequestConfig } from 'axios'
import { apiClient } from '../instances/client'
import { authStorage } from '@/src/features/auth/utils/auth-storage'
import { refreshTokenIfNeeded } from '../refresh-token'

jest.mock('@/src/features/auth/utils/auth-storage', () => ({
  authStorage: {
    getToken: jest.fn(),
    removeToken: jest.fn(),
  },
}))

jest.mock('../refresh-token', () => ({
  refreshTokenIfNeeded: jest.fn(),
}))

const mockedAuthStorage = authStorage as jest.Mocked<typeof authStorage>
const mockedRefreshTokenIfNeeded =
  refreshTokenIfNeeded as jest.MockedFunction<typeof refreshTokenIfNeeded>

describe('apiClient interceptors', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(global as any).window = { location: { href: 'http://localhost' } }
  })

  it('should attach Authorization header for non-auth routes when token exists', () => {
    mockedAuthStorage.getToken.mockReturnValue('token-123')

    const handlers = (apiClient.interceptors.request as any).handlers
    const fulfilled = handlers[0].fulfilled as (
      config: AxiosRequestConfig,
    ) => AxiosRequestConfig

    const config: AxiosRequestConfig = { url: '/dashboard', headers: {} }
    const result = fulfilled(config)

    expect(result.headers).toMatchObject({
      Authorization: 'Bearer token-123',
    })
  })

  it('should not attach Authorization header for login and refresh routes', () => {
    mockedAuthStorage.getToken.mockReturnValue('token-123')

    const handlers = (apiClient.interceptors.request as any).handlers
    const fulfilled = handlers[0].fulfilled as (
      config: AxiosRequestConfig,
    ) => AxiosRequestConfig

    const loginConfig: AxiosRequestConfig = {
      url: '/auth/login',
      headers: {},
    }
    const refreshConfig: AxiosRequestConfig = {
      url: '/auth/refresh',
      headers: {},
    }

    expect(fulfilled(loginConfig).headers).not.toHaveProperty('Authorization')
    expect(fulfilled(refreshConfig).headers).not.toHaveProperty(
      'Authorization',
    )
  })

  it('should logout and redirect on 401 for auth routes', async () => {
    const handlers = (apiClient.interceptors.response as any).handlers
    const rejected = handlers[0].rejected as (error: any) => Promise<any>

    const error = {
      config: { url: '/auth/logout', headers: {} },
      response: { status: 401 },
    }

    await expect(rejected(error)).rejects.toBe(error)

    expect(mockedAuthStorage.removeToken).toHaveBeenCalled()
    expect(mockedRefreshTokenIfNeeded).not.toHaveBeenCalled()
  })

  it('should try to refresh token on 401 for non-auth routes and retry request', async () => {
    mockedRefreshTokenIfNeeded.mockResolvedValue('new-token')

    const handlers = (apiClient.interceptors.response as any).handlers
    const rejected = handlers[0].rejected as (error: any) => Promise<any>

    const requestSpy = jest
      .spyOn(apiClient, 'request')
      .mockResolvedValueOnce({ data: 'ok' } as any)

    const originalConfig: AxiosRequestConfig & { _retry?: boolean } = {
      url: '/dashboard',
      headers: {},
    }

    const error = {
      config: originalConfig,
      response: { status: 401 },
    }

    const result = await rejected(error)

    expect(mockedRefreshTokenIfNeeded).toHaveBeenCalled()
    expect(originalConfig._retry).toBe(true)
    expect(originalConfig.headers).toMatchObject({
      Authorization: 'Bearer new-token',
    })
    expect(requestSpy).toHaveBeenCalledWith(originalConfig)
    expect(result).toEqual({ data: 'ok' })
  })
})