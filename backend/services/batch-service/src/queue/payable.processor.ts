import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IntegrationsClientService } from '../integration/integrations-client.service';
import { NotificationClientService } from '../integration/notification-client.service';
import { CreatePayableDto } from '../batch/dto/create-payable.dto';
import { BatchItemStatus, BatchJobStatus } from '@prisma/client';

interface PayableJobData {
  batchJobId: string;
  batchItemId: string;
  payableData: CreatePayableDto;
}

@Processor('payable-processing')
@Injectable()
export class PayableProcessor extends WorkerHost {
  private readonly logger = new Logger(PayableProcessor.name);

  constructor(
    private prisma: PrismaService,
    private integrationsClient: IntegrationsClientService,
    private notificationClient: NotificationClientService,
  ) {
    super();
  }

  async process(job: Job<PayableJobData>): Promise<void> {
    const { batchJobId, batchItemId, payableData } = job.data;

    try {
      await this.prisma.batchItem.update({
        where: { id: batchItemId },
        data: { status: BatchItemStatus.PROCESSING },
      });

      await this.integrationsClient.createPayable(payableData);

      await this.prisma.batchItem.update({
        where: { id: batchItemId },
        data: {
          status: BatchItemStatus.PROCESSED,
          processedAt: new Date(),
        },
      });

      await this.incrementSuccessCount(batchJobId);
      await this.checkBatchCompletion(batchJobId);
    } catch (error: any) {
      this.logger.error(
        `Failed to process batch item ${batchItemId}: ${error.message}`,
      );

      const retryCount = (job.attemptsMade || 0) + 1;

      if (retryCount >= 4) {
        await this.moveToDeadLetter(
          batchJobId,
          batchItemId,
          payableData,
          error,
        );
        await this.incrementFailureCount(batchJobId);
      } else {
        await this.prisma.batchItem.update({
          where: { id: batchItemId },
          data: {
            status: BatchItemStatus.FAILED,
            retryCount,
            errorMessage: error.message,
          },
        });
      }

      await this.checkBatchCompletion(batchJobId);

      throw error;
    }
  }

  private async incrementSuccessCount(batchJobId: string): Promise<void> {
    await this.prisma.batchJob.update({
      where: { id: batchJobId },
      data: {
        successCount: { increment: 1 },
        processedItems: { increment: 1 },
      },
    });
  }

  private async incrementFailureCount(batchJobId: string): Promise<void> {
    await this.prisma.batchJob.update({
      where: { id: batchJobId },
      data: {
        failureCount: { increment: 1 },
        processedItems: { increment: 1 },
      },
    });
  }

  private async notifyBatchCompletion(batchJobId: string): Promise<void> {
    const updated = await this.prisma.batchJob.findUnique({
      where: { id: batchJobId },
    });

    if (!updated) return;

    try {
      await this.notificationClient.sendBatchReport({
        batchId: batchJobId,
        succeeded: updated.successCount,
        failed: updated.failureCount,
        retried: updated.failureCount, // retries refletem falhas processadas
      });
    } catch (error) {
      this.logger.warn(
        `Falha ao enviar resumo de lote ${batchJobId} para notification-service: ${
          (error as Error).message
        }`,
      );
    }
  }

  private async moveToDeadLetter(
    batchJobId: string,
    batchItemId: string,
    payableData: CreatePayableDto,
    error: any,
  ): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.batchItem.update({
        where: { id: batchItemId },
        data: {
          status: BatchItemStatus.DEAD_LETTER,
          retryCount: 4,
          errorMessage: error.message,
        },
      }),
      this.prisma.deadLetterItem.create({
        data: {
          batchJobId,
          batchItemId,
          payableData: JSON.stringify(payableData),
          errorMessage: error.message,
          retryCount: 4,
        },
      }),
    ]);

    try {
      await this.notificationClient.sendDeadLetterAlert({
        batchJobId,
        batchItemId,
        errorMessage: error?.message || 'Erro não informado',
      });
    } catch (notifyError) {
      this.logger.warn(
        `Falha ao notificar dead-letter para item ${batchItemId}: ${
          (notifyError as Error).message
        }`,
      );
    }
  }

  private async checkBatchCompletion(batchJobId: string): Promise<void> {
    const batchJob = await this.prisma.batchJob.findUnique({
      where: { id: batchJobId },
    });

    if (!batchJob) return;

    if (batchJob.processedItems >= batchJob.totalItems) {
      let status: BatchJobStatus = BatchJobStatus.COMPLETED;

      if (batchJob.failureCount > 0 && batchJob.successCount > 0) {
        status = BatchJobStatus.PARTIALLY_FAILED;
      } else if (batchJob.successCount === 0) {
        status = BatchJobStatus.FAILED;
      }

      await this.prisma.batchJob.update({
        where: { id: batchJobId },
        data: {
          status,
          completedAt: new Date(),
        },
      });

      await this.notifyBatchCompletion(batchJobId);
    }
  }
}
