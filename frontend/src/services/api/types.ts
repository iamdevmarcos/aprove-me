export interface ApiError {
  message: string;
  statusCode?: number;
  error?: string;
  errors?: Record<string, string[]>;
}

