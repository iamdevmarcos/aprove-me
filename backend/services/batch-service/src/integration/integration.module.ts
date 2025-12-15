import { Module } from '@nestjs/common';
import { IntegrationsClientService } from './integrations-client.service';
import { NotificationClientService } from './notification-client.service';

@Module({
  providers: [IntegrationsClientService, NotificationClientService],
  exports: [IntegrationsClientService, NotificationClientService],
})
export class IntegrationModule {}
