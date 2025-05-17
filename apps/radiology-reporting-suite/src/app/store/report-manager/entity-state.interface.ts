export interface AppEntityState<
  T extends { id: string },
  TAddon extends object = object,
> {
  readonly current: T | null;
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly currentOperation: string | null;
  readonly additionalData?: TAddon;
}
