import { Pipe, PipeTransform } from '@angular/core';
import { isNil } from 'lodash-es';

@Pipe({
  name: 'findInArray',
})
export class FindInArrayPipe implements PipeTransform {
  transform<TArrayItem, TValue>(
    items: TArrayItem[] | ReadonlyArray<TArrayItem> | null,
    propertyValue: TValue,
    propertyName?: keyof TArrayItem
  ): TArrayItem | undefined {
    if (!items?.length || isNil(propertyValue)) {
      return undefined;
    }

    return items.find((item: TArrayItem): boolean => {
      if (propertyName && item) {
        // Filter by a specific property if provided
        return item[propertyName] === propertyValue;
      } else {
        // If items are simple strings
        return item === (propertyValue as unknown as TArrayItem);
      }
    });
  }
}
