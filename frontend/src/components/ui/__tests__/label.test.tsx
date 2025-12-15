import { render, screen } from "@/src/helpers/testing"
import { Label } from "../label"

describe("Label", () => {
  it("should render label with text", () => {
    render(<Label>Test Label</Label>)
    expect(screen.getByText("Test Label")).toBeInTheDocument()
  })

  it("should apply htmlFor correctly", () => {
    render(<Label htmlFor="test-input">Input Label</Label>)
    const label = screen.getByText("Input Label")
    expect(label).toHaveAttribute("for", "test-input")
  })

  it("should apply custom className", () => {
    render(<Label className="custom-label">Custom</Label>)
    const label = screen.getByText("Custom")
    expect(label).toHaveClass("custom-label")
  })

  it("should render children correctly", () => {
    render(
      <Label>
        <span>Nested content</span>
      </Label>
    )
    expect(screen.getByText("Nested content")).toBeInTheDocument()
  })
})

