import {
  Controller,
  All,
  Req,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Request } from 'express';
import { ProxyService } from './proxy.service';

interface ErrorWithStatus {
  status: number;
  message?: string;
}

function hasStatus(error: unknown): error is ErrorWithStatus {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    typeof (error as { status: unknown }).status === 'number'
  );
}

@Controller()
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  @All('*')
  async proxy(@Req() req: Request, @Body() body: unknown) {
    const fullPath = req.originalUrl || req.url;
    const method = req.method;
    const authHeader = req.headers?.authorization || '';

    try {
      const path = fullPath.startsWith('/') ? fullPath : `/${fullPath}`;
      const pathSegments = path.split('/').filter(Boolean);
      const servicePrefix = pathSegments[0] || '';

      if (servicePrefix === 'auth') {
        return await this.proxyService.proxyToAuthService(
          path,
          method,
          body,
          authHeader ? { Authorization: authHeader } : {},
        );
      }

      if (servicePrefix === 'integrations') {
        const isBatchRoute = path.includes('/payable/batch');
        const contentType = req.headers['content-type'] || 'application/json';
        const isMultipart = contentType.includes('multipart/form-data');

        if (isBatchRoute && isMultipart && method === 'POST') {
          return await this.proxyService.proxyToBatchServiceWithStream(
            path,
            method,
            req,
            authHeader,
          );
        }

        const proxyHeaders: Record<string, string> = {
          Authorization: authHeader,
        };

        if (isMultipart && !isBatchRoute) {
          proxyHeaders['content-type'] = contentType;
        }

        if (isBatchRoute) {
          return await this.proxyService.proxyToBatchService(
            path,
            method,
            body,
            proxyHeaders,
          );
        }

        return await this.proxyService.proxyToIntegrationsService(
          path,
          method,
          body,
          proxyHeaders,
        );
      }

      throw new HttpException(
        `Unknown service: ${servicePrefix}`,
        HttpStatus.NOT_FOUND,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Internal server error';
      const errorStatus = hasStatus(error)
        ? error.status
        : HttpStatus.INTERNAL_SERVER_ERROR;
      throw new HttpException(errorMessage, errorStatus);
    }
  }
}
