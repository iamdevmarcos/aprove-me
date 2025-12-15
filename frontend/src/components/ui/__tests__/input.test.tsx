import { render, screen } from "@/src/helpers/testing"
import { Input } from "../input"

describe("Input", () => {
  it("should render input", () => {
    render(<Input placeholder="Enter text" />)
    expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument()
  })

  it("should accept default value", () => {
    render(<Input defaultValue="Default value" />)
    const input = screen.getByDisplayValue("Default value")
    expect(input).toBeInTheDocument()
  })

  it("should apply correct type", () => {
    render(<Input type="email" placeholder="Email" />)
    const input = screen.getByPlaceholderText("Email")
    expect(input).toHaveAttribute("type", "email")
  })

  it("should render as disabled", () => {
    render(<Input disabled placeholder="Disabled" />)
    const input = screen.getByPlaceholderText("Disabled")
    expect(input).toBeDisabled()
  })

  it("should apply custom className", () => {
    render(<Input className="custom-input" placeholder="Custom" />)
    const input = screen.getByPlaceholderText("Custom")
    expect(input).toHaveClass("custom-input")
  })
})

