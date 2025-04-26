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

import { withCRUD } from '../utils/signal-store-features/with-crud.store-feature';

import { AppEntityState } from './entity-state.interface';

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
      store
    ) => ({
      change(entity: FindingClassifier | null): void {
        store.select(entity);
      },

      reset(): void {
        store.resetState();
      },
    })
  )
);
