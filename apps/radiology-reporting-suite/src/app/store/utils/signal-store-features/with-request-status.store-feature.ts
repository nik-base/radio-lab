import { inject } from '@angular/core';
import {
  patchState,
  signalStoreFeature,
  withMethods,
  withState,
} from '@ngrx/signals';
import { MessageService } from 'primeng/api';
import { finalize, Observable, OperatorFunction, tap } from 'rxjs';

import { LoggerService } from '@app/utils/services/logger.service';

import { AppEntityState } from '../../report-manager/entity-state.interface';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function withRequestStatus<TStatus extends { id: string }>(
  initialState: AppEntityState<TStatus>
) {
  return signalStoreFeature(
    withState(initialState),

    withMethods(
      (
        // eslint-disable-next-line @typescript-eslint/typedef
        store,
        uiMessageService: MessageService = inject(MessageService),
        logger: LoggerService = inject(LoggerService)
      ) => ({
        setLoading<TEntity>(
          currentOperation?: string
        ): OperatorFunction<TEntity, TEntity> {
          return tap(() => {
            patchState(store, {
              current: null,
              isLoading: true,
              error: null,
              currentOperation,
            });
          });
        },

        handleStatus<TEntity>(
          config: {
            showError?: boolean;
            errorMessage?: string;
            errorMessageFn?: (response: unknown) => string;
            showSuccess?: boolean;
            successMessage?: string;
            successMessageFn?: (error: TEntity) => string;
            data?: unknown;
          } = {}
        ): OperatorFunction<TEntity, TEntity> {
          // eslint-disable-next-line @typescript-eslint/typedef
          const {
            showError = false,
            showSuccess = false,
            errorMessage,
            successMessage,
            errorMessageFn,
            successMessageFn,
            data,
          } = config;

          return (source$: Observable<TEntity>): Observable<TEntity> =>
            source$.pipe(
              tap({
                next: (response: TEntity) => {
                  if (showSuccess) {
                    const successMessageToShow: string =
                      successMessageFn?.(response) ||
                      successMessage ||
                      'Operation completed successfully';

                    uiMessageService.add({
                      severity: 'success',
                      summary: 'Success',
                      detail: successMessageToShow,
                      life: 3000,
                    });
                  }
                },
                error: (error: unknown) => {
                  const errorMessageToShow: string =
                    errorMessageFn?.(error) ||
                    errorMessage ||
                    'An error occurred';

                  logger.error(`[Error] ${errorMessageToShow}`, error, data);

                  patchState(store, {
                    error: errorMessageToShow,
                  });

                  if (showError) {
                    uiMessageService.add({
                      severity: 'error',
                      summary: 'Error',
                      detail: errorMessageToShow,
                      life: 3000,
                    });
                  }
                },
              }),
              finalize(() => {
                patchState(store, { isLoading: false, currentOperation: null });
              })
            );
        },
      })
    )
  );
}
