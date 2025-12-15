import { render, screen } from "@/src/helpers/testing"
import { Button } from "../button"

describe("Button", () => {
  it("should render button with text", () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText("Click me")).toBeInTheDocument()
  })

  it("should apply default variant", () => {
    render(<Button>Default</Button>)
    const button = screen.getByText("Default")
    expect(button).toHaveClass("bg-primary")
  })

  it("should apply outline variant", () => {
    render(<Button variant="outline">Outline</Button>)
    const button = screen.getByText("Outline")
    expect(button).toHaveClass("border-input")
  })

  it("should apply ghost variant", () => {
    render(<Button variant="ghost">Ghost</Button>)
    const button = screen.getByText("Ghost")
    expect(button).toHaveClass("hover:bg-accent")
  })

  it("should apply default size", () => {
    render(<Button>Default Size</Button>)
    const button = screen.getByText("Default Size")
    expect(button).toHaveClass("h-9")
  })

  it("should apply sm size", () => {
    render(<Button size="sm">Small</Button>)
    const button = screen.getByText("Small")
    expect(button).toHaveClass("h-8")
  })

  it("should apply lg size", () => {
    render(<Button size="lg">Large</Button>)
    const button = screen.getByText("Large")
    expect(button).toHaveClass("h-10")
  })

  it("should render as disabled", () => {
    render(<Button disabled>Disabled</Button>)
    const button = screen.getByText("Disabled")
    expect(button).toBeDisabled()
  })

  it("should call onClick when clicked", () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click</Button>)
    const button = screen.getByText("Click")
    button.click()
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it("should not call onClick when disabled", () => {
    const handleClick = jest.fn()
    render(
      <Button disabled onClick={handleClick}>
        Disabled Click
      </Button>
    )
    const button = screen.getByText("Disabled Click")
    button.click()
    expect(handleClick).not.toHaveBeenCalled()
  })

  it("should apply custom className", () => {
    render(<Button className="custom-class">Custom</Button>)
    const button = screen.getByText("Custom")
    expect(button).toHaveClass("custom-class")
  })
})

