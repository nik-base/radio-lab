import { createActionGroup, emptyProps, props } from '@ngrx/store';

import {
  ApplicationError,
  FindingClassifier,
  FindingClassifierCreate,
  FindingClassifierUpdate,
  SortOrderUpdate,
} from '@app/models/domain';

// eslint-disable-next-line @typescript-eslint/typedef
export const ClassifierActions = createActionGroup({
  source: 'Report Manager Classifier',
  events: {
    Fetch: props<{ readonly scopeId: string; groupId: string }>(),
    'Fetch Success': props<{ readonly classifiers: FindingClassifier[] }>(),
    'Fetch Failure': props<{
      readonly error: ApplicationError<string>;
    }>(),

    Create: props<{ readonly classifier: FindingClassifierCreate }>(),
    'Create Success': props<{ readonly classifier: FindingClassifier }>(),
    'Create Failure': props<{
      readonly error: ApplicationError<FindingClassifierCreate>;
    }>(),

    Update: props<{ readonly classifier: FindingClassifierUpdate }>(),
    'Update Success': props<{ readonly classifier: FindingClassifier }>(),
    'Update Failure': props<{
      readonly error: ApplicationError<FindingClassifierUpdate>;
    }>(),

    Delete: props<{ readonly classifier: FindingClassifier }>(),
    'Delete Success': props<{ readonly classifier: FindingClassifier }>(),
    'Delete Failure': props<{
      readonly error: ApplicationError<FindingClassifier>;
    }>(),

    Reorder: props<{ readonly sortOrders: SortOrderUpdate }>(),
    'Reorder Success': props<{ readonly sortOrders: SortOrderUpdate }>(),
    'Reorder Failure': props<{
      readonly error: ApplicationError;
    }>(),

    'Set Selected': props<{ readonly classifier: FindingClassifier }>(),

    Reset: emptyProps(),
  },
});
