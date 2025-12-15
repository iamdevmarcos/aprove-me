import { render, screen } from "@/src/helpers/testing"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../card"

describe("Card Components", () => {
  describe("Card", () => {
    it("should render card", () => {
      render(<Card data-testid="card">Content</Card>)
      expect(screen.getByTestId("card")).toBeInTheDocument()
    })

    it("should apply custom className", () => {
      render(<Card className="custom-card" data-testid="card">Content</Card>)
      expect(screen.getByTestId("card")).toHaveClass("custom-card")
    })
  })

  describe("CardHeader", () => {
    it("should render header", () => {
      render(<CardHeader data-testid="header">Header</CardHeader>)
      expect(screen.getByTestId("header")).toBeInTheDocument()
    })
  })

  describe("CardTitle", () => {
    it("should render title", () => {
      render(<CardTitle>Title</CardTitle>)
      expect(screen.getByText("Title")).toBeInTheDocument()
    })

    it("should render as div by default", () => {
      render(<CardTitle>Title</CardTitle>)
      const title = screen.getByText("Title")
      expect(title.tagName).toBe("DIV")
    })
  })

  describe("CardDescription", () => {
    it("should render description", () => {
      render(<CardDescription>Description</CardDescription>)
      expect(screen.getByText("Description")).toBeInTheDocument()
    })
  })

  describe("CardContent", () => {
    it("should render content", () => {
      render(<CardContent data-testid="content">Content</CardContent>)
      expect(screen.getByTestId("content")).toBeInTheDocument()
    })
  })

  describe("CardFooter", () => {
    it("should render footer", () => {
      render(<CardFooter data-testid="footer">Footer</CardFooter>)
      expect(screen.getByTestId("footer")).toBeInTheDocument()
    })
  })

  describe("Card Integration", () => {
    it("should render complete card", () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Test Card</CardTitle>
            <CardDescription>Test Description</CardDescription>
          </CardHeader>
          <CardContent>Test Content</CardContent>
          <CardFooter>Test Footer</CardFooter>
        </Card>
      )

      expect(screen.getByText("Test Card")).toBeInTheDocument()
      expect(screen.getByText("Test Description")).toBeInTheDocument()
      expect(screen.getByText("Test Content")).toBeInTheDocument()
      expect(screen.getByText("Test Footer")).toBeInTheDocument()
    })
  })
})

