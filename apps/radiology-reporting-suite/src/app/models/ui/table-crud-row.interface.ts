export interface TableCRUDRow<T> {
  readonly id: string;
  readonly label: string;
  readonly value: T;
}
