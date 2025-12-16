import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { ProxyController } from './proxy.controller';
import { ProxyService } from './proxy.service';
import { AuthValidationService } from '../auth/auth-validation.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 5,
    }),
    ConfigModule,
  ],
  controllers: [ProxyController],
  providers: [ProxyService, AuthValidationService],
  exports: [ProxyService, AuthValidationService],
})
export class ProxyModule {}
