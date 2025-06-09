import { Pipe, PipeTransform } from '@angular/core';
import { isNil } from 'lodash-es';

@Pipe({
  name: 'existsInArray',
})
export class ExistsInArrayPipe implements PipeTransform {
  transform<TArrayItem, TValue>(
    items: TArrayItem[] | ReadonlyArray<TArrayItem> | null,
    propertyValue: TValue,
    propertyName?: keyof TArrayItem
  ): boolean {
    if (!items?.length || isNil(propertyValue)) {
      return false;
    }

    return items.some((item: TArrayItem): boolean => {
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
