import { render, screen } from "@/src/helpers/testing"
import { Header } from "../header"

describe("Header", () => {
  it("should render logo and title", () => {
    render(<Header />)
    expect(screen.getByAltText("Bankme")).toBeInTheDocument()
    expect(screen.getByText("Aprove-me")).toBeInTheDocument()
  })

  it("should render navigation links", () => {
    render(<Header />)
    expect(screen.getByText("Recebíveis")).toBeInTheDocument()
    expect(screen.getByText("Cedentes")).toBeInTheDocument()
  })

  it("should have correct links", () => {
    render(<Header />)
    const payablesLink = screen.getByText("Recebíveis").closest("a")
    const assignorsLink = screen.getByText("Cedentes").closest("a")

    expect(payablesLink).toHaveAttribute("href", "/dashboard/payables")
    expect(assignorsLink).toHaveAttribute("href", "/dashboard/assignors")
  })

  it("should have link on logo", () => {
    render(<Header />)
    const logoLink = screen.getByAltText("Bankme").closest("a")
    expect(logoLink).toHaveAttribute("href", "/dashboard")
  })

  it("should render with sticky classes", () => {
    const { container } = render(<Header />)
    const header = container.querySelector("header")
    expect(header).toHaveClass("sticky")
    expect(header).toHaveClass("top-0")
  })
})

