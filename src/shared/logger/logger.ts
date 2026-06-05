import { ConfigService } from '@nestjs/config';
import pino, { Logger } from 'pino';

export const PINO_LOGGER = Symbol('PINO_LOGGER');

export const createLogger = (configService: ConfigService): Logger => {
  const environment = configService.get<string>('NODE_ENV', 'development');

  return pino({
    transport:
      environment === 'development' ? { target: 'pino-pretty' } : undefined,
  });
};
