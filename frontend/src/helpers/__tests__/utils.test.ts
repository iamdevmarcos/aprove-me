import Mask from '@/src/hooks/masks'
import { AxiosError } from 'axios'
import { type FieldValues } from 'react-hook-form'
import { cn, formatDocument, getApiBaseUrl, setBackendErrors } from '../utils'

jest.mock('@/src/hooks/masks', () => ({
  __esModule: true,
  default: {
    CPF: jest.fn((value: string) => `CPF-${value}`),
    CNPJ: jest.fn((value: string) => `CNPJ-${value}`),
  },
}))

describe('cn', () => {
  it('merges class names correctly', () => {
    expect(cn('a', 'b')).toBe('a b')
    expect(cn('a', false && 'b', 'c')).toBe('a c')
  })
})

describe('getApiBaseUrl', () => {
  const originalEnv = process.env

  beforeEach(() => {
    process.env = { ...originalEnv }
  })

  afterAll(() => {
    process.env = originalEnv
  })

  it('returns env var when defined', () => {
    process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com'
    expect(getApiBaseUrl()).toBe('https://api.example.com')
  })

  it('falls back to default url', () => {
    delete process.env.NEXT_PUBLIC_API_URL
    expect(getApiBaseUrl()).toBe('http://localhost:3001')
  })
})

describe('formatDocument', () => {
  it('returns empty string when document is falsy', () => {
    expect(formatDocument('')).toBe('')
  })

  it('uses CPF mask when cleaned length is <= 11', () => {
    const result = formatDocument('123.456.789-00')
    expect(Mask.CPF).toHaveBeenCalledWith('123.456.789-00')
    expect(result).toBe('CPF-123.456.789-00')
  })

  it('uses CNPJ mask when cleaned length is > 11', () => {
    const result = formatDocument('12.345.678/0001-99')
    expect(Mask.CNPJ).toHaveBeenCalledWith('12.345.678/0001-99')
    expect(result).toBe('CNPJ-12.345.678/0001-99')
  })
})

describe('setBackendErrors', () => {
  type FormData = FieldValues

  const setError = jest.fn()

  beforeEach(() => {
    setError.mockClear()
  })

  it('handles AxiosError with errors object', () => {
    const axiosError = new AxiosError('Error', '400', undefined, undefined, {
      data: {
        errors: {
          field1: ['message 1'],
          field2: 'message 2',
        },
      },
    } as any)

    setBackendErrors<FormData>(axiosError, setError)

    expect(setError).toHaveBeenCalledWith('field1', {
      type: 'server',
      message: 'message 1',
    })
    expect(setError).toHaveBeenCalledWith('field2', {
      type: 'server',
      message: 'message 2',
    })
  })

  it('handles non-Axios error with errors object', () => {
    const error = {
      errors: {
        field: ['error message'],
      },
    }

    setBackendErrors<FormData>(error, setError)

    expect(setError).toHaveBeenCalledWith('field', {
      type: 'server',
      message: 'error message',
    })
  })

  it('handles array of message items', () => {
    const error = {
      message: [
        { field: 'field1', message: 'msg1' },
        { field: 'field2', message: 'msg2' },
      ],
    }

    setBackendErrors<FormData>(error, setError)

    expect(setError).toHaveBeenCalledWith('field1', {
      type: 'server',
      message: 'msg1',
    })
    expect(setError).toHaveBeenCalledWith('field2', {
      type: 'server',
      message: 'msg2',
    })
  })

  it('does nothing when response data is invalid', () => {
    setBackendErrors<FormData>('invalid', setError)
    expect(setError).not.toHaveBeenCalled()
  })
})
