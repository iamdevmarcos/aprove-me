import * as React from 'react';
import { UseFormRegisterReturn, FieldError } from 'react-hook-form';
import { Input } from './input';
import { Label } from './label';
import { cn } from '@/src/helpers/utils';

export interface FormInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name'> {
  label: string;
  name: string;
  register?: UseFormRegisterReturn;
  error?: FieldError;
  spacing?: 'sm' | 'md';
}

export function FormInput({
  label,
  name,
  register,
  error,
  spacing = 'md',
  className,
  id,
  ...props
}: FormInputProps) {
  const inputId = id || name;
  const spacingClass = spacing === 'sm' ? 'space-y-2' : 'space-y-3';

  return (
    <div className={cn(spacingClass, className)}>
      <Label htmlFor={inputId}>{label}</Label>
      <Input
        id={inputId}
        {...register}
        {...props}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${inputId}-error` : undefined}
      />
      {error && (
        <p
          id={`${inputId}-error`}
          className="text-sm text-destructive"
          role="alert"
        >
          {error.message}
        </p>
      )}
    </div>
  );
}

