import { Injectable, BadRequestException } from '@nestjs/common';
import { parse } from 'csv-parse/sync';
import { CreatePayableDto } from '../batch/dto/create-payable.dto';

interface ErrorWithMessage {
  message: string;
}

@Injectable()
export class FileParserService {
  async parseCSV(fileBuffer: Buffer): Promise<CreatePayableDto[]> {
    try {
      const records = parse(fileBuffer.toString('utf-8'), {
        columns: true,
        skip_empty_lines: true,
        trim: true,
        cast: (value, context) => {
          if (context.column === 'value') {
            const num = parseFloat(value);
            if (isNaN(num)) {
              throw new Error(`Invalid number: ${value}`);
            }
            return num;
          }
          return value;
        },
      });

      return records.map((record: any) => ({
        value: record.value,
        emissionDate: record.emissionDate,
        assignorId: record.assignorId,
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : (error as ErrorWithMessage)?.message || 'Unknown error';
      throw new BadRequestException(
        `Failed to parse CSV file: ${errorMessage}`,
      );
    }
  }
}
