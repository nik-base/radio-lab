import { MenuItemCommandEvent } from 'primeng/api';

import { SortableListItem } from './sortable-list-item.interface';

export interface SortableListMenuItem<T> {
  readonly label: string;
  readonly icon: string;
  readonly command: (
    menuEvent: MenuItemCommandEvent,
    originalEvent: Event | null,
    data: SortableListItem<T>
  ) => void;
}
