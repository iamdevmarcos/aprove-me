import { useState, useCallback } from "react"
import type { ChangeEvent } from "react"

type MaskFunction = (value: string) => string

interface UseMaskedInputProps {
  maskFn: MaskFunction
  unmaskFn?: (value: string) => string
  initialValue?: string
}

export function useMaskedInput({
  maskFn,
  unmaskFn,
  initialValue = "",
}: UseMaskedInputProps) {
  const [displayValue, setDisplayValue] = useState(maskFn(initialValue))

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value
      const maskedValue = maskFn(rawValue)
      setDisplayValue(maskedValue)
    },
    [maskFn]
  )

  const getRawValue = useCallback(() => {
    return unmaskFn ? unmaskFn(displayValue) : displayValue
  }, [displayValue, unmaskFn])

  const setValue = useCallback(
    (value: string) => {
      setDisplayValue(maskFn(value))
    },
    [maskFn]
  )

  return {
    displayValue,
    handleChange,
    getRawValue,
    setValue,
  }
}

