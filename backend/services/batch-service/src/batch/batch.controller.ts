import {
  Controller,
  Post,
  Get,
  Param,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BatchService } from './batch.service';
import { BatchJobResponseDto } from './dto/batch-response.dto';
import { ConfigService } from '@nestjs/config';

@Controller('integrations/payable')
export class BatchController {
  constructor(
    private batchService: BatchService,
    private configService: ConfigService,
  ) {}

  @Post('batch')
  @HttpCode(HttpStatus.ACCEPTED)
  @UseInterceptors(FileInterceptor('file'))
  async createBatch(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<BatchJobResponseDto> {
    if (!file) throw new BadRequestException('File is required');

    const maxItems = this.configService.get<number>('batch.maxItems');
    const maxFileSize = this.configService.get<number>('batch.maxFileSize');

    const { batchJobId, totalItems } = await this.batchService.createBatchJob(
      file.buffer,
      file.originalname,
      maxItems,
      maxFileSize,
    );

    return {
      batchJobId,
      status: 'PENDING',
      totalItems,
      message: 'Batch job created successfully',
    };
  }

  @Get('batch/:batchJobId')
  async getBatchStatus(@Param('batchJobId') batchJobId: string) {
    return this.batchService.getBatchJobStatus(batchJobId);
  }

  @Post('batch/:batchJobId/items/:batchItemId/retry')
  @HttpCode(HttpStatus.ACCEPTED)
  async retryBatchItem(
    @Param('batchJobId') batchJobId: string,
    @Param('batchItemId') batchItemId: string,
  ) {
    await this.batchService.retryDeadLetterItem(batchJobId, batchItemId);
    return {
      batchJobId,
      batchItemId,
      message: 'Retry requested successfully',
    };
  }
}
