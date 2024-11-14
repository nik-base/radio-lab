import { createActionGroup, props } from '@ngrx/store';

import {
  ApplicationErrorDto,
  ScopeCreateDto,
  ScopeDto,
  ScopeUpdateDto,
  SortOrderUpdateDto,
} from '@app/models/data';

// eslint-disable-next-line @typescript-eslint/typedef
export const ReportManagerScopeDataActions = createActionGroup({
  source: 'Report Manager Scope Data',
  events: {
    Fetch: props<{ readonly templateId: string }>(),
    'Fetch Success': props<{ readonly scopes: ScopeDto[] }>(),
    'Fetch Failure': props<{
      readonly error: ApplicationErrorDto<string>;
    }>(),

    Create: props<{ readonly scope: ScopeCreateDto }>(),
    'Create Success': props<{ readonly scope: ScopeDto }>(),
    'Create Failure': props<{
      readonly error: ApplicationErrorDto<ScopeCreateDto>;
    }>(),

    Update: props<{ readonly scope: ScopeUpdateDto }>(),
    'Update Success': props<{ readonly scope: ScopeDto }>(),
    'Update Failure': props<{
      readonly error: ApplicationErrorDto<ScopeUpdateDto>;
    }>(),

    Delete: props<{ readonly scope: ScopeDto }>(),
    'Delete Success': props<{ readonly scope: ScopeDto }>(),
    'Delete Failure': props<{
      readonly error: ApplicationErrorDto<ScopeDto>;
    }>(),

    Reorder: props<{ readonly sortOrders: SortOrderUpdateDto }>(),
    'Reorder Success': props<{ readonly sortOrders: SortOrderUpdateDto }>(),
    'Reorder Failure': props<{
      readonly error: ApplicationErrorDto;
    }>(),

    Clone: props<{
      readonly scope: ScopeDto;
      readonly templateId: string;
    }>(),
    'Clone Success': props<{
      readonly scope: ScopeDto;
      readonly templateId: string;
    }>(),
    'Clone Failure': props<{
      readonly error: ApplicationErrorDto<ScopeDto>;
    }>(),
  },
});
