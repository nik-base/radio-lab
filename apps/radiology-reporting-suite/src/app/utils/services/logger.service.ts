import { Injectable } from '@angular/core';
import { isNil } from 'lodash';

@Injectable({ providedIn: 'root' })
export class LoggerService {
  info(...args: unknown[]): void;
  info(message?: string, ...args: unknown[]): void {
    if (isNil(message)) {
      console.info(...args);
      return;
    }

    console.info(this.formatMessage(message), ...args);
  }

  warn(...args: unknown[]): void;
  warn(message?: string, ...args: unknown[]): void {
    if (isNil(message)) {
      console.warn(...args);
      return;
    }

    console.warn(this.formatMessage(message), ...args);
  }

  error(...args: unknown[]): void;
  error(message?: string, ...args: unknown[]): void {
    if (isNil(message)) {
      console.error(...args);
      return;
    }

    console.error(this.formatMessage(message), ...args);
  }

  debug(...args: unknown[]): void;
  debug(message?: string, ...args: unknown[]): void {
    if (isNil(message)) {
      console.debug(...args);
      return;
    }

    console.debug(this.formatMessage(message), ...args);
  }

  trace(...args: unknown[]): void;
  trace(message?: string, ...args: unknown[]): void {
    if (isNil(message)) {
      console.trace(...args);
      return;
    }

    console.trace(this.formatMessage(message), ...args);
  }

  private formatMessage(message: string): string {
    return `[Radio App] [${new Date().toISOString()}] ${message}`;
  }
}
