import { renderHook, act } from "@testing-library/react"
import { useMaskedInput } from "../use-masked-input"

const mockMaskFn = (value: string) => value.toUpperCase()
const mockUnmaskFn = (value: string) => value.toLowerCase()

describe("useMaskedInput", () => {
  it("should initialize with masked value", () => {
    const { result } = renderHook(() =>
      useMaskedInput({
        maskFn: mockMaskFn,
        initialValue: "hello",
      })
    )

    expect(result.current.displayValue).toBe("HELLO")
  })

  it("should apply mask on value change", () => {
    const { result } = renderHook(() =>
      useMaskedInput({
        maskFn: mockMaskFn,
      })
    )

    act(() => {
      const event = {
        target: { value: "world" },
      } as React.ChangeEvent<HTMLInputElement>
      result.current.handleChange(event)
    })

    expect(result.current.displayValue).toBe("WORLD")
  })

  it("should return raw value when unmaskFn is provided", () => {
    const { result } = renderHook(() =>
      useMaskedInput({
        maskFn: mockMaskFn,
        unmaskFn: mockUnmaskFn,
        initialValue: "test",
      })
    )

    expect(result.current.getRawValue()).toBe("test")
  })

  it("should return displayValue when unmaskFn is not provided", () => {
    const { result } = renderHook(() =>
      useMaskedInput({
        maskFn: mockMaskFn,
        initialValue: "test",
      })
    )

    expect(result.current.getRawValue()).toBe("TEST")
  })

  it("should update value programmatically with setValue", () => {
    const { result } = renderHook(() =>
      useMaskedInput({
        maskFn: mockMaskFn,
      })
    )

    act(() => {
      result.current.setValue("newvalue")
    })

    expect(result.current.displayValue).toBe("NEWVALUE")
  })

  it("should handle empty string", () => {
    const { result } = renderHook(() =>
      useMaskedInput({
        maskFn: mockMaskFn,
        initialValue: "",
      })
    )

    expect(result.current.displayValue).toBe("")
  })

  it("should apply mask on consecutive changes", () => {
    const { result } = renderHook(() =>
      useMaskedInput({
        maskFn: mockMaskFn,
      })
    )

    act(() => {
      const event1 = {
        target: { value: "first" },
      } as React.ChangeEvent<HTMLInputElement>
      result.current.handleChange(event1)
    })

    expect(result.current.displayValue).toBe("FIRST")

    act(() => {
      const event2 = {
        target: { value: "second" },
      } as React.ChangeEvent<HTMLInputElement>
      result.current.handleChange(event2)
    })

    expect(result.current.displayValue).toBe("SECOND")
  })
})

