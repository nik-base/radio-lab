import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { ErrorNotificationModel } from '../../../../models';
import {
  ScopeCreateDto,
  ScopeDto,
  ScopeUpdateDto,
  SortOrderUpdateDto,
} from '../../../../models/data';

// eslint-disable-next-line @typescript-eslint/typedef
export const ReportManagerScopeDataActions = createActionGroup({
  source: 'Report Manager Scope Data',
  events: {
    Fetch: props<{ readonly templateId: string }>(),
    'Fetch Success': props<{ readonly scopes: ScopeDto[] }>(),
    'Fetch Failure': props<{
      readonly error: ErrorNotificationModel<string>;
    }>(),

    Create: props<{ readonly scope: ScopeCreateDto }>(),
    'Create Success': props<{ readonly scope: ScopeDto }>(),
    'Create Failure': props<{
      readonly error: ErrorNotificationModel<ScopeCreateDto>;
    }>(),

    Update: props<{ readonly scope: ScopeUpdateDto }>(),
    'Update Success': props<{ readonly scope: ScopeDto }>(),
    'Update Failure': props<{
      readonly error: ErrorNotificationModel<ScopeUpdateDto>;
    }>(),

    Delete: props<{ readonly scope: ScopeDto }>(),
    'Delete Success': props<{ readonly scope: ScopeDto }>(),
    'Delete Failure': props<{
      readonly error: ErrorNotificationModel<ScopeDto>;
    }>(),

    Reorder: props<{ readonly sortOrders: SortOrderUpdateDto }>(),
    'Reorder Success': emptyProps(),
    'Reorder Failure': props<{
      readonly error: ErrorNotificationModel;
    }>(),

    Clone: props<{
      readonly scope: ScopeDto;
      readonly templateId: string;
    }>(),
    'Clone Success': props<{
      readonly scope: ScopeDto;
    }>(),
    'Clone Failure': props<{
      readonly error: ErrorNotificationModel<ScopeDto>;
    }>(),
  },
});
