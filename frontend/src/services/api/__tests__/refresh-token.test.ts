import axios from 'axios'
import { refreshTokenIfNeeded } from '../refresh-token'
import { authStorage } from '@/src/features/auth/utils/auth-storage'

jest.mock('axios')

jest.mock('@/src/features/auth/utils/auth-storage', () => ({
  authStorage: {
    getRefreshToken: jest.fn(),
    setToken: jest.fn(),
    removeToken: jest.fn(),
  },
}))

const mockedAxios = axios as jest.Mocked<typeof axios>
const mockedAuthStorage = authStorage as jest.Mocked<typeof authStorage>

describe('refreshTokenIfNeeded', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(global as any).window = { location: { href: 'http://localhost' } }
  })

  it('should return null when there is no refresh token', async () => {
    mockedAuthStorage.getRefreshToken.mockReturnValue(null)

    const result = await refreshTokenIfNeeded()

    expect(result).toBeNull()
    expect(mockedAxios.post).not.toHaveBeenCalled()
  })

  it('should refresh token and resolve with new token', async () => {
    mockedAuthStorage.getRefreshToken.mockReturnValue('refresh-token')
    mockedAxios.post.mockResolvedValueOnce({
      data: { token: 'new-token' },
    } as any)

    const result = await refreshTokenIfNeeded()

    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining('/auth/refresh'),
      { refreshToken: 'refresh-token' },
      expect.objectContaining({
        headers: { 'Content-Type': 'application/json' },
      }),
    )
    expect(result).toBe('new-token')
    expect(mockedAuthStorage.setToken).toHaveBeenCalledWith('new-token')
  })

  it('should enqueue concurrent calls and resolve them with same token', async () => {
    mockedAuthStorage.getRefreshToken.mockReturnValue('refresh-token')

    let resolveRequest: ((value: any) => void) | undefined
    mockedAxios.post.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveRequest = resolve
        }),
    )

    const firstCall = refreshTokenIfNeeded()
    const secondCall = refreshTokenIfNeeded()

    resolveRequest?.({ data: { token: 'new-token' } })

    const [firstResult, secondResult] = await Promise.all([
      firstCall,
      secondCall,
    ])

    expect(firstResult).toBe('new-token')
    expect(secondResult).toBe('new-token')
    expect(mockedAxios.post).toHaveBeenCalledTimes(1)
  })

  it('should remove tokens and redirect to login on error', async () => {
    mockedAuthStorage.getRefreshToken.mockReturnValue('refresh-token')
    mockedAxios.post.mockRejectedValueOnce(new Error('network error'))

    const result = await refreshTokenIfNeeded()

    expect(result).toBeNull()
    expect(mockedAuthStorage.removeToken).toHaveBeenCalled()
  })
})


