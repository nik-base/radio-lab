import { createActionGroup, emptyProps, props } from '@ngrx/store';

import {
  FindingClassifier,
  FindingClassifierCreate,
  FindingClassifierUpdate,
  SortOrderUpdate,
} from '@app/models/domain';

// eslint-disable-next-line @typescript-eslint/typedef
export const ClassifierUIActions = createActionGroup({
  source: 'Report Manager Classifier UI',
  events: {
    Fetch: props<{ readonly scopeId: string; groupId: string }>(),

    Create: props<{ readonly classifier: FindingClassifierCreate }>(),

    Update: props<{ readonly classifier: FindingClassifierUpdate }>(),

    Delete: props<{ readonly classifier: FindingClassifier }>(),

    Reorder: props<{ readonly sortOrders: SortOrderUpdate }>(),

    Change: props<{ readonly classifier: FindingClassifier }>(),

    Reset: emptyProps(),
  },
});
