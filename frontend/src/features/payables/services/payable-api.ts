import { apiClient } from "@/src/services/api/instances/client"
import type { Payable, CreatePayableDto, UpdatePayableDto } from "../types"

export const payableApi = {
  getAll: async (): Promise<Payable[]> => {
    const { data } = await apiClient.get<Payable[]>("/integrations/payable")
    return data
  },

  getById: async (id: string): Promise<Payable> => {
    const { data } = await apiClient.get<Payable>(`/integrations/payable/${id}`)
    return data
  },

  create: async (payload: CreatePayableDto): Promise<{ id: string }> => {
    const { data } = await apiClient.post<{ id: string }>(
      "/integrations/payable",
      payload
    )
    return data
  },

  update: async (
    id: string,
    payload: UpdatePayableDto
  ): Promise<Payable> => {
    const { data } = await apiClient.patch<Payable>(
      `/integrations/payable/${id}`,
      payload
    )
    return data
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/integrations/payable/${id}`)
  },
}

