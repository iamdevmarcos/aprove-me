import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

type SendEmailPayload = {
  to: string;
  subject: string;
  template?: string;
  data: Record<string, unknown>;
};

type SendBatchReportPayload = {
  batchId: string;
  succeeded: number;
  failed: number;
  retried?: number;
};

@Injectable()
export class NotificationClientService {
  private readonly logger = new Logger(NotificationClientService.name);
  private client: AxiosInstance;
  private baseURL: string;
  private reportEmail: string;
  private operationsEmail: string;

  constructor(private configService: ConfigService) {
    this.baseURL = this.configService.get<string>('notificationService.url');
    this.reportEmail =
      this.configService.get<string>('notificationService.reportEmail') ||
      'notificacoes@exemplo.com';
    this.operationsEmail =
      this.configService.get<string>('notificationService.operationsEmail') ||
      'operacoes@exemplo.com';

    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async sendBatchReport(payload: SendBatchReportPayload) {
    return this.safeCall(() =>
      this.client.post('/notifications/batch-report', {
        to: this.reportEmail,
        ...payload,
      }),
    );
  }

  async sendDeadLetterAlert(params: {
    batchJobId: string;
    batchItemId: string;
    errorMessage: string;
  }) {
    const payload: SendEmailPayload = {
      to: this.operationsEmail,
      subject: `Item ${params.batchItemId} movido para dead-letter`,
      template: 'dead-letter',
      data: params,
    };

    return this.safeCall(() =>
      this.client.post('/notifications/send', payload),
    );
  }

  private async safeCall(call: () => Promise<unknown>) {
    try {
      return await call();
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Erro ao contatar notification-service';

      this.logger.warn(
        `Falha ao chamar notification-service: ${message} (baseURL=${this.baseURL})`,
      );

      throw new HttpException(
        {
          statusCode:
            error?.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
          message,
        },
        error?.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
