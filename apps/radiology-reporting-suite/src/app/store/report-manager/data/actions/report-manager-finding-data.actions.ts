import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { ErrorNotificationModel } from '../../../../models';
import {
  FindingCreateDto,
  FindingDto,
  FindingUpdateDto,
  SortOrderUpdateDto,
} from '../../../../models/data';

// eslint-disable-next-line @typescript-eslint/typedef
export const ReportManagerFindingDataActions = createActionGroup({
  source: 'Report Manager Finding Data',
  events: {
    Fetch: props<{ readonly scopeId: string }>(),
    'Fetch Success': props<{ readonly findings: FindingDto[] }>(),
    'Fetch Failure': props<{
      readonly error: ErrorNotificationModel<string>;
    }>(),

    Create: props<{ readonly finding: FindingCreateDto }>(),
    'Create Success': props<{ readonly finding: FindingDto }>(),
    'Create Failure': props<{
      readonly error: ErrorNotificationModel<FindingCreateDto>;
    }>(),

    Update: props<{ readonly finding: FindingUpdateDto }>(),
    'Update Success': props<{ readonly finding: FindingDto }>(),
    'Update Failure': props<{
      readonly error: ErrorNotificationModel<FindingUpdateDto>;
    }>(),

    Delete: props<{ readonly finding: FindingDto }>(),
    'Delete Success': props<{ readonly finding: FindingDto }>(),
    'Delete Failure': props<{
      readonly error: ErrorNotificationModel<FindingDto>;
    }>(),

    Reorder: props<{ readonly sortOrders: SortOrderUpdateDto }>(),
    'Reorder Success': emptyProps(),
    'Reorder Failure': props<{
      readonly error: ErrorNotificationModel;
    }>(),

    Clone: props<{
      readonly finding: FindingDto;
    }>(),
    'Clone Success': props<{
      readonly finding: FindingDto;
    }>(),
    'Clone Failure': props<{
      readonly error: ErrorNotificationModel<FindingDto>;
    }>(),
  },
});
