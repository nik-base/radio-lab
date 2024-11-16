import { isNil } from 'lodash-es';

export function isNotNil<T = unknown>(value: T): value is NonNullable<T> {
  return !isNil(value);
}
