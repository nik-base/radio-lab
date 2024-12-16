import { createActionGroup, emptyProps, props } from '@ngrx/store';

import {
  ApplicationError,
  Scope,
  Template,
  TemplateData,
} from '@app/models/domain';

// eslint-disable-next-line @typescript-eslint/typedef
export const ReportBuilderActions = createActionGroup({
  source: 'Report Builder',
  events: {
    'Fetch Templates': emptyProps(),
    'Fetch Templates Success': props<{ readonly templates: Template[] }>(),
    'Fetch Templates Failure': props<{
      readonly error: ApplicationError;
    }>(),

    'Fetch Template Data': props<{ readonly templateId: string }>(),
    'Fetch Template Data Success': props<{
      readonly template: TemplateData;
    }>(),
    'Fetch Template Data Failure': props<{
      readonly error: ApplicationError;
    }>(),

    'Reset Template Data': emptyProps(),

    'Set Scope': props<{ readonly scope: Scope }>(),
    'Reset Scope': emptyProps(),
  },
});
