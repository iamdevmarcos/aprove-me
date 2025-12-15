import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PayableProcessor } from './payable.processor';
import { PrismaService } from '../prisma/prisma.service';
import { getQueueConfig } from './payable.queue';
import { IntegrationModule } from '../integration/integration.module';

@Module({
  imports: [
    IntegrationModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getQueueConfig,
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: 'payable-processing',
    }),
  ],
  providers: [PayableProcessor, PrismaService],
  exports: [BullModule],
})
export class QueueModule {}
