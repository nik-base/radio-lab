import { createActionGroup, emptyProps, props } from '@ngrx/store';

import {
  Template,
  TemplateCreate,
  TemplateImport,
  TemplateUpdate,
} from '@app/models/domain';

// eslint-disable-next-line @typescript-eslint/typedef
export const ReportManagerTemplateUIActions = createActionGroup({
  source: 'Report Manager Template UI',
  events: {
    Fetch: emptyProps(),

    Create: props<{ readonly template: TemplateCreate }>(),

    Update: props<{ readonly template: TemplateUpdate }>(),

    Delete: props<{ readonly template: Template }>(),

    Export: props<{ readonly template: Template }>(),

    Import: props<{ readonly template: TemplateImport }>(),
  },
});
