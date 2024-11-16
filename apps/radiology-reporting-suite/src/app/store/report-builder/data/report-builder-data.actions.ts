import { createActionGroup, emptyProps, props } from '@ngrx/store';

import {
  ApplicationErrorDto,
  TemplateDataDto,
  TemplateDto,
} from '@app/models/data';

// eslint-disable-next-line @typescript-eslint/typedef
export const ReportBuilderDataActions = createActionGroup({
  source: 'Report Builder Data',
  events: {
    'Fetch Templates': emptyProps(),
    'Fetch Templates Success': props<{ readonly templates: TemplateDto[] }>(),
    'Fetch Templates Failure': props<{
      readonly error: ApplicationErrorDto;
    }>(),

    'Fetch Template Data': props<{ readonly templateId: string }>(),
    'Fetch Template Data Success': props<{
      readonly template: TemplateDataDto;
    }>(),
    'Fetch Template Data Failure': props<{
      readonly error: ApplicationErrorDto;
    }>(),

    'Reset Template Data': emptyProps(),
  },
});
