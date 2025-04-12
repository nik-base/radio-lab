import { createActionGroup, emptyProps, props } from '@ngrx/store';

import {
  ApplicationErrorDto,
  SortOrderUpdateDto,
  TemplateCreateDto,
  TemplateDataDto,
  TemplateDto,
  TemplateImportDto,
  TemplateUpdateDto,
} from '@app/models/data';

// eslint-disable-next-line @typescript-eslint/typedef
export const TemplateDataActions = createActionGroup({
  source: 'Report Manager Template Data',
  events: {
    Fetch: emptyProps(),
    'Fetch Success': props<{ readonly templates: TemplateDto[] }>(),
    'Fetch Failure': props<{
      readonly error: ApplicationErrorDto;
    }>(),

    Create: props<{ readonly template: TemplateCreateDto }>(),
    'Create Success': props<{ readonly template: TemplateDto }>(),
    'Create Failure': props<{
      readonly error: ApplicationErrorDto<TemplateCreateDto>;
    }>(),

    Update: props<{ readonly template: TemplateUpdateDto }>(),
    'Update Success': props<{ readonly template: TemplateDto }>(),
    'Update Failure': props<{
      readonly error: ApplicationErrorDto<TemplateUpdateDto>;
    }>(),

    Delete: props<{ readonly template: TemplateDto }>(),
    'Delete Success': props<{ readonly template: TemplateDto }>(),
    'Delete Failure': props<{
      readonly error: ApplicationErrorDto<TemplateDto>;
    }>(),

    Export: props<{ readonly template: TemplateDto }>(),
    'Export Success': props<{ readonly template: TemplateDataDto }>(),
    'Export Failure': props<{
      readonly error: ApplicationErrorDto<TemplateDto>;
    }>(),

    Import: props<{ readonly template: TemplateImportDto }>(),
    'Import Success': props<{
      readonly template: TemplateDto;
    }>(),
    'Import Failure': props<{
      readonly error: ApplicationErrorDto<TemplateImportDto>;
    }>(),

    Reorder: props<{ readonly sortOrders: SortOrderUpdateDto }>(),
    'Reorder Success': props<{ readonly sortOrders: SortOrderUpdateDto }>(),
    'Reorder Failure': props<{
      readonly error: ApplicationErrorDto;
    }>(),
  },
});
