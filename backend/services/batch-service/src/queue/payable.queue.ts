import { BullModule } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';

export const PayableQueue = BullModule.registerQueue({
  name: 'payable-processing',
});

export function getQueueConfig(configService: ConfigService) {
  return {
    connection: {
      host: configService.get<string>('redis.host'),
      port: configService.get<number>('redis.port'),
    },
    defaultJobOptions: {
      attempts: 4,
      backoff: {
        type: 'exponential' as const,
        delay: 2000,
      },
      removeOnComplete: {
        age: 24 * 3600,
        count: 1000,
      },
      removeOnFail: false,
    },
  };
}
