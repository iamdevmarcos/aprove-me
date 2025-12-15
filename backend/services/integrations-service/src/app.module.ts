import { Module, BadRequestException } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PayablesModule } from './payables/payables.module';
import { AssignorsModule } from './assignors/assignors.module';

@Module({
  imports: [PayablesModule, AssignorsModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        exceptionFactory: (errors) => {
          const formattedErrors: Record<string, string[]> = {};
          errors.forEach((error) => {
            const field = error.property;
            const messages = Object.values(error.constraints || {});
            formattedErrors[field] = messages;
          });
          return new BadRequestException({
            statusCode: 400,
            message: 'Validation failed',
            errors: formattedErrors,
          });
        },
      }),
    },
  ],
})
export class AppModule {}
