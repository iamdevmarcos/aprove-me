import type { AxiosError } from 'axios';
import { isAxiosError } from 'axios';

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

type AuthErrorResponse =
  | { message?: string; error?: string; errors?: Record<string, string[]> }
  | undefined;

export function handleAuthApiError(
  error: unknown,
  defaultMessage: string,
): never {
  if (isAxiosError(error)) {
    const axiosError = error as AxiosError<AuthErrorResponse>;

    if (axiosError.response) {
      const responseData = axiosError.response.data;

      const message =
        responseData?.message ||
        (responseData && 'error' in responseData
          ? responseData.error
          : undefined) ||
        defaultMessage;

      const errors =
        responseData && 'errors' in responseData
          ? responseData.errors
          : undefined;

      throw new AuthApiError(message, axiosError.response.status, errors);
    }

    if (axiosError.request) {
      throw new AuthApiError(
        'Serviço de autenticação não disponível. Tente novamente.',
        503,
      );
    }

    throw new AuthApiError('Erro inesperado. Tente novamente.');
  }

  if (error && typeof error === 'object' && 'message' in error) {
    throw new AuthApiError(String((error as { message: unknown }).message));
  }

  throw new AuthApiError(defaultMessage);
}


