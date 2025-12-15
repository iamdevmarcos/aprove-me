import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import Mask from "@/src/hooks/masks"
import { FieldValues, UseFormSetError } from "react-hook-form"
import { AxiosError } from "axios"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
}

export function formatDocument(document: string): string {
  if (!document) return ""
  const clean = document.replace(/\D/g, "")
  return clean.length <= 11 ? Mask.CPF(document) : Mask.CNPJ(document)
}

export function setBackendErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>
): void {
  let responseData: any

  if (error instanceof AxiosError) {
    responseData = error.response?.data
  } else if (error && typeof error === 'object') {
    if ('response' in error) {
      const axiosLikeError = error as { response?: { data?: any } }
      responseData = axiosLikeError.response?.data
    } else {
      responseData = error
    }
  }

  if (!responseData || typeof responseData !== 'object') {
    return
  }

  if (responseData.errors && typeof responseData.errors === 'object' && !Array.isArray(responseData.errors)) {
    Object.entries(responseData.errors).forEach(([field, messages]) => {
      if (Array.isArray(messages) && messages.length > 0) {
        setError(field as any, {
          type: "server",
          message: messages[0],
        })
      } else if (typeof messages === 'string') {
        setError(field as any, {
          type: "server",
          message: messages,
        })
      }
    })
    return
  }

  if (responseData.message && Array.isArray(responseData.message)) {
    responseData.message.forEach((item: any) => {
      if (typeof item === 'object' && item !== null && 'field' in item && 'message' in item) {
        setError(item.field as any, {
          type: "server",
          message: item.message,
        })
      }
    })
    return
  }
}

