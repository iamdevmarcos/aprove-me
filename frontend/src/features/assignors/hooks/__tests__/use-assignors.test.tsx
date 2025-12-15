import { renderHook, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import {
  useAssignors,
  useAssignor,
  useCreateAssignor,
  useUpdateAssignor,
  useDeleteAssignor,
} from "../use-assignors"
import { assignorApi } from "../../services/assignor-api"

jest.mock("../../services/assignor-api", () => ({
  assignorApi: {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}))

const mockedAssignorApi = assignorApi as jest.Mocked<typeof assignorApi>

function createWrapper() {
  const queryClient = new QueryClient()

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    )
  }
}

describe("assignors hooks", () => {
  it("useAssignors should fetch assignors list", async () => {
    mockedAssignorApi.getAll.mockResolvedValueOnce([
      { id: "1", name: "Assignor 1" },
    ] as any)

    const { result } = renderHook(() => useAssignors(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.data).toEqual([{ id: "1", name: "Assignor 1" }])
    })
  })

  it("useAssignor should fetch single assignor by id", async () => {
    mockedAssignorApi.getById.mockResolvedValueOnce({
      id: "1",
      name: "Assignor 1",
    } as any)

    const { result } = renderHook(() => useAssignor("1"), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.data).toEqual({
        id: "1",
        name: "Assignor 1",
      })
    })
  })

  it("useCreateAssignor should call create API and invalidate list", async () => {
    mockedAssignorApi.create.mockResolvedValueOnce({
      id: "1",
      name: "Assignor 1",
    } as any)

    const { result } = renderHook(() => useCreateAssignor(), {
      wrapper: createWrapper(),
    })

    await result.current.mutateAsync({ name: "Assignor 1" } as any)

    expect(mockedAssignorApi.create).toHaveBeenCalledWith({
      name: "Assignor 1",
    })
  })

  it("useUpdateAssignor should call update API", async () => {
    mockedAssignorApi.update.mockResolvedValueOnce({
      id: "1",
      name: "Updated Assignor",
    } as any)

    const { result } = renderHook(() => useUpdateAssignor(), {
      wrapper: createWrapper(),
    })

    await result.current.mutateAsync({
      id: "1",
      payload: { name: "Updated Assignor" } as any,
    })

    expect(mockedAssignorApi.update).toHaveBeenCalledWith("1", {
      name: "Updated Assignor",
    })
  })

  it("useDeleteAssignor should call delete API", async () => {
    mockedAssignorApi.delete.mockResolvedValueOnce({} as any)

    const { result } = renderHook(() => useDeleteAssignor(), {
      wrapper: createWrapper(),
    })

    await result.current.mutateAsync("1")

    expect(mockedAssignorApi.delete).toHaveBeenCalledWith("1")
  })
})


