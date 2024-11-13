export interface ApplicationErrorDto<T = unknown> {
  readonly message?: string;
  readonly error: unknown;
  readonly data?: T;
}
