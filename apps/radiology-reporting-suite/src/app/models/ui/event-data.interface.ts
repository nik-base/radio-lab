export interface EventData<T = unknown> {
  readonly event: Event;
  readonly data: T;
}
