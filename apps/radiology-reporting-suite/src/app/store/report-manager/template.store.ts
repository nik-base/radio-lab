import { DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { patchState, signalStore, withHooks, withMethods } from '@ngrx/signals';
import { addEntity } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap, map, pipe, switchMap, tap } from 'rxjs';

import { GenericEntityMapperService } from '@app/mapper/generic-entity-mapper.service';
import {
  TemplateCreateDto,
  TemplateDto,
  TemplateExportDto,
  TemplateImportDto,
  TemplateUpdateDto,
} from '@app/models/data';
import {
  Template,
  TemplateCreate,
  TemplateExport,
  TemplateImport,
  TemplateUpdate,
} from '@app/models/domain';
import { TemplateManagerService } from '@app/services/report-manager/template-manager.service';
import { isNotNil } from '@app/utils/functions/common.functions';
import { FileService } from '@app/utils/services/file.service';

import { withCRUD } from '../utils/signal-store-features/with-crud.store-feature';

import { AppEntityState } from './entity-state.interface';
import { ScopeStore } from './scope.store';

const initialState: AppEntityState<Template> = {
  current: null,
  isLoading: false,
  error: null,
  currentOperation: null,
};

// eslint-disable-next-line @typescript-eslint/typedef
export const TemplateStore = signalStore(
  withCRUD<
    Template,
    TemplateDto,
    TemplateCreate,
    TemplateCreateDto,
    TemplateUpdate,
    TemplateUpdateDto,
    void,
    TemplateManagerService
  >(initialState, TemplateManagerService, 'template', 'templates'),
  withMethods(
    (
      // eslint-disable-next-line @typescript-eslint/typedef
      store,
      templateManagerService: TemplateManagerService = inject(
        TemplateManagerService
      ),
      genericEntityMapper: GenericEntityMapperService = inject(
        GenericEntityMapperService
      ),
      fileService: FileService = inject(FileService),
      scopeStore: InstanceType<typeof ScopeStore> = inject(ScopeStore)
    ) => ({
      import: rxMethod<TemplateImport>(
        pipe(
          store.setLoading('import'),

          exhaustMap((input: TemplateImport) =>
            templateManagerService
              .import$(
                genericEntityMapper.mapToDto<TemplateImport, TemplateImportDto>(
                  input
                )
              )
              .pipe(
                map(
                  (dto: TemplateDto): Template =>
                    genericEntityMapper.mapFromDto<Template, TemplateDto>(dto)
                ),
                tap((result: Template): void => {
                  patchState(store, addEntity(result));
                }),

                store.handleStatus({
                  showSuccess: true,
                  successMessage: `Successfully imported template "${input.name}"`,
                  showError: true,
                  errorMessage: `Failed to import template "${input.name}"`,
                })
              )
          )
        )
      ),

      export: rxMethod<Template>(
        pipe(
          store.setLoading('export'),

          switchMap((input: Template) =>
            templateManagerService.export$(input.id).pipe(
              map(
                (dto: TemplateExportDto): TemplateExport =>
                  genericEntityMapper.mapFromDto<
                    TemplateExport,
                    TemplateExportDto
                  >(dto)
              ),
              tap((result: TemplateExport): void => {
                fileService.downloadJSONObject(result, result.name, 2);
              }),

              store.handleStatus({
                showSuccess: true,
                successMessage: `Successfully exported template "${input.name}"`,
                showError: true,
                errorMessage: `Failed to export template "${input.name}"`,
              })
            )
          )
        )
      ),

      change(entity: Template | null): void {
        store.select(entity);

        scopeStore.reset(true);

        if (isNotNil(entity)) {
          scopeStore.fetchAll({ id: entity.id });
        }
      },

      reset(partialReset?: boolean): void {
        store.resetState(partialReset);

        scopeStore.reset();
      },

      resetSelf(): void {
        store.resetStatusState();

        scopeStore.reset();
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
