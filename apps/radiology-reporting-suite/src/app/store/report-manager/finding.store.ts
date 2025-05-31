import { DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { patchState, signalStore, withHooks, withMethods } from '@ngrx/signals';
import { addEntity } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap, map, pipe, switchMap, tap } from 'rxjs';

import { GenericEntityMapperService } from '@app/mapper/generic-entity-mapper.service';
import {
  FindingCreateDto,
  FindingDto,
  FindingUpdateDto,
} from '@app/models/data';
import { Finding, FindingCreate, FindingUpdate } from '@app/models/domain';
import { FindingManagerService } from '@app/services/report-manager/finding-manager.service';

import { AppEntityState } from '../entity-state.interface';
import { withCRUD } from '../utils/signal-store-features/with-crud.store-feature';

import { VariableStore } from './variable-store';

interface FindingCloneInput {
  readonly finding: Finding;
  readonly groupId: string;
  readonly classifierId: string;
}

interface FindingStateAddon {
  readonly findingsByScopeId: Finding[];
}

const initialState: AppEntityState<Finding, FindingStateAddon> = {
  current: null,
  isLoading: false,
  error: null,
  currentOperation: null,
  additionalData: {
    findingsByScopeId: [],
  },
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
    FindingManagerService,
    FindingStateAddon
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
      clone: rxMethod<FindingCloneInput>(
        pipe(
          store.setLoading('clone'),

          exhaustMap((input: FindingCloneInput) =>
            findingManagerService
              .clone$(input.finding.id, input.groupId, input.classifierId)
              .pipe(
                map(
                  (dto: FindingDto): Finding =>
                    genericEntityMapper.mapFromDto<Finding, FindingDto>(dto)
                ),
                tap((result: Finding): void => {
                  if (
                    result.classifierId === input.finding.classifierId &&
                    result.groupId === input.finding.groupId
                  ) {
                    patchState(store, addEntity(result));
                  }
                }),

                store.handleStatus({
                  showSuccess: true,
                  successMessage: `Successfully cloned finding "${input.finding.name}"`,
                  showError: true,
                  errorMessage: `Failed to clone finding "${input.finding.name}"`,
                })
              )
          )
        )
      ),

      fetchByScopeId: rxMethod<string>(
        pipe(
          store.setLoading('fetchByScopeId'),

          switchMap((input: string) => {
            return findingManagerService.fetchByScopeId$(input).pipe(
              map((dto: FindingDto[]): Finding[] =>
                genericEntityMapper.mapFromDtoList<Finding, FindingDto>(dto)
              ),
              tap((result: Finding[]): void => {
                patchState(store, {
                  additionalData: {
                    findingsByScopeId: result,
                  },
                });
              }),

              store.handleStatus({
                showError: true,
                errorMessage: `Failed to fetch findings by scope "${input}"`,
              })
            );
          })
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
