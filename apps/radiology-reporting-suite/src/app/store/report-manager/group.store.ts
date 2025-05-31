import { DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { patchState, signalStore, withHooks, withMethods } from '@ngrx/signals';
import { addEntity } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap, map, pipe, switchMap, tap } from 'rxjs';

import { RADIO_DEFAULT_CLASSIFIER } from '@app/constants';
import { GenericEntityMapperService } from '@app/mapper/generic-entity-mapper.service';
import {
  FindingGroupCreateDto,
  FindingGroupDto,
  FindingGroupUpdateDto,
} from '@app/models/data';
import {
  FindingGroup,
  FindingGroupCreate,
  FindingGroupUpdate,
  Scope,
} from '@app/models/domain';
import { GroupManagerService } from '@app/services/report-manager/group-manager.service';
import { isNotNil } from '@app/utils/functions/common.functions';
import { orderBySortOrder } from '@app/utils/functions/order.functions';

import { AppEntityState } from '../entity-state.interface';
import { withCRUD } from '../utils/signal-store-features/with-crud.store-feature';

import { ClassifierStore } from './classifier.store';

interface GroupStateAddon {
  readonly groupsByScopeId: FindingGroup[];
}

const initialState: AppEntityState<FindingGroup, GroupStateAddon> = {
  current: null,
  isLoading: false,
  error: null,
  currentOperation: null,
  additionalData: {
    groupsByScopeId: [],
  },
};

// eslint-disable-next-line @typescript-eslint/typedef
export const GroupStore = signalStore(
  withCRUD<
    FindingGroup,
    FindingGroupDto,
    FindingGroupCreate,
    FindingGroupCreateDto,
    FindingGroupUpdate,
    FindingGroupUpdateDto,
    { readonly id: string },
    GroupManagerService,
    GroupStateAddon
  >(initialState, GroupManagerService, 'group', 'groups'),
  withMethods(
    (
      // eslint-disable-next-line @typescript-eslint/typedef
      store,
      groupManagerService: GroupManagerService = inject(GroupManagerService),
      genericEntityMapper: GenericEntityMapperService = inject(
        GenericEntityMapperService
      ),
      classifierStore: InstanceType<typeof ClassifierStore> = inject(
        ClassifierStore
      )
    ) => ({
      createWithClassifer: rxMethod<
        FindingGroupCreate & { readonly noPatch?: boolean }
      >(
        pipe(
          store.setLoading('createWithClassifer'),

          exhaustMap(
            (input: FindingGroupCreate & { readonly noPatch?: boolean }) =>
              groupManagerService
                .create$(
                  genericEntityMapper.mapToDto<
                    FindingGroupCreate,
                    FindingGroupCreateDto
                  >(input)
                )
                .pipe(
                  map(
                    (dto: FindingGroupDto): FindingGroup =>
                      genericEntityMapper.mapFromDto<
                        FindingGroup,
                        FindingGroupDto
                      >(dto)
                  ),
                  tap((result: FindingGroup): void => {
                    if (!input.noPatch) {
                      patchState(store, addEntity(result));
                    }

                    classifierStore.create({
                      ...RADIO_DEFAULT_CLASSIFIER,
                      groupId: result.id,
                      scopeId: result.scopeId,
                      noPatch: !(store.current()?.id === result.id),
                    });
                  }),

                  store.handleStatus({
                    showSuccess: true,
                    successMessage: `Successfully created group "${input.name}"`,
                    showError: true,
                    errorMessage: `Failed to create group "${input.name}"`,
                  })
                )
          )
        )
      ),

      fetchByScopeId: rxMethod<Scope>(
        pipe(
          store.setLoading('fetchByScopeId'),

          switchMap((input: Scope) => {
            return groupManagerService.fetchAll$({ id: input.id }).pipe(
              map((dto: FindingGroupDto[]): FindingGroup[] =>
                genericEntityMapper.mapFromDtoList<
                  FindingGroup,
                  FindingGroupDto
                >(dto)
              ),
              tap((result: FindingGroup[]): void => {
                patchState(store, {
                  additionalData: {
                    groupsByScopeId: orderBySortOrder(result),
                  },
                });
              }),

              store.handleStatus({
                showError: true,
                errorMessage: `Failed to fetch groups by scope "${input.name}"`,
              })
            );
          })
        )
      ),

      change(entity: FindingGroup | null): void {
        store.select(entity);

        classifierStore.reset(true);

        if (isNotNil(entity)) {
          classifierStore.fetchAll({ id: entity.scopeId, groupId: entity.id });
        }
      },

      reset(partialReset?: boolean): void {
        store.resetState(partialReset);

        classifierStore.reset();
      },

      resetSelf(): void {
        store.resetStatusState();

        classifierStore.reset();
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
