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
import { TemplateDataDto } from '@app/models/data';
import {
  FindingClassifierData,
  FindingGroupData,
  ScopeData,
  Template,
  TemplateData,
} from '@app/models/domain';
import { ReportBuilderService } from '@app/services/report-builder/report-builder.service';
import { isNotNil } from '@app/utils/functions/common.functions';
import { orderBySortOrder } from '@app/utils/functions/order.functions';

import { AppEntityState } from '../entity-state.interface';
import { withRequestStatus } from '../utils/signal-store-features/with-request-status.store-feature';

const initialState: AppEntityState<Map<string, TemplateData>> = {
  current: new Map<string, TemplateData>(),
  isLoading: false,
  error: null,
  currentOperation: null,
};

// eslint-disable-next-line @typescript-eslint/typedef
export const ReportBuilderTemplateDataStore = signalStore(
  withRequestStatus(initialState),

  // eslint-disable-next-line @typescript-eslint/typedef
  withComputed(({ current }) => ({
    templateData: computed(
      () => (templateId: string) =>
        computed(() => {
          const templateMap: Map<string, TemplateData> | null = current();

          if (isNil(templateMap)) {
            return null;
          }

          if (!templateMap.has(templateId)) {
            return null;
          }

          const templateDataItem: TemplateData | undefined =
            templateMap.get(templateId);

          if (isNil(templateDataItem)) {
            return null;
          }

          const sortedScopes: ScopeData[] = orderBySortOrder(
            templateDataItem.scopes
          ).map(
            (scope: ScopeData): ScopeData => ({
              ...scope,
              groups: orderBySortOrder(scope.groups).map(
                (group: FindingGroupData): FindingGroupData => ({
                  ...group,
                  classifiers: orderBySortOrder(group.classifiers).map(
                    (
                      classifier: FindingClassifierData
                    ): FindingClassifierData => ({
                      ...classifier,
                      findings: orderBySortOrder(classifier.findings),
                    })
                  ),
                })
              ),
            })
          );

          return {
            ...templateDataItem,
            scopes: sortedScopes,
          };
        })
    ),
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
      fetchData: rxMethod<Template>(
        pipe(
          store.setLoading('fetchData'),

          switchMap((input: Template) => {
            return reportBuilderService.fetchTemplate$(input.id).pipe(
              map(
                (dto: TemplateDataDto): TemplateData =>
                  genericEntityMapper.mapFromDto<TemplateData, TemplateDataDto>(
                    dto
                  )
              ),
              tap((result: TemplateData): void => {
                patchState(
                  store,
                  (state: AppEntityState<Map<string, TemplateData>>) => {
                    const newMap: Map<string, TemplateData> = isNotNil(
                      state.current
                    )
                      ? new Map<string, TemplateData>(state.current)
                      : new Map<string, TemplateData>();

                    if (!newMap.has(input.id)) {
                      newMap.set(input.id, result);
                    }

                    return {
                      current: newMap,
                    };
                  }
                );
              }),

              store.handleStatus({
                showError: true,
                errorMessage: `Failed to fetch data for template ${input.name}`,
              })
            );
          })
        )
      ),
    })
  )
);
