import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: parseInt(process.env.PORT || '3002', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
}));

export const jwtConfig = registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || '',
  expiration: process.env.JWT_EXPIRATION || '1m',
  refreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '7d',
}));

export const bcryptConfig = registerAs('bcrypt', () => ({
  saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10),
}));

export const databaseConfig = registerAs('database', () => ({
  url: process.env.DATABASE_URL || 'file:./dev.db',
}));
