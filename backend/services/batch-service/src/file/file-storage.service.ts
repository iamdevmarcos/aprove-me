import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class FileStorageService {
  private uploadPath: string;

  constructor(private configService: ConfigService) {
    this.uploadPath = this.configService.get<string>('fileStorage.uploadPath');
    this.ensureUploadDirectory();
  }

  private async ensureUploadDirectory(): Promise<void> {
    try {
      await fs.access(this.uploadPath);
    } catch {
      await fs.mkdir(this.uploadPath, { recursive: true });
    }
  }

  async saveFile(
    fileBuffer: Buffer,
    batchJobId: string,
    originalName: string,
  ): Promise<string> {
    const fileExtension = path.extname(originalName);
    const fileName = `${batchJobId}${fileExtension}`;
    const filePath = path.join(this.uploadPath, fileName);

    await fs.writeFile(filePath, fileBuffer);

    return filePath;
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  }
}
