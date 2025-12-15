'use client';

import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/src/components/ui/button';
import { FormInput } from '@/src/components/ui/form-input';
import type { LoginFormData } from '../../../validations/schemas';

interface LoginFormUIProps {
  form: UseFormReturn<LoginFormData>;
  error: string;
  isSubmitting: boolean;
  onSubmit: (data: LoginFormData) => Promise<void>;
}

export function LoginFormUI({
  form,
  error,
  isSubmitting,
  onSubmit,
}: LoginFormUIProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = form;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormInput
        label="Login"
        name="login"
        type="text"
        placeholder="nome de usuário"
        disabled={isSubmitting}
        register={register('login')}
        error={errors.login}
      />

      <FormInput
        label="Senha"
        name="password"
        type="password"
        placeholder="••••••••"
        disabled={isSubmitting}
        register={register('password')}
        error={errors.password}
      />

      {error && (
        <div className="rounded-md bg-destructive/10 p-3">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting || !isValid}
      >
        {isSubmitting ? 'Entrando...' : 'Entrar'}
      </Button>
    </form>
  );
}

