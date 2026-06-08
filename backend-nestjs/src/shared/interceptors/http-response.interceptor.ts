import { HttpResponse } from 'mvc-common-toolkit';
import { Observable, map } from 'rxjs';

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

@Injectable()
export class HttpResponseInterceptor implements NestInterceptor {
  public intercept(
    ctx: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((response: HttpResponse) => {
        if (response?.httpCode) {
          return response;
        }

        if (response?.success === false) {
          return response;
        }

        const payload = response?.data ?? response;

        return { data: payload, success: true };
      }),
    );
  }
}
