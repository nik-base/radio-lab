import { isEmpty, isNil } from 'lodash-es';

export function isNotNil<T = unknown>(value: T): value is NonNullable<T> {
  return !isNil(value);
}

export function isNilOrEmpty(
  value: string | null | undefined
): value is null | undefined | '' {
  return isNil(value) || isEmpty(value);
}

export function transformEmptyArray(
  value: string[] | null | undefined
): string[] {
  if (!value?.length) {
    return [];
  }

  return value;
}
