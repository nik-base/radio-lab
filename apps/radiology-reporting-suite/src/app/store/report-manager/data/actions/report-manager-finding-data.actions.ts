import { createActionGroup, props } from '@ngrx/store';

import {
  ApplicationErrorDto,
  FindingCreateDto,
  FindingDto,
  FindingUpdateDto,
  SortOrderUpdateDto,
} from '@app/models/data';

// eslint-disable-next-line @typescript-eslint/typedef
export const ReportManagerFindingDataActions = createActionGroup({
  source: 'Report Manager Finding Data',
  events: {
    Fetch: props<{ readonly scopeId: string }>(),
    'Fetch Success': props<{ readonly findings: FindingDto[] }>(),
    'Fetch Failure': props<{
      readonly error: ApplicationErrorDto<string>;
    }>(),

    Create: props<{ readonly finding: FindingCreateDto }>(),
    'Create Success': props<{ readonly finding: FindingDto }>(),
    'Create Failure': props<{
      readonly error: ApplicationErrorDto<FindingCreateDto>;
    }>(),

    Update: props<{ readonly finding: FindingUpdateDto }>(),
    'Update Success': props<{ readonly finding: FindingDto }>(),
    'Update Failure': props<{
      readonly error: ApplicationErrorDto<FindingUpdateDto>;
    }>(),

    Delete: props<{ readonly finding: FindingDto }>(),
    'Delete Success': props<{ readonly finding: FindingDto }>(),
    'Delete Failure': props<{
      readonly error: ApplicationErrorDto<FindingDto>;
    }>(),

    Reorder: props<{ readonly sortOrders: SortOrderUpdateDto }>(),
    'Reorder Success': props<{ readonly sortOrders: SortOrderUpdateDto }>(),
    'Reorder Failure': props<{
      readonly error: ApplicationErrorDto;
    }>(),

    Clone: props<{
      readonly finding: FindingDto;
    }>(),
    'Clone Success': props<{
      readonly finding: FindingDto;
    }>(),
    'Clone Failure': props<{
      readonly error: ApplicationErrorDto<FindingDto>;
    }>(),
  },
});
