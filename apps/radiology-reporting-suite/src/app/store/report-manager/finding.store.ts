import { DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { patchState, signalStore, withHooks, withMethods } from '@ngrx/signals';
import { addEntity } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap, map, pipe, tap } from 'rxjs';

import { GenericEntityMapperService } from '@app/mapper/generic-entity-mapper.service';
import {
  FindingCreateDto,
  FindingDto,
  FindingUpdateDto,
} from '@app/models/data';
import { Finding, FindingCreate, FindingUpdate } from '@app/models/domain';
import { FindingManagerService } from '@app/services/report-manager/finding-manager.service';

import { withCRUD } from '../utils/signal-store-features/with-crud.store-feature';

import { AppEntityState } from './entity-state.interface';
import { VariableStore } from './variable-store';

const initialState: AppEntityState<Finding> = {
  current: null,
  isLoading: false,
  error: null,
  currentOperation: null,
};

// eslint-disable-next-line @typescript-eslint/typedef
export const FindingStore = signalStore(
  withCRUD<
    Finding,
    FindingDto,
    FindingCreate,
    FindingCreateDto,
    FindingUpdate,
    FindingUpdateDto,
    {
      readonly id: string;
      readonly groupId: string;
      readonly classifierId: string;
    },
    FindingManagerService
  >(initialState, FindingManagerService, 'finding', 'findings'),
  withMethods(
    (
      // eslint-disable-next-line @typescript-eslint/typedef
      store,
      findingManagerService: FindingManagerService = inject(
        FindingManagerService
      ),
      genericEntityMapper: GenericEntityMapperService = inject(
        GenericEntityMapperService
      ),
      variableStore: InstanceType<typeof VariableStore> = inject(VariableStore)
    ) => ({
      clone: rxMethod<Finding>(
        pipe(
          store.setLoading('clone'),

          exhaustMap((input: Finding) =>
            findingManagerService.clone$(input.id).pipe(
              map(
                (dto: FindingDto): Finding =>
                  genericEntityMapper.mapFromDto<Finding, FindingDto>(dto)
              ),
              tap((result: Finding): void => {
                patchState(store, addEntity(result));
              }),

              store.handleStatus({
                showSuccess: true,
                successMessage: `Successfully cloned finding "${input.name}"`,
                showError: true,
                errorMessage: `Failed to clone finding "${input.name}"`,
              })
            )
          )
        )
      ),

      change(entity: Finding | null): void {
        store.select(entity);

        variableStore.reset(true);
      },

      reset(partialReset?: boolean): void {
        store.resetState(partialReset);

        variableStore.reset();
      },

      resetSelf(): void {
        store.resetStatusState();

        variableStore.reset();
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
