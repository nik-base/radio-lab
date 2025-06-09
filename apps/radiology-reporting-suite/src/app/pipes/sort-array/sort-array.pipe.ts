import { Pipe, PipeTransform } from '@angular/core';
import { orderBy } from 'lodash-es';

@Pipe({
  name: 'sortArray',
})
export class SortArrayPipe implements PipeTransform {
  transform<T>(
    items: T[] | ReadonlyArray<T> | null | undefined,
    iteratees?: string | string[] | ((item: T) => unknown) | null,
    orders?: ('asc' | 'desc') | ('asc' | 'desc')[] | null
  ): T[] {
    if (!items || items.length === 0) {
      return [];
    }

    // Lodash's orderBy handles null/undefined for iteratees (sorts by identity)
    // and orders (defaults to 'asc').
    // We ensure they are in array form if single values are passed,
    // though orderBy is flexible.
    const iterateeArray: (string | ((item: T) => unknown))[] | undefined =
      iteratees
        ? Array.isArray(iteratees)
          ? iteratees
          : [iteratees]
        : undefined;

    const orderArray: ('asc' | 'desc')[] | undefined = orders
      ? Array.isArray(orders)
        ? orders
        : [orders]
      : undefined;

    return orderBy(items, iterateeArray, orderArray);
  }
}
