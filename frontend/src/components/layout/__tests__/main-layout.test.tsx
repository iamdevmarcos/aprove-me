import { render, screen } from "@/src/helpers/testing"
import { MainLayout } from "../main-layout"

jest.mock("../header", () => ({
  Header: () => <header data-testid="header-mock" />,
}))

jest.mock("../footer", () => ({
  Footer: () => <footer data-testid="footer-mock" />,
}))

jest.mock("@/src/components/ui/noise", () => ({
  Noise: ({ patternAlpha }: { patternAlpha: number }) => (
    <div data-testid="noise-mock" data-pattern-alpha={patternAlpha} />
  ),
}))

describe("MainLayout", () => {
  it("should render header, footer, noise and children", () => {
    render(
      <MainLayout>
        <span>Content</span>
      </MainLayout>,
    )

    expect(screen.getByTestId("header-mock")).toBeInTheDocument()
    expect(screen.getByTestId("footer-mock")).toBeInTheDocument()
    expect(screen.getByTestId("noise-mock")).toBeInTheDocument()
    expect(screen.getByText("Content")).toBeInTheDocument()
  })

  it("should render with correct layout classes", () => {
    const { container } = render(
      <MainLayout>
        <span>Content</span>
      </MainLayout>,
    )

    const root = container.firstElementChild
    expect(root).toHaveClass("relative", "flex", "min-h-screen", "flex-col", "bg-[#FAFAFA]")
  })
})