import { apiClient } from "@/src/services/api/instances/client"
import type {
  BatchJobResponse,
  BatchJobStatus,
} from "../types/batch"

export const payableBatchApi = {
  upload: async (file: File): Promise<BatchJobResponse> => {
    const formData = new FormData()
    formData.append("file", file)

    const { data } = await apiClient.post<BatchJobResponse>(
      "/integrations/payable/batch",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    )

    return data
  },

  getStatus: async (batchJobId: string): Promise<BatchJobStatus> => {
    const { data } = await apiClient.get<BatchJobStatus>(
      `/integrations/payable/batch/${batchJobId}`
    )
    return data
  },

  retryItem: async (batchJobId: string, batchItemId: string): Promise<void> => {
    await apiClient.post(
      `/integrations/payable/batch/${batchJobId}/items/${batchItemId}/retry`
    )
  },
}


