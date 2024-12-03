import { inject, Injectable } from '@angular/core';

import { LoggerService } from './logger.service';

@Injectable({ providedIn: 'root' })
export class JsonService {
  private readonly logger: LoggerService = inject(LoggerService);

  stringify(value: unknown, space?: string | number): string {
    return JSON.stringify(value, null, space);
  }

  stringifySafe(value: unknown, space?: string | number): string;
  stringifySafe(
    value: null | undefined,
    space?: string | number
  ): null | undefined;
  stringifySafe(
    value: NonNullable<unknown> | null | undefined,
    space?: string | number
  ): string | null | undefined;
  stringifySafe(
    value: NonNullable<unknown> | null | undefined,
    space?: string | number
  ): string | null | undefined {
    if (value === null || value === undefined) {
      return value;
    }

    return this.stringify(value, space);
  }

  parse<T>(json: string): T | never;
  parse(json: null | undefined): null | undefined;
  parse<T>(json: string | null | undefined): T | null | undefined | never;
  parse<T>(json: string | null | undefined): T | null | undefined | never {
    if (json === null || json === undefined) {
      return json;
    }

    return JSON.parse(json) as T;
  }

  parseSafe<T>(json: string): T;
  parseSafe(json: null | undefined): null | undefined;
  parseSafe<T>(json: string | null | undefined): T | null | undefined;
  parseSafe<T>(json: string | null | undefined): T | null | undefined {
    try {
      return this.parse<T>(json);
    } catch (error: unknown) {
      this.logger.error(error);

      return null;
    }
  }
}
