import { render, screen, waitFor } from "@/src/helpers/testing"
import userEvent from "@testing-library/user-event"
import { AssignorForm } from "../assignor-form"

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

const mutateAsyncMock = jest.fn()

jest.mock("../../hooks/use-assignors", () => ({
  useCreateAssignor: () => ({
    mutateAsync: mutateAsyncMock,
  }),
}))

jest.mock("@/src/helpers/utils", () => ({
  ...jest.requireActual("@/src/helpers/utils"),
  setBackendErrors: jest.fn(),
}))

describe("AssignorForm", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should submit form with valid data and call mutation", async () => {
    mutateAsyncMock.mockResolvedValueOnce({ id: "assignor-1" })

    render(<AssignorForm />)

    await userEvent.type(
      screen.getByLabelText("Nome / Razão Social"),
      "Empresa Teste",
    )
    await userEvent.type(
      screen.getByLabelText("CPF / CNPJ"),
      "12345678901",
    )
    await userEvent.type(
      screen.getByLabelText("Email"),
      "email@example.com",
    )
    await userEvent.type(
      screen.getByLabelText("Telefone"),
      "11999999999",
    )

    await userEvent.click(
      screen.getByRole("button", { name: "Cadastrar Cedente" }),
    )

    await waitFor(() => {
      expect(mutateAsyncMock).toHaveBeenCalledWith({
        name: "Empresa Teste",
        document: "12345678901",
        email: "email@example.com",
        phone: "11999999999",
      })
    })
  })
})


