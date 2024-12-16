import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Scope } from '@app/models/domain';

// eslint-disable-next-line @typescript-eslint/typedef
export const ReportBuilderUIActions = createActionGroup({
  source: 'Report Builder UI',
  events: {
    Load: emptyProps(),

    'Fetch Templates': emptyProps(),

    'Fetch Template Data': props<{ readonly templateId: string }>(),

    'Reset Template Data': emptyProps(),

    'Set Scope': props<{ readonly scope: Scope }>(),

    'Reset Scope': emptyProps(),
  },
});
