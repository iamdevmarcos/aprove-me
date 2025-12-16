import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthValidationService } from './auth-validation.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authValidationService: AuthValidationService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const path = request.url || request.originalUrl;

    if (path.startsWith('/auth')) {
      return true;
    }

    const authHeader = request.headers?.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException();
    }

    const token = authHeader.replace('Bearer ', '');
    const isValid = await this.authValidationService.validateToken(token);

    if (!isValid) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
