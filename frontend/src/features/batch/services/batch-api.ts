import { apiClient } from "@/src/services/api/instances/client"
import type { BatchJobResponse, BatchJobStatus } from "../types"

export function createBatchApi(basePath: string) {
  return {
    upload: async (file: File): Promise<BatchJobResponse> => {
      const formData = new FormData()
      formData.append("file", file)

      const { data } = await apiClient.post<BatchJobResponse>(
        basePath,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 30000,
        }
      )

      return data
    },

    getStatus: async (batchJobId: string): Promise<BatchJobStatus> => {
      const { data } = await apiClient.get<BatchJobStatus>(
        `${basePath}/${batchJobId}`
      )
      return data
    },

    retryItem: async (batchJobId: string, batchItemId: string): Promise<void> => {
      await apiClient.post(
        `${basePath}/${batchJobId}/items/${batchItemId}/retry`
      )
    },
  }
}


