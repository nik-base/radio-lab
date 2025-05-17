import { computed, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
} from '@ngrx/signals';
import { addEntity } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { orderBy } from 'lodash-es';
import { exhaustMap, map, pipe, tap } from 'rxjs';

import { GenericEntityMapperService } from '@app/mapper/generic-entity-mapper.service';
import {
  VariableCreateDto,
  VariableDto,
  VariableUpdateDto,
} from '@app/models/data';
import { Variable, VariableCreate, VariableUpdate } from '@app/models/domain';
import { VariableManagerService } from '@app/services/report-manager/variable-manager.service';
import { isNotNil } from '@app/utils/functions/common.functions';
import { orderBySortOrder } from '@app/utils/functions/order.functions';

import { withCRUD } from '../utils/signal-store-features/with-crud.store-feature';

import { AppEntityState } from './entity-state.interface';
import { VariableValueStore } from './variable-value.store';

const initialState: AppEntityState<Variable> = {
  current: null,
  isLoading: false,
  error: null,
  currentOperation: null,
};

// eslint-disable-next-line @typescript-eslint/typedef
export const VariableStore = signalStore(
  withCRUD<
    Variable,
    VariableDto,
    VariableCreate,
    VariableCreateDto,
    VariableUpdate,
    VariableUpdateDto,
    {
      readonly id: string;
    },
    VariableManagerService
  >(initialState, VariableManagerService, 'variable', 'variables'),
  // eslint-disable-next-line @typescript-eslint/typedef
  withComputed(({ entities }) => ({
    variables: computed(
      () => (entityId: string) =>
        computed(() =>
          orderBySortOrder(
            entities()?.filter(
              (item: Variable): boolean => item.entityId === entityId
            )
          )
        )
    ),
    exceptVariables: computed(
      () => (entityId: string) =>
        computed(() => {
          const exceptVariables: Variable[] =
            entities()?.filter(
              (item: Variable): boolean => item.entityId !== entityId
            ) ?? [];

          return orderBy(
            exceptVariables,
            ['entityId', 'sortOrder'],
            ['asc', 'asc']
          );
        })
    ),
  })),
  withMethods(
    (
      // eslint-disable-next-line @typescript-eslint/typedef
      store,
      variableManagerService: VariableManagerService = inject(
        VariableManagerService
      ),
      genericEntityMapper: GenericEntityMapperService = inject(
        GenericEntityMapperService
      ),
      variableValueStore: InstanceType<typeof VariableValueStore> = inject(
        VariableValueStore
      )
    ) => ({
      clone: rxMethod<{
        readonly variable: Variable;
        readonly entityId: string;
      }>(
        pipe(
          store.setLoading('clone'),

          exhaustMap(
            (input: {
              readonly variable: Variable;
              readonly entityId: string;
            }) =>
              variableManagerService
                .clone$(input.variable.id, input.entityId)
                .pipe(
                  map(
                    (dto: VariableDto): Variable =>
                      genericEntityMapper.mapFromDto<Variable, VariableDto>(dto)
                  ),
                  tap((result: Variable): void => {
                    patchState(store, addEntity(result));
                  }),

                  store.handleStatus({
                    showSuccess: true,
                    successMessage: `Successfully cloned variable "${input.variable.name}"`,
                    showError: true,
                    errorMessage: `Failed to clone variable "${input.variable.name}"`,
                  })
                )
          )
        )
      ),

      change(entity: Variable | null): void {
        store.select(entity);

        variableValueStore.reset(true);

        if (isNotNil(entity)) {
          variableValueStore.fetchAll({ id: entity.id });
        }
      },

      reset(partialReset?: boolean): void {
        store.resetState(partialReset);

        variableValueStore.reset();
      },

      resetSelf(): void {
        store.resetStatusState();

        variableValueStore.reset();
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
    },
  })
);
