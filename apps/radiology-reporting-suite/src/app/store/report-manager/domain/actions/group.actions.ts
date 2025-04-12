import { createActionGroup, emptyProps, props } from '@ngrx/store';

import {
  ApplicationError,
  FindingGroup,
  FindingGroupCreate,
  FindingGroupUpdate,
  SortOrderUpdate,
} from '@app/models/domain';

// eslint-disable-next-line @typescript-eslint/typedef
export const GroupActions = createActionGroup({
  source: 'Report Manager Group',
  events: {
    Fetch: props<{ readonly scopeId: string }>(),
    'Fetch Success': props<{ readonly groups: FindingGroup[] }>(),
    'Fetch Failure': props<{
      readonly error: ApplicationError<string>;
    }>(),

    Create: props<{ readonly group: FindingGroupCreate }>(),
    'Create Success': props<{ readonly group: FindingGroup }>(),
    'Create Failure': props<{
      readonly error: ApplicationError<FindingGroupCreate>;
    }>(),

    Update: props<{ readonly group: FindingGroupUpdate }>(),
    'Update Success': props<{ readonly group: FindingGroup }>(),
    'Update Failure': props<{
      readonly error: ApplicationError<FindingGroupUpdate>;
    }>(),

    Delete: props<{ readonly group: FindingGroup }>(),
    'Delete Success': props<{ readonly group: FindingGroup }>(),
    'Delete Failure': props<{
      readonly error: ApplicationError<FindingGroup>;
    }>(),

    Reorder: props<{ readonly sortOrders: SortOrderUpdate }>(),
    'Reorder Success': props<{ readonly sortOrders: SortOrderUpdate }>(),
    'Reorder Failure': props<{
      readonly error: ApplicationError;
    }>(),

    'Set Selected': props<{ readonly group: FindingGroup }>(),

    Reset: emptyProps(),
  },
});
