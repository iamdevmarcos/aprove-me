import { registerAs } from '@nestjs/config';

const DEFAULT_PORT = 3001;
const DEFAULT_NODE_ENV = 'development';
const DEFAULT_CORS_ORIGIN = 'http://localhost:3000';
const DEFAULT_AUTH_SERVICE_URL = 'http://localhost:3002';
const DEFAULT_INTEGRATIONS_SERVICE_URL = 'http://localhost:3003';
const DEFAULT_BATCH_SERVICE_URL = 'http://localhost:3004';

export default registerAs('app', () => ({
  port: parseInt(process.env.PORT || String(DEFAULT_PORT), 10),
  nodeEnv: process.env.NODE_ENV || DEFAULT_NODE_ENV,
  corsOrigin: process.env.CORS_ORIGIN || DEFAULT_CORS_ORIGIN,
  services: {
    auth: {
      url: process.env.AUTH_SERVICE_URL || DEFAULT_AUTH_SERVICE_URL,
    },
    integrations: {
      url:
        process.env.INTEGRATIONS_SERVICE_URL ||
        DEFAULT_INTEGRATIONS_SERVICE_URL,
    },
    batch: {
      url: process.env.BATCH_SERVICE_URL || DEFAULT_BATCH_SERVICE_URL,
    },
  },
}));
