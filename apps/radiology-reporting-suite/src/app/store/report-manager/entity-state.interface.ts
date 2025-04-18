export interface AppEntityState<T extends { id: string }> {
  readonly current: T | null;
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly currentOperation: string | null;
}
