export interface AppEntityState<T, TAddon extends object = object> {
  readonly current: T | null;
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly currentOperation: string | null;
  readonly additionalData?: TAddon;
}
