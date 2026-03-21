import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Request } from 'express';
import { Observable, tap } from 'rxjs';

@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
  private readonly logger = new Logger('Performance');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method, url } = request;
    const start = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - start;

        // Log slow requests (> 2 seconds)
        if (duration > 2000) {
          this.logger.warn(
            `SLOW REQUEST: ${method} ${url} took ${duration}ms` +
              ` [user=${(request as any).user?.sub || 'anonymous'}]`,
          );
        }

        // Log all requests in development for debugging
        if (process.env.NODE_ENV !== 'production') {
          this.logger.log(`${method} ${url} ${duration}ms`);
        }
      }),
    );
  }
}
