import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, switchMap } from 'rxjs';

import { TemplateDto } from '@app/models/data';
import { ReportManagerService } from '@app/services/report-manager/report-manager.service';

import { ReportManagerTemplateDataActions } from '../actions/report-manager-template-data.actions';

@Injectable()
export class ReportManagerTemplateDataEffects {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  private readonly actions$: Actions = inject(Actions);

  private readonly reportManagerService: ReportManagerService =
    inject(ReportManagerService);

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly fetch$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportManagerTemplateDataActions.fetch),
      switchMap(() =>
        this.reportManagerService.fetchTemplates$().pipe(
          map((templates: TemplateDto[]) =>
            ReportManagerTemplateDataActions.fetchSuccess({ templates })
          ),
          catchError((error: unknown) =>
            of(
              ReportManagerTemplateDataActions.fetchFailure({
                error: { error },
              })
            )
          )
        )
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly create$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportManagerTemplateDataActions.create),
      exhaustMap(
        ({
          template,
        }: ReturnType<typeof ReportManagerTemplateDataActions.create>) =>
          this.reportManagerService.createTemplate$(template).pipe(
            map((createdTemplate: TemplateDto) =>
              ReportManagerTemplateDataActions.createSuccess({
                template: createdTemplate,
              })
            ),
            catchError((error: unknown) =>
              of(
                ReportManagerTemplateDataActions.createFailure({
                  error: { error, data: template },
                })
              )
            )
          )
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly update$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportManagerTemplateDataActions.update),
      switchMap(
        ({
          template,
        }: ReturnType<typeof ReportManagerTemplateDataActions.update>) =>
          this.reportManagerService.updateTemplate$(template).pipe(
            map((updatedTemplate: TemplateDto) =>
              ReportManagerTemplateDataActions.updateSuccess({
                template: updatedTemplate,
              })
            ),
            catchError((error: unknown) =>
              of(
                ReportManagerTemplateDataActions.updateFailure({
                  error: { error, data: template },
                })
              )
            )
          )
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly delete$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportManagerTemplateDataActions.delete),
      exhaustMap(
        ({
          template,
        }: ReturnType<typeof ReportManagerTemplateDataActions.delete>) =>
          this.reportManagerService.deleteTemplate$(template.id).pipe(
            map(() =>
              ReportManagerTemplateDataActions.deleteSuccess({
                template,
              })
            ),
            catchError((error: unknown) =>
              of(
                ReportManagerTemplateDataActions.deleteFailure({
                  error: { error, data: template },
                })
              )
            )
          )
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly export$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportManagerTemplateDataActions.export),
      switchMap(
        ({
          template,
        }: ReturnType<typeof ReportManagerTemplateDataActions.export>) =>
          this.reportManagerService.fetchTemplate$(template.id).pipe(
            map(() =>
              ReportManagerTemplateDataActions.exportSuccess({
                template,
              })
            ),
            catchError((error: unknown) =>
              of(
                ReportManagerTemplateDataActions.exportFailure({
                  error: { error, data: template },
                })
              )
            )
          )
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly import$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportManagerTemplateDataActions.import),
      exhaustMap(
        ({
          template,
        }: ReturnType<typeof ReportManagerTemplateDataActions.import>) =>
          this.reportManagerService.importTemplate$(template).pipe(
            map((importedTemplate: TemplateDto) =>
              ReportManagerTemplateDataActions.importSuccess({
                template: importedTemplate,
              })
            ),
            catchError((error: unknown) =>
              of(
                ReportManagerTemplateDataActions.importFailure({
                  error: { error, data: template },
                })
              )
            )
          )
      )
    );
  });
}
