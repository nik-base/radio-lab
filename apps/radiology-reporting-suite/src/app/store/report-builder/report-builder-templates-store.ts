import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { isNil } from 'lodash-es';
import { map, pipe, switchMap, tap } from 'rxjs';

import { GenericEntityMapperService } from '@app/mapper/generic-entity-mapper.service';
import { TemplateDto } from '@app/models/data';
import { Template } from '@app/models/domain';
import { ReportBuilderService } from '@app/services/report-builder/report-builder.service';
import { orderBySortOrder } from '@app/utils/functions/order.functions';

import { AppEntityState } from '../entity-state.interface';
import { withRequestStatus } from '../utils/signal-store-features/with-request-status.store-feature';

const initialState: AppEntityState<ReadonlyArray<Template>> = {
  current: null,
  isLoading: false,
  error: null,
  currentOperation: null,
};

// eslint-disable-next-line @typescript-eslint/typedef
export const ReportBuilderTemplateStore = signalStore(
  withRequestStatus(initialState),

  // eslint-disable-next-line @typescript-eslint/typedef
  withComputed(({ current }) => ({
    templates: computed(() => {
      const templates: ReadonlyArray<Template> | null = current();

      if (isNil(templates)) {
        return null;
      }

      return orderBySortOrder(templates);
    }),
  })),

  withMethods(
    (
      // eslint-disable-next-line @typescript-eslint/typedef
      store,
      reportBuilderService: ReportBuilderService = inject(ReportBuilderService),
      genericEntityMapper: GenericEntityMapperService = inject(
        GenericEntityMapperService
      )
    ) => ({
      fetchAll: rxMethod<void>(
        pipe(
          store.setLoading('fetchAll'),

          switchMap(() => {
            return reportBuilderService.fetchTemplates$().pipe(
              map((dto: TemplateDto[]): Template[] =>
                genericEntityMapper.mapFromDtoList<Template, TemplateDto>(dto)
              ),
              tap((result: Template[]): void => {
                patchState(store, {
                  current: result,
                });
              }),

              store.handleStatus({
                showError: true,
                errorMessage: 'Failed to fetch templates',
              })
            );
          })
        )
      ),
    })
  )
);
