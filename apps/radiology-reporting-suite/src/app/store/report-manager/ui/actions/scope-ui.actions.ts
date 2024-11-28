import { createActionGroup, emptyProps, props } from '@ngrx/store';

import {
  Scope,
  ScopeCreate,
  ScopeUpdate,
  SortOrderUpdate,
} from '@app/models/domain';

// eslint-disable-next-line @typescript-eslint/typedef
export const ScopeUIActions = createActionGroup({
  source: 'Report Manager Scope UI',
  events: {
    Fetch: props<{ readonly templateId: string }>(),

    Create: props<{ readonly scope: ScopeCreate }>(),

    Update: props<{ readonly scope: ScopeUpdate }>(),

    Delete: props<{ readonly scope: Scope }>(),

    Reorder: props<{ readonly sortOrders: SortOrderUpdate }>(),

    Clone: props<{
      readonly scope: Scope;
      readonly templateId: string;
    }>(),

    Change: props<{ readonly scope: Scope }>(),

    Reset: emptyProps(),
  },
});
