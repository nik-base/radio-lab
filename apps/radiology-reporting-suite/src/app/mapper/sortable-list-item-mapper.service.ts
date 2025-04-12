import { Injectable } from '@angular/core';

import { SortableListItem } from '@app/models/ui/sortable-list-item.interface';

@Injectable({
  providedIn: 'root',
})
export class SortableListItemMapperService<
  T extends { id: string; name: string },
> {
  mapToSortableListItems(items: T[]): SortableListItem<T>[] {
    return items.map((item: T) => this.mapToSortableListItem(item));
  }

  mapToSortableListItem(item: T): SortableListItem<T> {
    return {
      id: item.id,
      label: item.name,
      value: item,
    };
  }

  mapFromSortableListItems(items: ReadonlyArray<SortableListItem<T>>): T[] {
    return items.map((item: SortableListItem<T>) =>
      this.mapFromSortableListItem(item)
    );
  }

  mapFromSortableListItem(item: SortableListItem<T>): T {
    return item.value;
  }
}
