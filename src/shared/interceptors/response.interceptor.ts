import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor<
  T extends object = object,
> implements NestInterceptor<T, T & { timestamp: Date }> {
  intercept(
    _context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<T & { timestamp: Date }> {
    return next.handle().pipe(
      map((data) => ({
        ...data,
        timestamp: new Date(),
      })),
    );
  }
}
