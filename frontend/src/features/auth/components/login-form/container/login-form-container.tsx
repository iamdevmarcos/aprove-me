'use client';

import { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../../context/auth-context';
import { AuthApiError } from '../../../utils/auth-api-error';
import { loginSchema, type LoginFormData } from '../../../validations/schemas';
import { LoginFormUI } from '../presentational/login-form-ui';

export function LoginFormContainer() {
  const { login: authLogin } = useAuth();
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  useEffect(() => {
    const subscription = form.watch(() => {
      if (error) setError('')
    });

    return () => subscription.unsubscribe();
  }, [form, error]);

  const onSubmit = useCallback(
    async (data: LoginFormData) => {
      try {
        setError('');
        setIsSubmitting(true);
        await authLogin(data.login, data.password);
      } catch (err) {
        if (err instanceof AuthApiError) {
          setError(err.message);
        } else {
          setError('Erro inesperado. Tente novamente.');
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [authLogin],
  );

  return (
    <LoginFormUI
      form={form}
      error={error}
      isSubmitting={isSubmitting}
      onSubmit={onSubmit}
    />
  );
}

