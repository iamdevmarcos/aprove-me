import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { setupCors } from './utils/cors.util';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const corsOrigin = configService.get<string>('app.corsOrigin') || '*';
  setupCors(app, corsOrigin);

  const port = configService.get<number>('app.port') || 3002;
  await app.listen(port);

  console.log(`AuthService running on: http://localhost:${port}`);
}

bootstrap().catch((err) => {
  console.error('Failed to start application:', err);
  process.exit(1);
});
