import { DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { patchState, signalStore, withHooks, withMethods } from '@ngrx/signals';
import { addEntity } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap, map, pipe, tap } from 'rxjs';

import { GenericEntityMapperService } from '@app/mapper/generic-entity-mapper.service';
import {
  FindingGroupCreateDto,
  FindingGroupDto,
  FindingGroupUpdateDto,
} from '@app/models/data';
import {
  FindingClassifierCreate,
  FindingGroup,
  FindingGroupCreate,
  FindingGroupUpdate,
} from '@app/models/domain';
import { GroupManagerService } from '@app/services/report-manager/group-manager.service';
import { isNotNil } from '@app/utils/functions/common.functions';

import { withCRUD } from '../utils/signal-store-features/with-crud.store-feature';

import { ClassifierStore } from './classifier.store';
import { AppEntityState } from './entity-state.interface';

const initialState: AppEntityState<FindingGroup> = {
  current: null,
  isLoading: false,
  error: null,
  currentOperation: null,
};

const defaultClassifier: Omit<FindingClassifierCreate, 'groupId' | 'scopeId'> =
  {
    name: 'Unclassified',
    sortOrder: 0,
    isDefault: true,
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
    GroupManagerService
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
          store.setLoading('create'),

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
                      ...defaultClassifier,
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

      change(entity: FindingGroup | null): void {
        store.select(entity);

        if (isNotNil(entity)) {
          classifierStore.fetchAll({ id: entity.scopeId, groupId: entity.id });
        }

        classifierStore.reset();
      },

      reset(): void {
        store.resetState();

        classifierStore.resetState();
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
