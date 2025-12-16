import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FileParserService } from '../file/file-parser.service';
import { FileValidatorService } from '../file/file-validator.service';
import { FileStorageService } from '../file/file-storage.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { BatchJobStatus, BatchItemStatus } from '@prisma/client';
import { CreatePayableDto } from './dto/create-payable.dto';

@Injectable()
export class BatchService {
  private readonly logger = new Logger(BatchService.name);

  constructor(
    private prisma: PrismaService,
    private fileParser: FileParserService,
    private fileValidator: FileValidatorService,
    private fileStorage: FileStorageService,
    @InjectQueue('payable-processing') private payableQueue: Queue,
  ) {}

  private validateFile(
    fileBuffer: Buffer,
    fileName: string,
    maxItems: number,
    maxFileSize: number,
  ) {
    this.fileValidator.validateFileSize(fileBuffer.length, maxFileSize);
    this.fileValidator.validateFileExtension(fileName);
  }

  private async parseCsv(fileBuffer: Buffer) {
    const payables = await this.fileParser.parseCSV(fileBuffer);
    if (payables.length === 0) {
      throw new BadRequestException('File is empty or contains no valid data');
    }
    return payables;
  }

  private validateMaxItems(payables: any[], maxItems: number) {
    this.fileValidator.validateMaxItems(payables.length, maxItems);
  }

  private async validatePayables(payables: any[]) {
    const validatedPayables: CreatePayableDto[] = [];
    for (let i = 0; i < payables.length; i++) {
      try {
        const validatedPayable = await this.fileValidator.validatePayableData(
          payables[i],
          i,
        );
        validatedPayables.push(validatedPayable);
      } catch (error: any) {
        this.logger.warn(`Skipping invalid row ${i + 1}: ${error.message}`);
      }
    }
    if (validatedPayables.length === 0) {
      throw new BadRequestException('No valid payables found in the file');
    }
    return validatedPayables;
  }

  private async createBatchJobEntity(fileName: string, totalItems: number) {
    return this.prisma.batchJob.create({
      data: {
        fileName,
        totalItems,
        status: BatchJobStatus.PENDING,
      },
    });
  }

  private async updateBatchJobFilePath(batchJobId: string, filePath: string) {
    await this.prisma.batchJob.update({
      where: { id: batchJobId },
      data: { filePath },
    });
  }

  private async failBatchJob(batchJobId: string, error: any) {
    this.logger.error(
      `Failed to process batch items for job ${batchJobId}: ${error.message}`,
    );
    this.prisma.batchJob
      .update({
        where: { id: batchJobId },
        data: { status: BatchJobStatus.FAILED },
      })
      .catch((updateError) => {
        this.logger.error(
          `Failed to update batch job status: ${updateError.message}`,
        );
      });
  }

  async createBatchJob(
    fileBuffer: Buffer,
    fileName: string,
    maxItems: number,
    maxFileSize: number,
  ): Promise<{ batchJobId: string; totalItems: number }> {
    this.validateFile(fileBuffer, fileName, maxItems, maxFileSize);
    const payables = await this.parseCsv(fileBuffer);
    this.validateMaxItems(payables, maxItems);
    const validatedPayables = await this.validatePayables(payables);

    const batchJob = await this.createBatchJobEntity(
      fileName,
      validatedPayables.length,
    );
    const filePath = await this.fileStorage.saveFile(
      fileBuffer,
      batchJob.id,
      fileName,
    );
    await this.updateBatchJobFilePath(batchJob.id, filePath);

    this.processBatchItemsInBackground(batchJob.id, validatedPayables).catch(
      (error) => this.failBatchJob(batchJob.id, error),
    );

    return {
      batchJobId: batchJob.id,
      totalItems: validatedPayables.length,
    };
  }

  private readonly BATCH_SIZE = 500;

  private async createBatchItems(
    batchJobId: string,
    validatedPayables: CreatePayableDto[],
  ) {
    const items: Array<{ id: string; payableData: string }> = [];
    for (let i = 0; i < validatedPayables.length; i += this.BATCH_SIZE) {
      const chunk = validatedPayables.slice(i, i + this.BATCH_SIZE);
      this.logger.log(
        `Creating batch items ${i + 1}-${Math.min(i + this.BATCH_SIZE, validatedPayables.length)} of ${validatedPayables.length}`,
      );
      const chunkItems = await Promise.all(
        chunk.map((payable) =>
          this.prisma.batchItem.create({
            data: {
              batchJobId,
              payableData: JSON.stringify(payable),
              status: BatchItemStatus.PENDING,
            },
          }),
        ),
      );
      items.push(...chunkItems);
    }
    return items;
  }

