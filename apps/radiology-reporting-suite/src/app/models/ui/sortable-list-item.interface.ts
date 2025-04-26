export interface SortableListItem<T> {
  readonly id: string;
  readonly label: string;
  readonly value: T;
  readonly disableMore?: boolean;
}
