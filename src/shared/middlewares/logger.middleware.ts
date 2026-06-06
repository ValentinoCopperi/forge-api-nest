import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { Logger } from 'pino';
import { PINO_LOGGER } from '@/shared/logger/logger';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    private readonly logger: Logger;

    constructor(@Inject(PINO_LOGGER) logger: Logger) {
        this.logger = logger.child({ logger: 'LoggerMiddleware' });
    }

    use(req: Request, res: Response, next: NextFunction) {
        const executeTime = new Date();


        //res.on("finish") -> Ejecuta la funcion anonima una vez la response haya sido enviada
        res.on("finish", () => {

            const duration = new Date().getTime() - executeTime.getTime();

            const logContext = {
                method: req.method,
                url: req.url,
                statusCode: res.statusCode,
                requestId: req.request_id,
                duration,
            }

            const level = res.statusCode > 199 && res.statusCode < 300 ? 'info' : res.statusCode > 399 && res.statusCode < 500 ? 'warn' : 'error';

            this.logger[level](logContext);

            return;
        })
        
        next();
    }
}
