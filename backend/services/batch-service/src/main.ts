import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { setupCors } from './utils/cors.util';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const corsOrigin = process.env.CORS_ORIGIN || '*';
  setupCors(app, corsOrigin);

  const port = configService.get<number>('port');
  await app.listen(port);

  console.log(`Batch Service running on: http://localhost:${port}`);
}

bootstrap().catch((err) => {
  console.error('Failed to start application:', err);
  process.exit(1);
});
