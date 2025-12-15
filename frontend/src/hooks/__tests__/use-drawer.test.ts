import { renderHook, act } from "@testing-library/react"
import { useDrawer } from "../use-drawer"

describe("useDrawer", () => {
  it("should initialize with drawer closed by default", () => {
    const { result } = renderHook(() => useDrawer())

    expect(result.current.isOpen).toBe(false)
  })

  it("should initialize with custom value", () => {
    const { result } = renderHook(() => useDrawer(true))

    expect(result.current.isOpen).toBe(true)
  })

  it("should open drawer", () => {
    const { result } = renderHook(() => useDrawer())

    act(() => {
      result.current.open()
    })

    expect(result.current.isOpen).toBe(true)
  })

  it("should close drawer", () => {
    const { result } = renderHook(() => useDrawer(true))

    act(() => {
      result.current.close()
    })

    expect(result.current.isOpen).toBe(false)
  })

  it("should toggle drawer state", () => {
    const { result } = renderHook(() => useDrawer())

    act(() => {
      result.current.toggle()
    })

    expect(result.current.isOpen).toBe(true)

    act(() => {
      result.current.toggle()
    })

    expect(result.current.isOpen).toBe(false)
  })

  it("should set drawer state", () => {
    const { result } = renderHook(() => useDrawer())

    act(() => {
      result.current.setIsOpen(true)
    })

    expect(result.current.isOpen).toBe(true)

    act(() => {
      result.current.setIsOpen(false)
    })

    expect(result.current.isOpen).toBe(false)
  })

  it("should allow multiple consecutive operations", () => {
    const { result } = renderHook(() => useDrawer())

    act(() => {
      result.current.open()
    })
    expect(result.current.isOpen).toBe(true)

    act(() => {
      result.current.close()
    })
    expect(result.current.isOpen).toBe(false)

    act(() => {
      result.current.toggle()
    })
    expect(result.current.isOpen).toBe(true)

    act(() => {
      result.current.setIsOpen(false)
    })
    expect(result.current.isOpen).toBe(false)
  })
})

