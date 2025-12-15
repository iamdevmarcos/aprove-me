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

@Controller('auth')
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  @All('*')
  async proxyAuth(@Req() req: Request, @Body() body: unknown) {
    const fullPath = req.originalUrl || req.url;
    const pathAfterAuth = fullPath.replace('/auth', '') || '/';
    const path = pathAfterAuth === '/' ? '/auth' : '/auth' + pathAfterAuth;

    const method = req.method;
    const authHeader = req.headers?.authorization;

    try {
      return await this.proxyService.proxyToAuthService(
        path,
        method,
        body,
        authHeader ? { Authorization: authHeader } : {},
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
