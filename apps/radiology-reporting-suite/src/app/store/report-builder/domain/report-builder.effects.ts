import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs';

import { ApplicationErrorMapperService } from '@app/mapper/application-error-mapper.service';
import { TemplateMapperService } from '@app/mapper/template-mapper.service';
import { TemplateDto } from '@app/models/data';
import { Template } from '@app/models/domain';
import { ApplicationActions } from '@app/store/actions/application.actions';

import { ReportBuilderDataActions } from '../data/report-builder-data.actions';

import { ReportBuilderActions } from './report-builder.actions';

@Injectable()
export class ReportBuilderEffects {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  private readonly actions$: Actions = inject(Actions);

  private readonly templateMapper: TemplateMapperService = inject(
    TemplateMapperService
  );

  private readonly errorMapper: ApplicationErrorMapperService = inject(
    ApplicationErrorMapperService
  );

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly fetchTemplates$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportBuilderActions.fetchTemplates),
      map(() => ReportBuilderDataActions.fetchTemplates())
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly fetchTemplatesFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportBuilderDataActions.fetchTemplatesFailure),
      map(
        ({
          error,
        }: ReturnType<
          typeof ReportBuilderDataActions.fetchTemplatesFailure
        >) => {
          return ReportBuilderActions.fetchTemplatesFailure({
            error: this.errorMapper.mapFromDto(
              error,
              'Failed to fetch templates'
            ),
          });
        }
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly fetchTemplatesSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportBuilderDataActions.fetchTemplatesSuccess),
      map(
        ({
          templates,
        }: ReturnType<
          typeof ReportBuilderDataActions.fetchTemplatesSuccess
        >) => {
          return ReportBuilderActions.fetchTemplatesSuccess({
            templates: templates.map(
              (template: TemplateDto): Template =>
                this.templateMapper.mapFromDto(template)
            ),
          });
        }
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly fetchTemplateData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportBuilderActions.fetchTemplateData),
      map(
        ({
          templateId,
        }: ReturnType<typeof ReportBuilderActions.fetchTemplateData>) =>
          ReportBuilderDataActions.fetchTemplateData({ templateId })
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly fetchTemplateDataFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportBuilderDataActions.fetchTemplateDataFailure),
      map(
        ({
          error,
        }: ReturnType<
          typeof ReportBuilderDataActions.fetchTemplateDataFailure
        >) => {
          return ReportBuilderActions.fetchTemplateDataFailure({
            error: this.errorMapper.mapFromDto(
              error,
              'Failed to fetch template data'
            ),
          });
        }
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly fetchTemplateDataSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportBuilderDataActions.fetchTemplateDataSuccess),
      map(
        ({
          template,
        }: ReturnType<
          typeof ReportBuilderDataActions.fetchTemplateDataSuccess
        >) => {
          return ReportBuilderActions.fetchTemplateDataSuccess({
            template: this.templateMapper.mapFromDataDto(template),
          });
        }
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly resetScope$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportBuilderActions.resetTemplateData),
      map(() => ReportBuilderActions.resetScope())
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly failure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        ReportBuilderActions.fetchTemplatesFailure,
        ReportBuilderActions.fetchTemplateDataFailure
      ),
      map(
        ({
          error,
        }:
          | ReturnType<typeof ReportBuilderActions.fetchTemplatesFailure>
          | ReturnType<typeof ReportBuilderActions.fetchTemplateDataFailure>) =>
          ApplicationActions.error({ error })
      )
    );
  });
}
