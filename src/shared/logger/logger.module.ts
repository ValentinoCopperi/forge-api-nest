import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerMiddleware } from '../middlewares/logger.middleware';
import { RequestIdMiddleware } from '../middlewares/request-id.middleware';
import { createLogger, PINO_LOGGER } from './logger';

@Global()
@Module({
  providers: [
    {
      provide: PINO_LOGGER,
      useFactory: createLogger,
      inject: [ConfigService],
    },
    LoggerMiddleware,
    RequestIdMiddleware,
  ],
  exports: [PINO_LOGGER, LoggerMiddleware, RequestIdMiddleware],
})
export class LoggerModule {}
