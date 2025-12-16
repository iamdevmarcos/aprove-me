import { BullModule } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';

export const PAYABLE_QUEUE_NAME = 'payable-processing';
export const MAX_JOB_ATTEMPTS = 4;
export const JOB_BACKOFF_DELAY_MS = 2_000;
export const REMOVE_ON_COMPLETE_AGE_SECONDS = 24 * 3600;
export const REMOVE_ON_COMPLETE_COUNT = 1_000;

export const PayableQueue = BullModule.registerQueue({
  name: PAYABLE_QUEUE_NAME,
});

export function getQueueConfig(configService: ConfigService) {
  return {
    connection: {
      host: configService.get<string>('redis.host'),
      port: configService.get<number>('redis.port'),
    },
    defaultJobOptions: {
      attempts: MAX_JOB_ATTEMPTS,
      backoff: {
        type: 'exponential' as const,
        delay: JOB_BACKOFF_DELAY_MS,
      },
      removeOnComplete: {
        age: REMOVE_ON_COMPLETE_AGE_SECONDS,
        count: REMOVE_ON_COMPLETE_COUNT,
      },
      removeOnFail: false,
    },
  };
}
