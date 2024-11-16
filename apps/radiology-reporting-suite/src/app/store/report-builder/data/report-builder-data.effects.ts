import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';

import { TemplateDataDto, TemplateDto } from '@app/models/data';
import { ReportBuilderService } from '@app/services/report-builder/report-builder.service';

import { ReportBuilderDataActions } from './report-builder-data.actions';

@Injectable()
export class ReportBuilderDataEffects {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  private readonly actions$: Actions = inject(Actions);

  private readonly reportBuilderService: ReportBuilderService =
    inject(ReportBuilderService);

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly fetchTemplates$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportBuilderDataActions.fetchTemplates),
      switchMap(() =>
        this.reportBuilderService.fetchTemplates$().pipe(
          map((templates: TemplateDto[]) =>
            ReportBuilderDataActions.fetchTemplatesSuccess({ templates })
          ),
          catchError((error: unknown) =>
            of(
              ReportBuilderDataActions.fetchTemplatesFailure({
                error: { error },
              })
            )
          )
        )
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly fetchTemplateData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportBuilderDataActions.fetchTemplateData),
      switchMap(
        ({
          templateId,
        }: ReturnType<typeof ReportBuilderDataActions.fetchTemplateData>) =>
          this.reportBuilderService.fetchTemplate$(templateId).pipe(
            map((template: TemplateDataDto) =>
              ReportBuilderDataActions.fetchTemplateDataSuccess({ template })
            ),
            catchError((error: unknown) =>
              of(
                ReportBuilderDataActions.fetchTemplateDataFailure({
                  error: { error },
                })
              )
            )
          )
      )
    );
  });
}
