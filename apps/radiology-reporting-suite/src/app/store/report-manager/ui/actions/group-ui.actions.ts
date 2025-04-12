import { createActionGroup, emptyProps, props } from '@ngrx/store';

import {
  FindingGroup,
  FindingGroupCreate,
  FindingGroupUpdate,
  SortOrderUpdate,
} from '@app/models/domain';

// eslint-disable-next-line @typescript-eslint/typedef
export const GroupUIActions = createActionGroup({
  source: 'Report Manager Group UI',
  events: {
    Fetch: props<{ readonly scopeId: string }>(),

    Create: props<{ readonly group: FindingGroupCreate }>(),

    Update: props<{ readonly group: FindingGroupUpdate }>(),

    Delete: props<{ readonly group: FindingGroup }>(),

    Reorder: props<{ readonly sortOrders: SortOrderUpdate }>(),

    Change: props<{ readonly group: FindingGroup }>(),

    Reset: emptyProps(),
  },
});
