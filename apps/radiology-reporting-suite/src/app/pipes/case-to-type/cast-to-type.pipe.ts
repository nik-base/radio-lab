import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'castToType',
})
export class CastToTypePipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform<S, T>(source: S, type?: T): T {
    return source as unknown as T;
  }
}
