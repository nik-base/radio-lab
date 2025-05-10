import { DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { signalStore, withHooks, withMethods } from '@ngrx/signals';
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

import { withCRUD } from '../utils/signal-store-features/with-crud.store-feature';

import { AppEntityState } from './entity-state.interface';

const initialState: AppEntityState<VariableValue> = {
  current: null,
  isLoading: false,
  error: null,
  currentOperation: null,
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
    VariableValueManagerService
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

      reset(): void {
        store.resetState();
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
            store.reset();
          }),
          takeUntilDestroyed(destroyRef)
        )
        .subscribe();
    },
  })
);
