import { isNil } from 'lodash-es';

export function isNotNil<T = unknown>(value: T): value is NonNullable<T> {
  return !isNil(value);
}

export function transformEmptyArray(
  value: string[] | null | undefined
): string[] {
  if (!value?.length) {
    return [];
  }

  return value;
}
