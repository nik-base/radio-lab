import { Injectable } from '@angular/core';

import { TableCRUDRow } from '@app/models/ui';

@Injectable({
  providedIn: 'root',
})
export class TableCRUDRowMapperService<T extends { id: string; name: string }> {
  mapToTableCRUDRows(items: T[]): TableCRUDRow<T>[] {
    return items.map((item: T) => this.mapToTableCRUDRow(item));
  }

  mapToTableCRUDRow(item: T): TableCRUDRow<T> {
    return {
      id: item.id,
      label: item.name,
      value: item,
    };
  }

  mapFromTableCRUDRows(items: ReadonlyArray<TableCRUDRow<T>>): T[] {
    return items.map((item: TableCRUDRow<T>) => this.mapFromTableCRUDRow(item));
  }

  mapFromTableCRUDRow(item: TableCRUDRow<T>): T {
    return item.value;
  }
}
