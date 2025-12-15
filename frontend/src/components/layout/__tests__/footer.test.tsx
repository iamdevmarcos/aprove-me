import { render, screen } from "@/src/helpers/testing"
import { Footer } from "../footer"

describe("Footer", () => {
  it("should render the footer text", () => {
    render(<Footer />)

    const year = new Date().getFullYear()
    expect(screen.getByText(`ʕ•ᴥ•ʔ © Marcos Mendes ${year}`)).toBeInTheDocument()
  })

  it("should render with correct classes", () => {
    const { container } = render(<Footer />)
    const footer = container.querySelector("footer")

    expect(footer).toHaveClass("w-full")
    expect(footer).toHaveClass("flex", "items-center", "justify-center")
  })
})



