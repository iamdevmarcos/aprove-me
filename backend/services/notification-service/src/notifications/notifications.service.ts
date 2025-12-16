import { Injectable, Logger } from '@nestjs/common';
import { SendBatchReportPayload, SendEmailPayload } from './types';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  sendEmail(payload: SendEmailPayload) {
    this.logger.log(
      `Simulated email dispatch -> to: ${payload.to} | subject: ${payload.subject}`,
    );

    this.logger.debug(`Email payload: ${JSON.stringify(payload)}`);
    return { message: 'Email sent' };
  }

  sendBatchReport(payload: SendBatchReportPayload) {
    this.sendEmail({
      to: payload.to,
      subject: `Lote ${payload.batchId ?? 'sem-id'} processado`,
      template: 'batch-processed',
      data: {
        batchId: payload.batchId,
        succeeded: payload.succeeded,
        failed: payload.failed,
        retried: payload.retried,
      },
    });

    return { message: 'Batch report sent' };
  }
}
