import { inject, Injectable } from '@angular/core';

import { LoggerService } from './logger.service';

@Injectable({ providedIn: 'root' })
export class JsonService {
  private readonly logger: LoggerService = inject(LoggerService);

  stringify(value: unknown): string {
    return JSON.stringify(value);
  }

  stringifySafe(value: unknown): string;
  stringifySafe(value: null | undefined): null | undefined;
  stringifySafe(
    value: NonNullable<unknown> | null | undefined
  ): string | null | undefined;
  stringifySafe(
    value: NonNullable<unknown> | null | undefined
  ): string | null | undefined {
    if (value === null || value === undefined) {
      return value;
    }

    return this.stringify(value);
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
