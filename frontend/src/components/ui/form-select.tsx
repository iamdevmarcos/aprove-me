import * as React from 'react';
import { UseFormRegisterReturn, FieldError } from 'react-hook-form';
import { Select } from './select';
import { Label } from './label';
import { cn } from '@/src/helpers/utils';

export interface FormSelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'name'> {
  label: string;
  name: string;
  register?: UseFormRegisterReturn;
  error?: FieldError;
  spacing?: 'sm' | 'md';
  children: React.ReactNode;
}

export function FormSelect({
  label,
  name,
  register,
  error,
  spacing = 'md',
  className,
  id,
  children,
  ...props
}: FormSelectProps) {
  const selectId = id || name;
  const spacingClass = spacing === 'sm' ? 'space-y-2' : 'space-y-3';

  return (
    <div className={cn(spacingClass, className)}>
      <Label htmlFor={selectId}>{label}</Label>
      <Select
        id={selectId}
        {...register}
        {...props}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${selectId}-error` : undefined}
      >
        {children}
      </Select>
      {error && (
        <p
          id={`${selectId}-error`}
          className="text-sm text-destructive"
          role="alert"
        >
          {error.message}
        </p>
      )}
    </div>
  );
}

