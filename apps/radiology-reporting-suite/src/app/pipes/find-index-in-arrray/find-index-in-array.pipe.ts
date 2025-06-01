import { Pipe, PipeTransform } from '@angular/core';
import { isNil } from 'lodash-es';

@Pipe({
  name: 'findIndexInArray',
})
export class FindIndexInArrayPipe implements PipeTransform {
  transform<TArrayItem, TValue>(
    items: TArrayItem[] | ReadonlyArray<TArrayItem> | null,
    propertyValue: TValue,
    propertyName?: keyof TArrayItem
  ): number {
    if (!items?.length || isNil(propertyValue)) {
      return -1;
    }

    return items.findIndex((item: TArrayItem): boolean => {
      if (propertyName && item) {
        // By a specific property if provided
        return item[propertyName] === propertyValue;
      } else {
        // If items are simple strings
        return item === (propertyValue as unknown as TArrayItem);
      }
    });
  }
}
