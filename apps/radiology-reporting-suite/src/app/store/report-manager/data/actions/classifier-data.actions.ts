import { createActionGroup, props } from '@ngrx/store';

import {
  ApplicationErrorDto,
  FindingClassifierCreateDto,
  FindingClassifierDto,
  FindingClassifierUpdateDto,
  SortOrderUpdateDto,
} from '@app/models/data';

// eslint-disable-next-line @typescript-eslint/typedef
export const ClassifierDataActions = createActionGroup({
  source: 'Report Manager Classifier Data',
  events: {
    Fetch: props<{ readonly scopeId: string; groupId: string }>(),
    'Fetch Success': props<{ readonly classifiers: FindingClassifierDto[] }>(),
    'Fetch Failure': props<{
      readonly error: ApplicationErrorDto<string>;
    }>(),

    Create: props<{ readonly classifier: FindingClassifierCreateDto }>(),
    'Create Success': props<{ readonly classifier: FindingClassifierDto }>(),
    'Create Failure': props<{
      readonly error: ApplicationErrorDto<FindingClassifierCreateDto>;
    }>(),

    Update: props<{ readonly classifier: FindingClassifierUpdateDto }>(),
    'Update Success': props<{ readonly classifier: FindingClassifierDto }>(),
    'Update Failure': props<{
      readonly error: ApplicationErrorDto<FindingClassifierUpdateDto>;
    }>(),

    Delete: props<{ readonly classifier: FindingClassifierDto }>(),
    'Delete Success': props<{ readonly classifier: FindingClassifierDto }>(),
    'Delete Failure': props<{
      readonly error: ApplicationErrorDto<FindingClassifierDto>;
    }>(),

    Reorder: props<{ readonly sortOrders: SortOrderUpdateDto }>(),
    'Reorder Success': props<{ readonly sortOrders: SortOrderUpdateDto }>(),
    'Reorder Failure': props<{
      readonly error: ApplicationErrorDto;
    }>(),
  },
});
