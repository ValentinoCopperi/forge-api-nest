
import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Inject,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Logger } from 'pino';
import { PINO_LOGGER } from '@/shared/logger/logger';

@Catch()
export class CatchEverythingFilter implements ExceptionFilter {
    private readonly logger: Logger;

    constructor(
        private readonly httpAdapterHost: HttpAdapterHost,
        @Inject(PINO_LOGGER) logger: Logger,
    ) {
        this.logger = logger.child({ logger: 'CatchEverythingFilter' });
    }

    catch(exception: unknown, host: ArgumentsHost): void {

        const { httpAdapter } = this.httpAdapterHost;

        const ctx = host.switchToHttp();

        let message: string;
        
        if (exception instanceof HttpException) {
            message = exception.getResponse() instanceof Object ? (exception.getResponse() as Record<string, any>).message : exception.getResponse() as string;
        } else if (exception instanceof Error) {
            message = exception.message;
        } else {
            message = 'Internal server error';
        }

        const httpStatus =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const responseBody = {
            statusCode: httpStatus,
            timestamp: new Date().toISOString(),
            path: httpAdapter.getRequestUrl(ctx.getRequest()),
            message: message,
        };

        this.logger.error({
            stack: exception instanceof Error ? exception.stack : exception,
            requestId: ctx.getRequest().request_id,
        })

        httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    }
}
