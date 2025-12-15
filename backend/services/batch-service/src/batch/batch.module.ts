import { Module } from '@nestjs/common';
import { BatchController } from './batch.controller';
import { BatchService } from './batch.service';
import { PrismaService } from '../prisma/prisma.service';
import { FileModule } from '../file/file.module';
import { QueueModule } from '../queue/queue.module';
import { IntegrationModule } from '../integration/integration.module';

@Module({
  imports: [FileModule, QueueModule, IntegrationModule],
  controllers: [BatchController],
  providers: [BatchService, PrismaService],
})
export class BatchModule {}
