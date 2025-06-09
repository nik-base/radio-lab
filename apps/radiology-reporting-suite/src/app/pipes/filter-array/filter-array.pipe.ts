import { Pipe, PipeTransform } from '@angular/core';
import { isNil } from 'lodash-es';

@Pipe({
  name: 'filterArray',
})
export class FilterArrayPipe implements PipeTransform {
  transform<TArrayItem, TValue>(
    items: TArrayItem[] | ReadonlyArray<TArrayItem> | null,
    propertyValue: TValue,
    propertyName?: keyof TArrayItem
  ): TArrayItem[] | ReadonlyArray<TArrayItem> {
    if (!items) {
      return [];
    }

    if (isNil(propertyValue)) {
      return items;
    }

    return items.filter((item: TArrayItem): boolean => {
      if (propertyName && item) {
        // Filter by a specific property if provided
        if (typeof propertyValue === 'boolean') {
          return Boolean(item[propertyName]) === propertyValue;
        }
        return item[propertyName] === propertyValue;
      } else {
        // If items are simple strings
        return item === (propertyValue as string);
      }
    });
  }
}
