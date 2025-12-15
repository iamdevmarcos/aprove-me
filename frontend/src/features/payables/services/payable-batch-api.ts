import { createBatchApi } from "@/src/features/batch/services/batch-api"
import type { BatchJobResponse, BatchJobStatus } from "@/src/features/batch/types"

export const payableBatchApi = createBatchApi("/integrations/payable/batch") as {
  upload: (file: File) => Promise<BatchJobResponse>
  getStatus: (batchJobId: string) => Promise<BatchJobStatus>
  retryItem: (batchJobId: string, batchItemId: string) => Promise<void>
}

