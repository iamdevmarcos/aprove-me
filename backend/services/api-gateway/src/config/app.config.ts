import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  services: {
    auth: {
      url: process.env.AUTH_SERVICE_URL || 'http://localhost:3002',
    },
    integrations: {
      url: process.env.INTEGRATIONS_SERVICE_URL || 'http://localhost:3003',
    },
    batch: {
      url: process.env.BATCH_SERVICE_URL || 'http://localhost:3004',
    },
  },
}));
