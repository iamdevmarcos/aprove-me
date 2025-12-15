export type SendEmailPayload = {
  to: string;
  subject: string;
  template?: string;
  data: Record<string, unknown>;
};

export type SendBatchReportPayload = {
  to: string;
  batchId?: string;
  succeeded: number;
  failed: number;
  retried?: number;
};
