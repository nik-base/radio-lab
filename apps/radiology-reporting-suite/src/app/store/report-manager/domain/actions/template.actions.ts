import { createActionGroup, emptyProps, props } from '@ngrx/store';

import {
  ApplicationError,
  SortOrderUpdate,
  Template,
  TemplateCreate,
  TemplateData,
  TemplateImport,
  TemplateUpdate,
} from '@app/models/domain';

// eslint-disable-next-line @typescript-eslint/typedef
export const TemplateActions = createActionGroup({
  source: 'Report Manager Template',
  events: {
    Fetch: emptyProps(),
    'Fetch Success': props<{ readonly templates: Template[] }>(),
    'Fetch Failure': props<{
      readonly error: ApplicationError;
    }>(),

    Create: props<{ readonly template: TemplateCreate }>(),
    'Create Success': props<{ readonly template: Template }>(),
    'Create Failure': props<{
      readonly error: ApplicationError<TemplateCreate>;
    }>(),

    Update: props<{ readonly template: TemplateUpdate }>(),
    'Update Success': props<{ readonly template: Template }>(),
    'Update Failure': props<{
      readonly error: ApplicationError<TemplateUpdate>;
    }>(),

    Delete: props<{ readonly template: Template }>(),
    'Delete Success': props<{ readonly template: Template }>(),
    'Delete Failure': props<{
      readonly error: ApplicationError<Template>;
    }>(),

    Export: props<{ readonly template: Template }>(),
    'Export Success': props<{ readonly template: TemplateData }>(),
    'Export Failure': props<{
      readonly error: ApplicationError<Template>;
    }>(),

    Import: props<{ readonly template: TemplateImport }>(),
    'Import Success': props<{
      readonly template: Template;
    }>(),
    'Import Failure': props<{
      readonly error: ApplicationError<TemplateImport>;
    }>(),

    Reorder: props<{ readonly sortOrders: SortOrderUpdate }>(),
    'Reorder Success': props<{ readonly sortOrders: SortOrderUpdate }>(),
    'Reorder Failure': props<{
      readonly error: ApplicationError;
    }>(),

    'Set Selected': props<{ readonly template: Template }>(),

    Reset: emptyProps(),
  },
});
