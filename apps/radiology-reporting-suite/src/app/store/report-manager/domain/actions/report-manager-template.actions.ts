import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { ErrorNotificationModel } from '../../../../models';
import {
  TemplateCreateDto,
  TemplateDto,
  TemplateImportDto,
  TemplateUpdateDto,
} from '../../../../models/data';

// eslint-disable-next-line @typescript-eslint/typedef
export const ReportManagerTemplateActions = createActionGroup({
  source: 'Report Manager Template',
  events: {
    Fetch: emptyProps(),
    'Fetch Success': props<{ readonly templates: TemplateDto[] }>(),
    'Fetch Failure': props<{
      readonly error: ErrorNotificationModel;
    }>(),

    Create: props<{ readonly template: TemplateCreateDto }>(),
    'Create Success': props<{ readonly template: TemplateDto }>(),
    'Create Failure': props<{
      readonly error: ErrorNotificationModel<TemplateCreateDto>;
    }>(),

    Update: props<{ readonly template: TemplateUpdateDto }>(),
    'Update Success': props<{ readonly template: TemplateDto }>(),
    'Update Failure': props<{
      readonly error: ErrorNotificationModel<TemplateUpdateDto>;
    }>(),

    Delete: props<{ readonly template: TemplateDto }>(),
    'Delete Success': props<{ readonly template: TemplateDto }>(),
    'Delete Failure': props<{
      readonly error: ErrorNotificationModel<TemplateDto>;
    }>(),

    Export: props<{ readonly template: TemplateDto }>(),
    'Export Success': props<{ readonly template: TemplateDto }>(),
    'Export Failure': props<{
      readonly error: ErrorNotificationModel<TemplateDto>;
    }>(),

    Import: props<{ readonly template: TemplateImportDto }>(),
    'Import Success': props<{
      readonly template: TemplateDto;
    }>(),
    'Import Failure': props<{
      readonly error: ErrorNotificationModel<TemplateImportDto>;
    }>(),
  },
});
