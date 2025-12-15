import { Module } from '@nestjs/common';
import { FileParserService } from './file-parser.service';
import { FileValidatorService } from './file-validator.service';
import { FileStorageService } from './file-storage.service';

@Module({
  providers: [FileParserService, FileValidatorService, FileStorageService],
  exports: [FileParserService, FileValidatorService, FileStorageService],
})
export class FileModule {}
