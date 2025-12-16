import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosRequestConfig, AxiosResponse, AxiosError, Method } from 'axios';
import type { Request } from 'express';
import FormData from 'form-data';
import multer from 'multer';

@Injectable()
export class ProxyService {
  private readonly authServiceUrl: string;
  private readonly integrationsServiceUrl: string;
  private readonly batchServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.authServiceUrl =
      this.configService.get<string>('app.services.auth.url') ||
      'http://localhost:3002';
    this.integrationsServiceUrl =
      this.configService.get<string>('app.services.integrations.url') ||
      'http://localhost:3003';
    this.batchServiceUrl =
      this.configService.get<string>('app.services.batch.url') ||
      'http://localhost:3004';
  }

  async proxyToAuthService(
    path: string,
    method: string,
    body?: unknown,
    headers?: Record<string, string>,
  ): Promise<unknown> {
    const url = `${this.authServiceUrl}${path}`;
    return this.proxyRequest(url, method, body, headers);
  }

  async proxyToIntegrationsService(
    path: string,
    method: string,
    body?: unknown,
    headers?: Record<string, string>,
  ): Promise<unknown> {
    const url = `${this.integrationsServiceUrl}${path}`;
    return this.proxyRequest(url, method, body, headers);
  }

  async proxyToBatchService(
    path: string,
    method: string,
    body?: unknown,
    headers?: Record<string, string>,
  ): Promise<unknown> {
    const url = `${this.batchServiceUrl}${path}`;
    return this.proxyRequest(url, method, body, headers, 30000);
  }

  async proxyToBatchServiceWithStream(
    path: string,
    method: string,
    req: Request,
    authHeader: string,
  ): Promise<unknown> {
    return new Promise((resolve, reject) => {
      const upload = multer({ storage: multer.memoryStorage() }).single('file');

      upload(req, {} as any, async (err) => {
        if (err) {
          reject(new HttpException(err.message, HttpStatus.BAD_REQUEST));
          return;
        }

        const file = (req as any).file;
        if (!file) {
          reject(new HttpException('File is required', HttpStatus.BAD_REQUEST));
          return;
        }

        const url = `${this.batchServiceUrl}${path}`;
        const formData = new FormData();

        formData.append('file', file.buffer, {
          filename: file.originalname,
          contentType: file.mimetype,
        });

        const config: AxiosRequestConfig = {
          method: method as Method,
          url,
          headers: {
            ...formData.getHeaders(),
            Authorization: authHeader,
          },
          data: formData,
          maxBodyLength: Infinity,
          maxContentLength: Infinity,
          // Increased timeout for batch operations (30 seconds should be enough since we return 202 quickly)
          timeout: 30000,
        };

        try {
          const response: AxiosResponse = await firstValueFrom(
            this.httpService.request(config),
          );
          resolve(response.data);
        } catch (error) {
          const axiosError = error as AxiosError;
          if (axiosError.response) {
            reject(
              new HttpException(
                axiosError.response.data || axiosError.message,
                axiosError.response.status || HttpStatus.INTERNAL_SERVER_ERROR,
              ),
            );
          } else {
            reject(
              new HttpException(
                'Service unavailable',
                HttpStatus.SERVICE_UNAVAILABLE,
              ),
            );
          }
        }
      });
    });
  }

  private async proxyRequest(
    url: string,
    method: string,
    body?: unknown,
    headers?: Record<string, string>,
    timeout?: number,
  ): Promise<unknown> {
    const contentType = headers?.['content-type'] || 'application/json';

    const config: AxiosRequestConfig = {
      method: method as Method,
      url,
      headers: {
        ...(contentType !== 'multipart/form-data' && {
          'Content-Type': contentType,
        }),
        ...headers,
      },
      data: body,
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
      ...(timeout && { timeout }),
    };

    try {
      const response: AxiosResponse = await firstValueFrom(
        this.httpService.request(config),
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        throw new HttpException(
          axiosError.response.data || axiosError.message,
          axiosError.response.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      throw new HttpException(
        'Service unavailable',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}
