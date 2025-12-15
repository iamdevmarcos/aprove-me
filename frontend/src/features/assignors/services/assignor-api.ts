import { apiClient } from "@/src/services/api/instances/client"
import type {
  Assignor,
  CreateAssignorDto,
  UpdateAssignorDto,
} from "../types"

export const assignorApi = {
  getAll: async (): Promise<Assignor[]> => {
    const { data } = await apiClient.get<Assignor[]>("/integrations/assignor")
    return data
  },
  getById: async (id: string): Promise<Assignor> => {
    const { data } = await apiClient.get<Assignor>(
      `/integrations/assignor/${id}`
    )
    return data
  },
  create: async (payload: CreateAssignorDto): Promise<{ id: string }> => {
    const { data } = await apiClient.post<{ id: string }>(
      "/integrations/assignor",
      payload
    )
    return data
  },
  update: async (
    id: string,
    payload: UpdateAssignorDto
  ): Promise<Assignor> => {
    const { data } = await apiClient.patch<Assignor>(
      `/integrations/assignor/${id}`,
      payload
    )
    return data
  },
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/integrations/assignor/${id}`)
  },
}

