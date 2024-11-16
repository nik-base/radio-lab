import { createActionGroup, emptyProps, props } from '@ngrx/store';

// eslint-disable-next-line @typescript-eslint/typedef
export const ReportBuilderUIActions = createActionGroup({
  source: 'Report Builder UI',
  events: {
    'Fetch Templates': emptyProps(),

    'Fetch Template Data': props<{ readonly templateId: string }>(),

    'Reset Template Data': emptyProps(),
  },
});
