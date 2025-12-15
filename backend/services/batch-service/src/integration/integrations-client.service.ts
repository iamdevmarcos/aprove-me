import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreatePayableDto } from '../batch/dto/create-payable.dto';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class IntegrationsClientService {
  private client: AxiosInstance;
  private baseURL: string;

  constructor(private configService: ConfigService) {
    this.baseURL = this.configService.get<string>('integrationsService.url');
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  setAuthToken(token: string): void {
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  async createPayable(payableDto: CreatePayableDto): Promise<{ id: string }> {
    try {
      const response = await this.client.post<{ id: string }>(
        '/integrations/payable',
        payableDto,
      );
      return response.data;
    } catch (error: any) {
      if (error.response) {
        const status = error.response.status;
        const message =
          error.response.data?.message ||
          error.response.data?.errors ||
          'Failed to create payable';

        throw new HttpException(
          {
            statusCode: status,
            message,
          },
          status,
        );
      }

      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Integration service unavailable';
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: errorMessage,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
