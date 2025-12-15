export type BatchStatus =
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED"
  | "PARTIALLY_FAILED"

export interface BatchJobResponse {
  batchJobId: string
  status: string
  totalItems: number
  message: string
}

export interface BatchDeadLetterItem {
  id: string
  errorMessage: string | null
  retryCount: number
  createdAt: string
}

export interface BatchJobStatus {
  id: string
  status: BatchStatus
  totalItems: number
  processedItems: number
  successCount: number
  failureCount: number
  progress: number
  startedAt: string | null
  completedAt: string | null
  createdAt: string
  deadLetters: BatchDeadLetterItem[]
}


