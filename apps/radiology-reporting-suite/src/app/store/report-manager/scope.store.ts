import { DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { patchState, signalStore, withHooks, withMethods } from '@ngrx/signals';
import { addEntity } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap, map, pipe, tap } from 'rxjs';

import { RADIO_DEFAULT_GROUP } from '@app/constants';
import { GenericEntityMapperService } from '@app/mapper/generic-entity-mapper.service';
import { ScopeCreateDto, ScopeDto, ScopeUpdateDto } from '@app/models/data';
import { Scope, ScopeCreate, ScopeUpdate } from '@app/models/domain';
import { ScopeManagerService } from '@app/services/report-manager/scope-manager.service';
import { isNotNil } from '@app/utils/functions/common.functions';

import { AppEntityState } from '../entity-state.interface';
import { withCRUD } from '../utils/signal-store-features/with-crud.store-feature';

import { GroupStore } from './group.store';

const initialState: AppEntityState<Scope> = {
  current: null,
  isLoading: false,
  error: null,
  currentOperation: null,
};

// eslint-disable-next-line @typescript-eslint/typedef
export const ScopeStore = signalStore(
  withCRUD<
    Scope,
    ScopeDto,
    ScopeCreate,
    ScopeCreateDto,
    ScopeUpdate,
    ScopeUpdateDto,
    { readonly id: string },
    ScopeManagerService
  >(initialState, ScopeManagerService, 'scope', 'scopes'),
  withMethods(
    (
      // eslint-disable-next-line @typescript-eslint/typedef
      store,
      scopeManagerService: ScopeManagerService = inject(ScopeManagerService),
      genericEntityMapper: GenericEntityMapperService = inject(
        GenericEntityMapperService
      ),
      groupStore: InstanceType<typeof GroupStore> = inject(GroupStore)
    ) => ({
      createWithGroup: rxMethod<ScopeCreate>(
        pipe(
          store.setLoading('createWithGroup'),

          exhaustMap((input: ScopeCreate) =>
            scopeManagerService
              .create$(
                genericEntityMapper.mapToDto<ScopeCreate, ScopeCreateDto>(input)
              )
              .pipe(
                map(
                  (dto: ScopeDto): Scope =>
                    genericEntityMapper.mapFromDto<Scope, ScopeDto>(dto)
                ),
                tap((result: Scope): void => {
                  patchState(store, addEntity(result));

                  groupStore.createWithClassifer({
                    ...RADIO_DEFAULT_GROUP,
                    scopeId: result.id,
                    noPatch: !(store.current()?.id === result.id),
                  });
                }),

                store.handleStatus({
                  showSuccess: true,
                  successMessage: `Successfully created scope "${input.name}"`,
                  showError: true,
                  errorMessage: `Failed to create scope "${input.name}"`,
                })
              )
          )
        )
      ),

      clone: rxMethod<{ readonly scope: Scope; templateId: string }>(
        pipe(
          store.setLoading('clone'),

          exhaustMap((input: { readonly scope: Scope; templateId: string }) =>
            scopeManagerService.clone$(input.scope.id, input.templateId).pipe(
              map(
                (dto: ScopeDto): Scope =>
                  genericEntityMapper.mapFromDto<Scope, ScopeDto>(dto)
              ),
              tap((result: Scope): void => {
                if (input.scope.templateId === input.templateId) {
                  patchState(store, addEntity(result));
                }
              }),

              store.handleStatus({
                showSuccess: true,
                successMessage: `Successfully cloned scope "${input.scope.name}"`,
                showError: true,
                errorMessage: `Failed to clone scope "${input.scope.name}"`,
              })
            )
          )
        )
      ),

      change(entity: Scope | null): void {
        store.select(entity);

        groupStore.reset(true);

        if (isNotNil(entity)) {
          groupStore.fetchAll({ id: entity.id });
        }
      },

      reset(partialReset?: boolean): void {
        store.resetState(partialReset);

        groupStore.reset();
      },

      resetSelf(): void {
        store.resetStatusState();

        groupStore.reset();
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
