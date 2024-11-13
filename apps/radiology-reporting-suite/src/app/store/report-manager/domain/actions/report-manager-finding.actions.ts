import { createActionGroup, emptyProps, props } from '@ngrx/store';

import {
  ApplicationError,
  Finding,
  FindingCreate,
  FindingUpdate,
  SortOrderUpdate,
} from '@app/models/domain';

// eslint-disable-next-line @typescript-eslint/typedef
export const ReportManagerFindingDataActions = createActionGroup({
  source: 'Report Manager Finding Data',
  events: {
    Fetch: props<{ readonly scopeId: string }>(),
    'Fetch Success': props<{ readonly findings: Finding[] }>(),
    'Fetch Failure': props<{
      readonly error: ApplicationError<string>;
    }>(),

    Create: props<{ readonly finding: FindingCreate }>(),
    'Create Success': props<{ readonly finding: Finding }>(),
    'Create Failure': props<{
      readonly error: ApplicationError<FindingCreate>;
    }>(),

    Update: props<{ readonly finding: FindingUpdate }>(),
    'Update Success': props<{ readonly finding: Finding }>(),
    'Update Failure': props<{
      readonly error: ApplicationError<FindingUpdate>;
    }>(),

    Delete: props<{ readonly finding: Finding }>(),
    'Delete Success': props<{ readonly finding: Finding }>(),
    'Delete Failure': props<{
      readonly error: ApplicationError<Finding>;
    }>(),

    Reorder: props<{ readonly sortOrders: SortOrderUpdate }>(),
    'Reorder Success': emptyProps(),
    'Reorder Failure': props<{
      readonly error: ApplicationError;
    }>(),

    Clone: props<{
      readonly finding: Finding;
    }>(),
    'Clone Success': props<{
      readonly finding: Finding;
    }>(),
    'Clone Failure': props<{
      readonly error: ApplicationError<Finding>;
    }>(),
  },
});
