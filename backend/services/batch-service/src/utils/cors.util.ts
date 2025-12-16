import { INestApplication } from '@nestjs/common';

export function setupCors(app: INestApplication, corsOrigin: string): void {
  app.enableCors({
    origin:
      corsOrigin === '*' ? true : corsOrigin.split(',').map((s) => s.trim()),
    credentials: true,
  });
}
