import { inject } from '@angular/core';
import { signalStore, withMethods } from '@ngrx/signals';

import {
  FindingClassifierCreateDto,
  FindingClassifierDto,
  FindingClassifierUpdateDto,
} from '@app/models/data';
import {
  FindingClassifier,
  FindingClassifierCreate,
  FindingClassifierUpdate,
} from '@app/models/domain';
import { ClassifierManagerService } from '@app/services/report-manager/classifier-manager.service';
import { isNotNil } from '@app/utils/functions/common.functions';

import { withCRUD } from '../utils/signal-store-features/with-crud.store-feature';

import { AppEntityState } from './entity-state.interface';
import { FindingStore } from './finding.store';

const initialState: AppEntityState<FindingClassifier> = {
  current: null,
  isLoading: false,
  error: null,
  currentOperation: null,
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
    ClassifierManagerService
  >(initialState, ClassifierManagerService, 'classifier', 'classifiers'),
  withMethods(
    (
      // eslint-disable-next-line @typescript-eslint/typedef
      store,
      findingStore: InstanceType<typeof FindingStore> = inject(FindingStore)
    ) => ({
      change(entity: FindingClassifier | null): void {
        store.select(entity);

        if (isNotNil(entity)) {
          findingStore.fetchAll({
            id: entity.scopeId,
            groupId: entity.groupId,
            classifierId: entity.id,
          });
        }

        findingStore.reset();
      },

      reset(): void {
        store.resetState();

        findingStore.resetState();
      },
    })
  )
);
