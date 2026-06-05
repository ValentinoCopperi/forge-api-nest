import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction , Request, Response } from "express";
import { randomUUID } from "node:crypto";

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        if (!req.headers['x-request-id']) {
            const request_id = randomUUID();
            req.request_id = request_id;
            res.setHeader("X-Request-Id", request_id);
        } else {
            req.request_id = req.headers['x-request-id'] as string;
        }
        next();
    }
}
