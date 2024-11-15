import { createActionGroup, props } from '@ngrx/store';

import {
  ApplicationError,
  Scope,
  ScopeCreate,
  ScopeUpdate,
  SortOrderUpdate,
} from '@app/models/domain';

// eslint-disable-next-line @typescript-eslint/typedef
export const ScopeActions = createActionGroup({
  source: 'Report Manager Scope',
  events: {
    Fetch: props<{ readonly templateId: string }>(),
    'Fetch Success': props<{ readonly scopes: Scope[] }>(),
    'Fetch Failure': props<{
      readonly error: ApplicationError<string>;
    }>(),

    Create: props<{ readonly scope: ScopeCreate }>(),
    'Create Success': props<{ readonly scope: Scope }>(),
    'Create Failure': props<{
      readonly error: ApplicationError<ScopeCreate>;
    }>(),

    Update: props<{ readonly scope: ScopeUpdate }>(),
    'Update Success': props<{ readonly scope: Scope }>(),
    'Update Failure': props<{
      readonly error: ApplicationError<ScopeUpdate>;
    }>(),

    Delete: props<{ readonly scope: Scope }>(),
    'Delete Success': props<{ readonly scope: Scope }>(),
    'Delete Failure': props<{
      readonly error: ApplicationError<Scope>;
    }>(),

    Reorder: props<{ readonly sortOrders: SortOrderUpdate }>(),
    'Reorder Success': props<{ readonly sortOrders: SortOrderUpdate }>(),
    'Reorder Failure': props<{
      readonly error: ApplicationError;
    }>(),

    Clone: props<{
      readonly scope: Scope;
      readonly templateId: string;
    }>(),
    'Clone Success': props<{
      readonly scope: Scope;
      readonly templateId: string;
    }>(),
    'Clone Failure': props<{
      readonly error: ApplicationError<Scope>;
    }>(),
  },
});
