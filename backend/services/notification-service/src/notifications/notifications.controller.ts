import { Body, Controller, Post } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import type { SendBatchReportPayload, SendEmailPayload } from './types';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('send')
  send(@Body() payload: SendEmailPayload) {
    return this.notificationsService.sendEmail(payload);
  }

  @Post('batch-report')
  sendBatchReport(@Body() payload: SendBatchReportPayload) {
    return this.notificationsService.sendBatchReport(payload);
  }
}
