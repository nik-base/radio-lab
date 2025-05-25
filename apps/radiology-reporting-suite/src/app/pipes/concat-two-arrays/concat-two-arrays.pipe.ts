// concat-two-arrays.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'concatTwoArrays',
})
export class ConcatTwoArraysPipe implements PipeTransform {
  transform<T, U>(
    array1: T[] | ReadonlyArray<T> | null | undefined,
    array2: U[] | ReadonlyArray<U> | null | undefined
  ): (T | U)[] | ReadonlyArray<T | U> {
    const arr1Valid: T[] = Array.isArray(array1) ? array1 : [];

    const arr2Valid: U[] = Array.isArray(array2) ? array2 : [];

    return [...arr1Valid, ...arr2Valid];
  }
}
