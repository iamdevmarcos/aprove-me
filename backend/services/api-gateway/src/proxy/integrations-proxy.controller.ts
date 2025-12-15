import {
  Controller,
  All,
  Req,
  Body,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { ProxyService } from './proxy.service';
import { AuthValidationService } from '../auth/auth-validation.service';

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

@Controller('integrations')
export class IntegrationsProxyController {
  constructor(
    private readonly proxyService: ProxyService,
    private readonly authValidationService: AuthValidationService,
  ) {}

  @All('*')
  async proxyIntegrations(@Req() req: Request, @Body() body: unknown) {
    const authHeader = req.headers?.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer '))
      throw new UnauthorizedException();

    const token = authHeader.replace('Bearer ', '');

    const isValid = await this.authValidationService.validateToken(token);

    if (!isValid) throw new UnauthorizedException();

    const fullPath = req.originalUrl || req.url;
    const path = fullPath.startsWith('/integrations')
      ? fullPath
      : `/integrations${fullPath}`;

    const method = req.method;

    const isBatchRoute = path.includes('/payable/batch');
    const contentType = req.headers['content-type'] || 'application/json';
    const isMultipart = contentType.includes('multipart/form-data');

    try {
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
