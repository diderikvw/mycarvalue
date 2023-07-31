import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';

// This interface is used to provide "this is a class" type safety for the Serialize function below
interface ClassConstructor {
  new (...args: any[]): {}
}

// Creating our own decorator
export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}

  intercept(
    context: ExecutionContext,
    handler: CallHandler<any>,
  ): Observable<any> {
    // Run something before a request is handled bu the request handler, put it here
    console.log('I am running before the handler', context);

    return handler.handle().pipe(
      map((data: any) => {
        // Run something before the response is sent out
        console.log('I am running before the response is sent out', data);
        return plainToInstance(this.dto, data, {
          // Makes sure only properties with the Expose decorator are included
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
