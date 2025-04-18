import { patchState, WritableStateSource } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { OperatorFunction, pipe, tap } from 'rxjs';

import { AppEntityState } from '../report-manager/entity-state.interface';

export function rxMethodWithEntityStatus<
  TStatus extends { id: string },
  TInput,
>(
  store: WritableStateSource<AppEntityState<TStatus>>,
  currentOperation: string,
  errorMessage: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataOperator: OperatorFunction<any, any>
): ReturnType<typeof rxMethod<TInput>> {
  return rxMethod<TInput>(
    pipe(
      tap((): void => {
        patchState(store, {
          current: null,
          isLoading: true,
          error: null,
          currentOperation,
        });
      }),
      dataOperator,
      tap({
        error: () =>
          patchState(store, {
            error: errorMessage,
          }),
        finalize: () =>
          patchState(store, { isLoading: false, currentOperation: null }),
      })
    )
  );
}
