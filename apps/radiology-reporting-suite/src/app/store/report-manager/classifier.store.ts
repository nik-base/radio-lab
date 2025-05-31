import { DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { patchState, signalStore, withHooks, withMethods } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { map, pipe, switchMap, tap } from 'rxjs';

import { GenericEntityMapperService } from '@app/mapper/generic-entity-mapper.service';
import {
  FindingClassifierCreateDto,
  FindingClassifierDto,
  FindingClassifierUpdateDto,
} from '@app/models/data';
import {
  FindingClassifier,
  FindingClassifierCreate,
  FindingClassifierUpdate,
  FindingGroup,
  Scope,
} from '@app/models/domain';
import { ClassifierManagerService } from '@app/services/report-manager/classifier-manager.service';
import { isNotNil } from '@app/utils/functions/common.functions';
import { orderBySortOrder } from '@app/utils/functions/order.functions';

import { AppEntityState } from '../entity-state.interface';
import { withCRUD } from '../utils/signal-store-features/with-crud.store-feature';

import { FindingStore } from './finding.store';

interface FetchClassifierByGroupIdInput {
  readonly group: FindingGroup;
  readonly scope: Scope;
}

interface ClassifierStateAddon {
  readonly classifiersByGroupId: FindingClassifier[];
}

const initialState: AppEntityState<FindingClassifier, ClassifierStateAddon> = {
  current: null,
  isLoading: false,
  error: null,
  currentOperation: null,
  additionalData: {
    classifiersByGroupId: [],
  },
};

// eslint-disable-next-line @typescript-eslint/typedef
export const ClassifierStore = signalStore(
  withCRUD<
    FindingClassifier,
    FindingClassifierDto,
    FindingClassifierCreate,
    FindingClassifierCreateDto,
    FindingClassifierUpdate,
    FindingClassifierUpdateDto,
    { readonly id: string; readonly groupId: string },
    ClassifierManagerService,
    ClassifierStateAddon
  >(initialState, ClassifierManagerService, 'classifier', 'classifiers'),
  withMethods(
    (
      // eslint-disable-next-line @typescript-eslint/typedef
      store,
      classifierManagerService: ClassifierManagerService = inject(
        ClassifierManagerService
      ),
      genericEntityMapper: GenericEntityMapperService = inject(
        GenericEntityMapperService
      ),
      findingStore: InstanceType<typeof FindingStore> = inject(FindingStore)
    ) => ({
      fetchByGroupId: rxMethod<FetchClassifierByGroupIdInput>(
        pipe(
          store.setLoading('fetchByGroupId'),

          switchMap((input: FetchClassifierByGroupIdInput) => {
            return classifierManagerService
              .fetchAll$({ id: input.scope.id, groupId: input.group.id })
              .pipe(
                map((dto: FindingClassifierDto[]): FindingClassifier[] =>
                  genericEntityMapper.mapFromDtoList<
                    FindingClassifier,
                    FindingClassifierDto
                  >(dto)
                ),
                tap((result: FindingClassifier[]): void => {
                  patchState(store, {
                    additionalData: {
                      classifiersByGroupId: orderBySortOrder(result),
                    },
                  });
                }),

                store.handleStatus({
                  showError: true,
                  errorMessage: `Failed to fetch classifiers by group "${input.group.name}"`,
                })
              );
          })
        )
      ),

      change(entity: FindingClassifier | null): void {
        store.select(entity);

        findingStore.reset(true);

        if (isNotNil(entity)) {
          findingStore.fetchAll({
            id: entity.scopeId,
            groupId: entity.groupId,
            classifierId: entity.id,
          });
        }
      },

      reset(partialReset?: boolean): void {
        store.resetState(partialReset);

        findingStore.reset();
      },

      resetSelf(): void {
        store.resetStatusState();

        findingStore.reset();
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
