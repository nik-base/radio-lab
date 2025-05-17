import { computed, inject, Type } from '@angular/core';
import {
  patchState,
  signalStoreFeature,
  withComputed,
  withMethods,
} from '@ngrx/signals';
import {
  addEntity,
  removeAllEntities,
  removeEntity,
  setAllEntities,
  updateEntities,
  updateEntity,
  withEntities,
} from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import {
  exhaustMap,
  map,
  Observable,
  pipe,
  Subject,
  switchMap,
  tap,
} from 'rxjs';

import { GenericEntityMapperService } from '@app/mapper/generic-entity-mapper.service';
import { SortOrderUpdateDto } from '@app/models/data';
import { SortOrderItem, SortOrderUpdate } from '@app/models/domain';
import { EntityManagerBaseService } from '@app/services/report-manager/entity-manager-base.service';
import { AppEntityState } from '@app/store/report-manager/entity-state.interface';
import { orderBySortOrder } from '@app/utils/functions/order.functions';

import { withRequestStatus } from './with-request-status.store-feature';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function withCRUD<
  TEntity extends {
    readonly id: string;
    readonly name: string;
    readonly sortOrder: number;
  },
  TDto,
  TCreate extends { readonly name: string },
  TCreateDto,
  TUpdate extends { readonly id: string; readonly name: string },
  TUpdateDto,
  TFetchAll,
  TService extends EntityManagerBaseService<
    TDto,
    TCreateDto,
    TUpdateDto,
    TFetchAll
  >,
  TAddon extends object = object,
>(
  initialState: AppEntityState<TEntity, TAddon>,
  entityManagerServiceType: Type<TService>,
  entityNameSingular: string,
  entityNamePlural: string
) {
  return signalStoreFeature(
    withEntities<TEntity>(),
    withRequestStatus<TEntity, TAddon>(initialState),
    // eslint-disable-next-line @typescript-eslint/typedef
    withComputed(({ entities }) => ({
      orderedList: computed(() => orderBySortOrder(entities())),
    })),
    withMethods(
      (
        // eslint-disable-next-line @typescript-eslint/typedef
        store,
        entityManagerService: TService = inject(entityManagerServiceType),
        genericEntityMapper: GenericEntityMapperService = inject(
          GenericEntityMapperService
        ),
        fetchInitSubject: Subject<TFetchAll> = new Subject<TFetchAll>(),
        fetchSuccessSubject: Subject<TEntity[]> = new Subject<TEntity[]>(),
        deleteSuccessSubject: Subject<TEntity> = new Subject<TEntity>()
      ) => ({
        fetchAll: rxMethod<TFetchAll>(
          pipe(
            store.setLoading('fetchAll'),

            switchMap((input: TFetchAll) => {
              fetchInitSubject.next(input);

              patchState(store, removeAllEntities());

              return entityManagerService.fetchAll$(input).pipe(
                map((dto: TDto[]): TEntity[] =>
                  genericEntityMapper.mapFromDtoList<TEntity, TDto>(dto)
                ),
                tap((result: TEntity[]): void => {
                  fetchSuccessSubject.next(result);

                  patchState(store, setAllEntities(result));
                }),

                store.handleStatus({
                  showError: true,
                  errorMessage: `Failed to fetch ${entityNamePlural}`,
                })
              );
            })
          )
        ),

        create: rxMethod<TCreate & { readonly noPatch?: boolean }>(
          pipe(
            store.setLoading('create'),

            exhaustMap((input: TCreate & { readonly noPatch?: boolean }) =>
              entityManagerService
                .create$(
                  genericEntityMapper.mapToDto<TCreate, TCreateDto>(input)
                )
                .pipe(
                  map(
                    (dto: TDto): TEntity =>
                      genericEntityMapper.mapFromDto<TEntity, TDto>(dto)
                  ),
                  tap((result: TEntity): void => {
                    if (!input.noPatch) {
                      patchState(store, addEntity(result));
                    }
                  }),

                  store.handleStatus({
                    showSuccess: true,
                    successMessage: `Successfully created ${entityNameSingular} "${input.name}"`,
                    showError: true,
                    errorMessage: `Failed to create ${entityNameSingular} "${input.name}"`,
                  })
                )
            )
          )
        ),

        update: rxMethod<TUpdate>(
          pipe(
            store.setLoading('update'),

            switchMap((input: TUpdate) =>
              entityManagerService
                .update$(
                  genericEntityMapper.mapToDto<TUpdate, TUpdateDto>(input)
                )
                .pipe(
                  map(
                    (dto: TDto): TEntity =>
                      genericEntityMapper.mapFromDto<TEntity, TDto>(dto)
                  ),
                  tap((result: TEntity): void => {
                    patchState(
                      store,
                      updateEntity({ id: result.id, changes: result })
                    );
                  }),

                  store.handleStatus({
                    showSuccess: true,
                    successMessage: `Successfully updated ${entityNameSingular} "${input.name}"`,
                    showError: true,
                    errorMessage: `Failed to update ${entityNameSingular} ${input.name}"`,
                  })
                )
            )
          )
        ),

        delete: rxMethod<TEntity>(
          pipe(
            store.setLoading('delete'),

            exhaustMap((input: TEntity) =>
              entityManagerService.delete$(input.id).pipe(
                tap(() => {
                  patchState(store, removeEntity(input.id));

                  deleteSuccessSubject.next(input);
                }),

                store.handleStatus({
                  showSuccess: true,
                  successMessage: `Successfully deleted ${entityNameSingular} "${input.name}"`,
                  showError: true,
                  errorMessage: `Failed to delete ${entityNameSingular} "${input.name}"`,
                })
              )
            )
          )
        ),

        reorder: rxMethod<SortOrderUpdate>(
          pipe(
            store.setLoading('reorder'),

            map(
              (entity: SortOrderUpdate): SortOrderUpdateDto =>
                genericEntityMapper.mapToDto<
                  SortOrderUpdate,
                  SortOrderUpdateDto
                >(entity)
            ),
            switchMap((entity: SortOrderUpdate) =>
              entityManagerService.reorder$(entity).pipe(
                map(() => entity),
                tap((result: SortOrderUpdate): void => {
                  patchState(
                    store,
                    updateEntities({
                      predicate: ({ id }: TEntity) =>
                        result.sortOrdersMap.some(
                          (item: SortOrderItem): boolean => item.id === id
                        ),
                      changes: ({ id }: TEntity) =>
                        ({
                          sortOrder: result.sortOrdersMap.find(
                            (sortOrderItem: SortOrderItem) =>
                              sortOrderItem.id === id
                          )?.sortOrder,
                        }) as Partial<TEntity>,
                    })
                  );
                }),

                store.handleStatus({
                  showError: true,
                  errorMessage: `Failed to reorder ${entityNamePlural}`,
                })
              )
            )
          )
        ),

        select(entity: TEntity | null): void {
          patchState(store, { current: entity });
        },

        resetEntities(): void {
          patchState(store, removeAllEntities());
        },

        resetState(partialReset?: boolean): void {
          store.resetStatusState(partialReset);

          patchState(store, removeAllEntities());
        },

        fetchInit$(): Observable<TFetchAll> {
          return fetchInitSubject.asObservable();
        },

        fetchSuccess$(): Observable<TEntity[]> {
          return fetchSuccessSubject.asObservable();
        },

        deleteSuccess$(): Observable<TEntity> {
          return deleteSuccessSubject.asObservable();
        },
      })
    )
  );
}
