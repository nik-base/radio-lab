import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStoreFeature,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { MessageService } from 'primeng/api';
import { Observable, OperatorFunction, tap } from 'rxjs';

import { ApplicationError } from '@app/models/domain';
import { LoggerService } from '@app/utils/services/logger.service';

import { AppEntityState } from '../../report-manager/entity-state.interface';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function withRequestStatus<
  TStatus extends { id: string },
  TAddon extends object = object,
>(initialState: AppEntityState<TStatus, TAddon>) {
  return signalStoreFeature(
    withState(initialState),

    // eslint-disable-next-line @typescript-eslint/typedef
    withComputed(({ isLoading, currentOperation }) => ({
      isFetching: computed(
        () => currentOperation() === 'fetchAll' && isLoading()
      ),
    })),

    withMethods(
      (
        // eslint-disable-next-line @typescript-eslint/typedef
        store,
        uiMessageService: MessageService = inject(MessageService),
        logger: LoggerService = inject(LoggerService)
      ) => ({
        showError<T>(
          errorMessage: string,
          applicationError?: ApplicationError<T>
        ): void {
          if (applicationError) {
            logger.error(
              `[Error] ${errorMessage}`,
              applicationError?.message,
              applicationError?.error,
              applicationError?.data
            );
          } else {
            logger.error(`[Error] ${errorMessage}`);
          }

          uiMessageService.add({
            severity: 'error',
            summary: 'Error',
            detail: errorMessage,
            life: 3000,
          });
        },

        resetStatusState(partialReset?: boolean): void {
          if (partialReset) {
            patchState(store, {
              ...initialState,
              currentOperation: store.currentOperation(),
              isLoading: store.isLoading(),
            });
          } else {
            patchState(store, initialState);
          }
        },

        setLoading<TEntity>(
          currentOperation?: string
        ): OperatorFunction<TEntity, TEntity> {
          return tap(() => {
            patchState(store, {
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
                  patchState(store, {
                    isLoading: false,
                    currentOperation: null,
                  });

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
                    isLoading: false,
                    currentOperation: null,
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
              })
            );
        },
      })
    )
  );
}
