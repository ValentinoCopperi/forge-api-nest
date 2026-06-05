import { Injectable, Inject, NestMiddleware, HttpException, HttpStatus } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { Logger } from "pino";
import { PINO_LOGGER } from "../logger/logger";
import { CACHE_MANAGER, Cache } from "@nestjs/cache-manager";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
    private readonly logger: Logger;
    private readonly maxIpRequest: number;

    constructor(
        @Inject(PINO_LOGGER) logger: Logger,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private configService: ConfigService
    ) {
        this.logger = logger.child({ logger: 'RateLimitMiddleware' });
        this.maxIpRequest = this.configService.get<number>('MAX_IP_REQUEST', 5);
    }

    async use(req: Request, res: Response, next: NextFunction) {
        const ip = req.ip;

        const ip_requests_count = await this.cacheManager.get<string>(`requests_${ip}`);

        if (ip_requests_count) {

            const parsed_ip_count = parseInt(ip_requests_count);

            if (parsed_ip_count < this.maxIpRequest) {
                await this.cacheManager.set(`requests_${ip}`, String(parsed_ip_count + 1), 6000);

                return next();
            } else {
                throw new HttpException('Rate limit exceeded', HttpStatus.TOO_MANY_REQUESTS);
            }

        }

        await this.cacheManager.set(`requests_${ip}`, "1", 6000);

        next();
    }
}