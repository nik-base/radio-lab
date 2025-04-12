import { createActionGroup, props } from '@ngrx/store';

import {
  ApplicationErrorDto,
  FindingGroupCreateDto,
  FindingGroupDto,
  FindingGroupUpdateDto,
  SortOrderUpdateDto,
} from '@app/models/data';

// eslint-disable-next-line @typescript-eslint/typedef
export const GroupDataActions = createActionGroup({
  source: 'Report Manager Group Data',
  events: {
    Fetch: props<{ readonly scopeId: string }>(),
    'Fetch Success': props<{ readonly groups: FindingGroupDto[] }>(),
    'Fetch Failure': props<{
      readonly error: ApplicationErrorDto<string>;
    }>(),

    Create: props<{ readonly group: FindingGroupCreateDto }>(),
    'Create Success': props<{ readonly group: FindingGroupDto }>(),
    'Create Failure': props<{
      readonly error: ApplicationErrorDto<FindingGroupCreateDto>;
    }>(),

    Update: props<{ readonly group: FindingGroupUpdateDto }>(),
    'Update Success': props<{ readonly group: FindingGroupDto }>(),
    'Update Failure': props<{
      readonly error: ApplicationErrorDto<FindingGroupUpdateDto>;
    }>(),

    Delete: props<{ readonly group: FindingGroupDto }>(),
    'Delete Success': props<{ readonly group: FindingGroupDto }>(),
    'Delete Failure': props<{
      readonly error: ApplicationErrorDto<FindingGroupDto>;
    }>(),

    Reorder: props<{ readonly sortOrders: SortOrderUpdateDto }>(),
    'Reorder Success': props<{ readonly sortOrders: SortOrderUpdateDto }>(),
    'Reorder Failure': props<{
      readonly error: ApplicationErrorDto;
    }>(),
  },
});
