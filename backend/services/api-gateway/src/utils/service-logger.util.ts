import { ConfigService } from '@nestjs/config';

export function getServiceUrl(
  configService: ConfigService,
  serviceName: string,
): string {
  return configService.get<string>(`app.services.${serviceName}.url`) || '';
}

export function logService(serviceName: string, url: string): void {
  const formattedName =
    serviceName.charAt(0).toUpperCase() + serviceName.slice(1);
  console.log(`${formattedName} Service: ${url}`);
}

export function logServiceFromConfig(
  configService: ConfigService,
  serviceName: string,
): void {
  const url = getServiceUrl(configService, serviceName);
  logService(serviceName, url);
}
