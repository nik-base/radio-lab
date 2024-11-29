import { createActionGroup, emptyProps, props } from '@ngrx/store';

import {
  Finding,
  FindingCreate,
  FindingUpdate,
  SortOrderUpdate,
} from '@app/models/domain';

// eslint-disable-next-line @typescript-eslint/typedef
export const FindingUIActions = createActionGroup({
  source: 'Report Manager Finding UI',
  events: {
    Fetch: props<{ readonly scopeId: string }>(),

    Create: props<{ readonly finding: FindingCreate }>(),

    Update: props<{ readonly finding: FindingUpdate }>(),

    Delete: props<{ readonly finding: Finding }>(),

    Reorder: props<{ readonly sortOrders: SortOrderUpdate }>(),

    Clone: props<{
      readonly finding: Finding;
    }>(),

    Change: props<{ readonly finding: Finding }>(),

    Reset: emptyProps(),
  },
});
