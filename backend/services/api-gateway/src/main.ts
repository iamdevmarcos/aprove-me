import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { logServiceFromConfig } from './utils/service-logger.util';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const corsOrigin = configService.get<string>('app.corsOrigin') || '*';
  app.enableCors({
    origin:
      corsOrigin === '*' ? true : corsOrigin.split(',').map((s) => s.trim()),
    credentials: true,
  });

  const port = configService.get<number>('app.port') || 3001;
  await app.listen(port);

  console.log(`API Gateway running on: http://localhost:${port}`);
  console.log(`CORS Enabled for: ${corsOrigin}`);
  logServiceFromConfig(configService, 'auth');
  logServiceFromConfig(configService, 'integrations');
}

bootstrap().catch((err) => {
  console.error('Failed to start application:', err);
  process.exit(1);
});
