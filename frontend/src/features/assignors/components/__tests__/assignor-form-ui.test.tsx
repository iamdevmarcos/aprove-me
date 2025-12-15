import { render, screen } from "@/src/helpers/testing"
import { AssignorFormUI } from "../assignor-form-ui"

describe("AssignorFormUI", () => {
  const defaultProps = {
    onSubmit: jest.fn(),
    register: jest.fn().mockReturnValue({}),
    errors: {},
    isSubmitting: false,
  }

  it("should render all form fields and submit button", () => {
    render(<AssignorFormUI {...defaultProps} />)

    expect(screen.getByLabelText("ID (UUID)")).toBeInTheDocument()
    expect(screen.getByLabelText("Nome / Razão Social")).toBeInTheDocument()
    expect(screen.getByLabelText("CPF / CNPJ")).toBeInTheDocument()
    expect(screen.getByLabelText("Email")).toBeInTheDocument()
    expect(screen.getByLabelText("Telefone")).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Cadastrar Cedente" }),
    ).toBeInTheDocument()
  })

  it("should show loading state when submitting", () => {
    render(<AssignorFormUI {...defaultProps} isSubmitting />)

    const button = screen.getByRole("button", { name: "Cadastrando..." })
    expect(button).toBeDisabled()
  })
})


