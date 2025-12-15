import { Injectable, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreatePayableDto } from '../batch/dto/create-payable.dto';

@Injectable()
export class FileValidatorService {
  async validatePayableData(
    data: any,
    index: number,
  ): Promise<CreatePayableDto> {
    const payable = plainToInstance(CreatePayableDto, data);
    const errors = await validate(payable);

    if (errors.length > 0) {
      const errorMessages = errors
        .map((error) => Object.values(error.constraints || {}).join(', '))
        .join('; ');
      throw new BadRequestException(`Row ${index + 1}: ${errorMessages}`);
    }

    return payable;
  }

  validateFileSize(fileSize: number, maxSize: number): void {
    if (fileSize > maxSize) {
      throw new BadRequestException(
        `File size exceeds maximum allowed size of ${maxSize} bytes`,
      );
    }
  }

  validateFileExtension(filename: string): void {
    const extension = filename.split('.').pop()?.toLowerCase();
    if (extension !== 'csv') {
      throw new BadRequestException('Only CSV files are allowed');
    }
  }

  validateMaxItems(count: number, maxItems: number): void {
    if (count > maxItems) {
      throw new BadRequestException(
        `Maximum ${maxItems} items allowed per batch`,
      );
    }
  }
}
