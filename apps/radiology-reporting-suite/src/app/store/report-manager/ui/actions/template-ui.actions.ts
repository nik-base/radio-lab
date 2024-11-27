import { createActionGroup, emptyProps, props } from '@ngrx/store';

import {
  ApplicationError,
  Template,
  TemplateCreate,
  TemplateData,
  TemplateImport,
  TemplateUpdate,
} from '@app/models/domain';

// eslint-disable-next-line @typescript-eslint/typedef
export const TemplateUIActions = createActionGroup({
  source: 'Report Manager Template UI',
  events: {
    Fetch: emptyProps(),

    Create: props<{ readonly template: TemplateCreate }>(),

    Update: props<{ readonly template: TemplateUpdate }>(),

    Delete: props<{ readonly template: Template }>(),

    Export: props<{ readonly template: Template }>(),

    Download: props<{ readonly template: TemplateData }>(),
    'Download Success': props<{ readonly template: TemplateData }>(),
    'Download Failure': props<{
      readonly error: ApplicationError<TemplateData>;
    }>(),

    Import: props<{ readonly template: TemplateImport }>(),
  },
});
