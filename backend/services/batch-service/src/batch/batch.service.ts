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

  async createBatchJob(
    fileBuffer: Buffer,
    fileName: string,
    maxItems: number,
    maxFileSize: number,
  ): Promise<{ batchJobId: string; totalItems: number }> {
    this.fileValidator.validateFileSize(fileBuffer.length, maxFileSize);
    this.fileValidator.validateFileExtension(fileName);

    const payables = await this.fileParser.parseCSV(fileBuffer);

    if (payables.length === 0) {
      throw new BadRequestException('File is empty or contains no valid data');
    }

    this.fileValidator.validateMaxItems(payables.length, maxItems);

    const validatedPayables: CreatePayableDto[] = [];

    for (let i = 0; i < payables.length; i++) {
      try {
        const validated = await this.fileValidator.validatePayableData(
          payables[i],
          i,
        );
        validatedPayables.push(validated);
      } catch (error: any) {
        this.logger.warn(`Skipping invalid row ${i + 1}: ${error.message}`);
      }
    }

    if (validatedPayables.length === 0) {
      throw new BadRequestException('No valid payables found in the file');
    }

    const batchJob = await this.prisma.batchJob.create({
      data: {
        fileName,
        totalItems: validatedPayables.length,
        status: BatchJobStatus.PENDING,
      },
    });

    const filePath = await this.fileStorage.saveFile(
      fileBuffer,
      batchJob.id,
      fileName,
    );

    await this.prisma.batchJob.update({
      where: { id: batchJob.id },
      data: { filePath },
    });

    const batchItems = await Promise.all(
      validatedPayables.map((payable) =>
        this.prisma.batchItem.create({
          data: {
            batchJobId: batchJob.id,
            payableData: JSON.stringify(payable),
            status: BatchItemStatus.PENDING,
          },
        }),
      ),
    );

    await this.prisma.batchJob.update({
      where: { id: batchJob.id },
      data: { status: BatchJobStatus.PROCESSING, startedAt: new Date() },
    });

    for (const item of batchItems) {
      await this.payableQueue.add('process-payable', {
        batchJobId: batchJob.id,
        batchItemId: item.id,
        payableData: JSON.parse(item.payableData),
      });
    }

    return {
      batchJobId: batchJob.id,
      totalItems: validatedPayables.length,
    };
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
      deadLetters: batchJob.items.map((item) => ({
        id: item.id,
        errorMessage: item.errorMessage,
        retryCount: item.retryCount,
        createdAt: item.createdAt,
      })),
    };
  }

  async retryDeadLetterItem(batchJobId: string, batchItemId: string): Promise<void> {
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

    const payableData = JSON.parse(batchItem.payableData) as CreatePayableDto;

    await this.prisma.batchItem.update({
      where: { id: batchItemId },
      data: {
        status: BatchItemStatus.PENDING,
        retryCount: 0,
        errorMessage: null,
        processedAt: null,
      },
    });

    await this.payableQueue.add('process-payable', {
      batchJobId,
      batchItemId,
      payableData,
    });
  }
}
