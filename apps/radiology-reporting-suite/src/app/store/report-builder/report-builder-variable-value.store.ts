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
import { VariableValueDto } from '@app/models/data';
import { VariableValue } from '@app/models/domain';
import { VariableUI } from '@app/models/ui';
import { ReportBuilderService } from '@app/services/report-builder/report-builder.service';
import { isNotNil } from '@app/utils/functions/common.functions';

import { AppEntityState } from '../entity-state.interface';
import { withRequestStatus } from '../utils/signal-store-features/with-request-status.store-feature';

const initialState: AppEntityState<Map<string, ReadonlyArray<VariableValue>>> =
  {
    current: new Map<string, ReadonlyArray<VariableValue>>(),
    isLoading: false,
    error: null,
    currentOperation: null,
  };

// eslint-disable-next-line @typescript-eslint/typedef
export const ReportBuilderVariableValueStore = signalStore(
  withRequestStatus(initialState),

  // eslint-disable-next-line @typescript-eslint/typedef
  withComputed(({ current }) => ({
    variableValues: computed(
      () => (variableId: string) =>
        computed(() => {
          const variableMap: Map<string, ReadonlyArray<VariableValue>> | null =
            current();

          if (isNil(variableMap)) {
            return null;
          }

          return variableMap.has(variableId)
            ? (variableMap.get(variableId) ?? null)
            : null;
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
      fetch: rxMethod<VariableUI>(
        pipe(
          store.setLoading('fetch'),

          switchMap((input: VariableUI) => {
            return reportBuilderService.fetchVariableValues$(input.id).pipe(
              map((dto: VariableValueDto[]): VariableValue[] =>
                genericEntityMapper.mapFromDtoList<
                  VariableValue,
                  VariableValueDto
                >(dto)
              ),
              tap((result: VariableValue[]): void => {
                patchState(
                  store,
                  (
                    state: AppEntityState<
                      Map<string, ReadonlyArray<VariableValue>>
                    >
                  ) => {
                    const newMap: Map<
                      string,
                      ReadonlyArray<VariableValue>
                    > = isNotNil(state.current)
                      ? new Map<string, ReadonlyArray<VariableValue>>(
                          state.current
                        )
                      : new Map<string, ReadonlyArray<VariableValue>>();

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
                errorMessage: `Failed to fetch values for variable ${input.name}`,
              })
            );
          })
        )
      ),
    })
  )
);
