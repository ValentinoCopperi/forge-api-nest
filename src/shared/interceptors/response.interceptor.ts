import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

type InterceptorResponse<T> = T extends readonly unknown[]
  ? { data: T; timestamp: Date }
  : T & { timestamp: Date };

@Injectable()
export class ResponseInterceptor<
  T extends object = object,
> implements NestInterceptor<T, InterceptorResponse<T>> {
  intercept(
    _context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<InterceptorResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        if (Array.isArray(data)) {
          return {
            data,
            timestamp: new Date(),
          } as InterceptorResponse<T>;
        }

        return {
          ...data,
          timestamp: new Date(),
        } as InterceptorResponse<T>;
      }),
    );
  }
}
