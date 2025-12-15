import { Injectable } from '@nestjs/common';
import { ProxyService } from '../proxy/proxy.service';

@Injectable()
export class AuthValidationService {
  constructor(private readonly proxyService: ProxyService) {}

  async validateToken(token: string): Promise<boolean> {
    try {
      await this.proxyService.proxyToAuthService(
        '/auth/validate',
        'POST',
        {},
        { Authorization: `Bearer ${token}` },
      );
      return true;
    } catch (error) {
      console.error('Error validating token:', error);
      return false;
    }
  }
}
