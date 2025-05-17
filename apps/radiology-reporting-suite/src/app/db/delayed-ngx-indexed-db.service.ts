import { inject, Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';

// Assuming GLOBAL_DB_DELAY is defined elsewhere, e.g., in a constants file.
// import { GLOBAL_DB_DELAY } from './db.constants';
const GLOBAL_DB_DELAY: number = 2000; // milliseconds, adjust as needed

@Injectable({ providedIn: 'root' })
export class DelayedNgxIndexedDBService {
  private readonly dbService: NgxIndexedDBService = inject(NgxIndexedDBService);

  getAll<T>(storeName: string): Observable<T[]> {
    return this.dbService.getAll<T>(storeName).pipe(delay(GLOBAL_DB_DELAY));
  }

  getAllByIndex<T>(
    storeName: string,
    indexName: string,
    key: IDBValidKey | IDBKeyRange
  ): Observable<T[]> {
    return this.dbService
      .getAllByIndex<T>(storeName, indexName, key)
      .pipe(delay(GLOBAL_DB_DELAY));
  }

  getByID<T>(storeName: string, key: string | number): Observable<T> {
    return this.dbService
      .getByID<T>(storeName, key)
      .pipe(delay(GLOBAL_DB_DELAY));
  }

  add<T>(storeName: string, value: T, key?: IDBValidKey): Observable<T> {
    return this.dbService
      .add<T>(storeName, value, key)
      .pipe(delay(GLOBAL_DB_DELAY));
  }

  update<T>(storeName: string, value: T): Observable<T> {
    return this.dbService
      .update<T>(storeName, value)
      .pipe(delay(GLOBAL_DB_DELAY));
  }

  delete<T>(storeName: string, key: IDBValidKey): Observable<T[]> {
    return this.dbService
      .delete<T>(storeName, key)
      .pipe(delay(GLOBAL_DB_DELAY));
  }

  bulkGet<T>(storeName: string, keys: IDBValidKey[]): Observable<T[]> {
    return this.dbService
      .bulkGet<T>(storeName, keys)
      .pipe(delay(GLOBAL_DB_DELAY));
  }

  bulkPut<T>(storeName: string, values: T[]): Observable<IDBValidKey> {
    return this.dbService
      .bulkPut<T>(storeName, values)
      .pipe(delay(GLOBAL_DB_DELAY));
  }

  bulkAdd<T>(
    storeName: string,
    values: Array<
      T & {
        key?: unknown;
      }
    >
  ): Observable<number[]> {
    return this.dbService
      .bulkAdd<T>(storeName, values)
      .pipe(delay(GLOBAL_DB_DELAY));
  }

  bulkDelete(storeName: string, keys: IDBValidKey[]): Observable<number[]> {
    return this.dbService
      .bulkDelete(storeName, keys)
      .pipe(delay(GLOBAL_DB_DELAY));
  }

  deleteAllByIndex<T>(
    storeName: string,
    indexName: string,
    query?: IDBValidKey | IDBKeyRange | null,
    direction?: IDBCursorDirection
  ): Observable<void> {
    return this.dbService
      .deleteAllByIndex<T>(storeName, indexName, query, direction)
      .pipe(delay(GLOBAL_DB_DELAY));
  }

  // Add any other NgxIndexedDBService methods you use in ReportDBService
  // For example, if you use `count`, `clear`, etc.

  /**
   * Example:
   * count(storeName: string, key?: IDBValidKey | IDBKeyRange): Observable<number> {
   *   return this.dbService.count(storeName, key).pipe(delay(GLOBAL_DB_DELAY));
   * }
   *
   * clear(storeName: string): Observable<any> {
   *   return this.dbService.clear(storeName).pipe(delay(GLOBAL_DB_DELAY));
   * }
   */

  // If NgxIndexedDBService has other methods that ReportDBService might use,
  // they should be wrapped here as well to ensure consistent global delay.
  // The methods covered above are those explicitly seen in the provided ReportDBService code.

  // Note on `deleteAllByIndex`:
  // The `deleteAllByIndex` method seen in your `ReportDBService`'s private helpers
  // (e.g., `this.dbService.deleteAllByIndex<DBModel>(...)`) is not a standard method of `NgxIndexedDBService`.
  // If this is a custom extension you've made to `NgxIndexedDBService`, you would need to:
  // 1. Ensure that custom method is also part of this `DelayedNgxIndexedDBService` (if you want the whole custom op delayed as one).
  // 2. Or, ensure that custom method internally calls the base `NgxIndexedDBService` methods (like `getAllByIndex`, `bulkDelete`),
  //    which will then be individually delayed by this wrapper.
  // If it's a placeholder for logic that should use standard methods (e.g., `getAllByIndex` followed by `bulkDelete`),
  // then the delay will be correctly applied to those underlying standard calls once that logic is correctly implemented
  // to use methods like `this.dbService.getAllByIndex(...).pipe(switchMap(items => this.dbService.bulkDelete(...)))`.
}
