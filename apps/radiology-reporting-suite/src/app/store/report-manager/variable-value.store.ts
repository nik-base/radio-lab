import { DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { patchState, signalStore, withHooks, withMethods } from '@ngrx/signals';
import { tap } from 'rxjs';

import {
  VariableValueCreateDto,
  VariableValueDto,
  VariableValueUpdateDto,
} from '@app/models/data';
import {
  VariableValue,
  VariableValueCreate,
  VariableValueUpdate,
} from '@app/models/domain';
import { VariableValueManagerService } from '@app/services/report-manager/variable-value-manager.service';

import { AppEntityState } from '../entity-state.interface';
import { withCRUD } from '../utils/signal-store-features/with-crud.store-feature';

interface VariableValueStateAddon {
  readonly inProgressFetchVariableId: string | null;
}

const initialState: AppEntityState<VariableValue, VariableValueStateAddon> = {
  current: null,
  isLoading: false,
  error: null,
  currentOperation: null,
  additionalData: {
    inProgressFetchVariableId: null,
  },
};

// eslint-disable-next-line @typescript-eslint/typedef
export const VariableValueStore = signalStore(
  withCRUD<
    VariableValue,
    VariableValueDto,
    VariableValueCreate,
    VariableValueCreateDto,
    VariableValueUpdate,
    VariableValueUpdateDto,
    {
      readonly id: string;
    },
    VariableValueManagerService,
    VariableValueStateAddon
  >(
    initialState,
    VariableValueManagerService,
    'variable value',
    'variable values'
  ),
  withMethods(
    (
      // eslint-disable-next-line @typescript-eslint/typedef
      store
    ) => ({
      change(entity: VariableValue | null): void {
        store.select(entity);
      },

      reset(partialReset?: boolean): void {
        store.resetState(partialReset);
      },

      resetSelf(): void {
        store.resetStatusState();
      },
    })
  ),

  withHooks({
    // eslint-disable-next-line @typescript-eslint/typedef
    onInit(store, destroyRef: DestroyRef = inject(DestroyRef)) {
      store
        .deleteSuccess$()
        .pipe(
          tap(() => {
            store.resetSelf();
          }),
          takeUntilDestroyed(destroyRef)
        )
        .subscribe();

      store
        .fetchInit$()
        .pipe(
          tap(({ id }: { readonly id: string }) => {
            patchState(store, {
              additionalData: {
                inProgressFetchVariableId: id,
              },
            });
          }),
          takeUntilDestroyed(destroyRef)
        )
        .subscribe();
    },
  })
);