  private async updateBatchStatusToProcessing(batchJobId: string) {
    await this.prisma.batchJob.update({
      where: { id: batchJobId },
      data: { status: BatchJobStatus.PROCESSING, startedAt: new Date() },
    });
  }

  private async addItemsToQueue(
    batchJobId: string,
    batchItems: Array<{ id: string; payableData: string }>,
  ) {
    for (let i = 0; i < batchItems.length; i += this.BATCH_SIZE) {
      const chunk = batchItems.slice(i, i + this.BATCH_SIZE);
      await Promise.all(
        chunk.map((item) =>
          this.payableQueue.add('process-payable', {
            batchJobId,
            batchItemId: item.id,
            payableData: JSON.parse(item.payableData),
          }),
        ),
      );
    }
  }

  private async processBatchItemsInBackground(
    batchJobId: string,
    validatedPayables: CreatePayableDto[],
  ): Promise<void> {
    this.logger.log(
      `Starting background processing of ${validatedPayables.length} items for batch job ${batchJobId}`,
    );
    const batchItems = await this.createBatchItems(
      batchJobId,
      validatedPayables,
    );
    await this.updateBatchStatusToProcessing(batchJobId);
    await this.addItemsToQueue(batchJobId, batchItems);
    this.logger.log(
      `Completed background processing for batch job ${batchJobId}. All ${batchItems.length} items added to queue.`,
    );
  }

  private mapDeadLetters(items: any[]) {
    return items.map((item) => ({
      id: item.id,
      errorMessage: item.errorMessage,
      retryCount: item.retryCount,
      createdAt: item.createdAt,
    }));
  }

  async getBatchJobStatus(batchJobId: string) {
    const batchJob = await this.prisma.batchJob.findUnique({
      where: { id: batchJobId },
      include: {
        items: {
          where: { status: BatchItemStatus.DEAD_LETTER },
          take: 10,
        },
      },
    });

    if (!batchJob) {
      throw new BadRequestException('Batch job not found');
    }

    const boundedProcessed =
      batchJob.totalItems > 0
        ? Math.min(batchJob.processedItems, batchJob.totalItems)
        : batchJob.processedItems;

    const progress =
      batchJob.totalItems > 0
        ? (boundedProcessed / batchJob.totalItems) * 100
        : 0;

    return {
      id: batchJob.id,
      status: batchJob.status,
      totalItems: batchJob.totalItems,
      processedItems: batchJob.processedItems,
      successCount: batchJob.successCount,
      failureCount: batchJob.failureCount,
      progress: Math.round(progress * 100) / 100,
      startedAt: batchJob.startedAt,
      completedAt: batchJob.completedAt,
      createdAt: batchJob.createdAt,
      deadLetters: this.mapDeadLetters(batchJob.items),
    };
  }

  private async findDeadLetterBatchItem(
    batchJobId: string,
    batchItemId: string,
  ) {
    const batchItem = await this.prisma.batchItem.findFirst({
      where: {
        id: batchItemId,
        batchJobId,
        status: BatchItemStatus.DEAD_LETTER,
      },
    });
    if (!batchItem) {
      throw new BadRequestException('Dead-letter batch item not found');
    }
    return batchItem;
  }

  private async resetBatchItem(batchItemId: string) {
    await this.prisma.batchItem.update({
      where: { id: batchItemId },
      data: {
        status: BatchItemStatus.PENDING,
        retryCount: 0,
        errorMessage: null,
        processedAt: null,
      },
    });
  }

  async retryDeadLetterItem(
    batchJobId: string,
    batchItemId: string,
  ): Promise<void> {
    const batchItem = await this.findDeadLetterBatchItem(
      batchJobId,
      batchItemId,
    );
    const payableData = JSON.parse(batchItem.payableData) as CreatePayableDto;
    await this.resetBatchItem(batchItemId);
    await this.payableQueue.add('process-payable', {
      batchJobId,
      batchItemId,
      payableData,
    });
  }
}
