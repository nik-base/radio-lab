import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, switchMap } from 'rxjs';

import { TemplateDto } from '@app/models/data';
import { ReportManagerService } from '@app/services/report-manager/report-manager.service';

import { TemplateDataActions } from '../actions/template-data.actions';

@Injectable()
export class TemplateDataEffects {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  private readonly actions$: Actions = inject(Actions);

  private readonly reportManagerService: ReportManagerService =
    inject(ReportManagerService);

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly fetch$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TemplateDataActions.fetch),
      switchMap(() =>
        this.reportManagerService.fetchTemplates$().pipe(
          map((templates: TemplateDto[]) =>
            TemplateDataActions.fetchSuccess({ templates })
          ),
          catchError((error: unknown) =>
            of(
              TemplateDataActions.fetchFailure({
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
      ofType(TemplateDataActions.create),
      exhaustMap(
        ({ template }: ReturnType<typeof TemplateDataActions.create>) =>
          this.reportManagerService.createTemplate$(template).pipe(
            map((createdTemplate: TemplateDto) =>
              TemplateDataActions.createSuccess({
                template: createdTemplate,
              })
            ),
            catchError((error: unknown) =>
              of(
                TemplateDataActions.createFailure({
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
      ofType(TemplateDataActions.update),
      switchMap(({ template }: ReturnType<typeof TemplateDataActions.update>) =>
        this.reportManagerService.updateTemplate$(template).pipe(
          map((updatedTemplate: TemplateDto) =>
            TemplateDataActions.updateSuccess({
              template: updatedTemplate,
            })
          ),
          catchError((error: unknown) =>
            of(
              TemplateDataActions.updateFailure({
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
      ofType(TemplateDataActions.delete),
      exhaustMap(
        ({ template }: ReturnType<typeof TemplateDataActions.delete>) =>
          this.reportManagerService.deleteTemplate$(template.id).pipe(
            map(() =>
              TemplateDataActions.deleteSuccess({
                template,
              })
            ),
            catchError((error: unknown) =>
              of(
                TemplateDataActions.deleteFailure({
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
      ofType(TemplateDataActions.export),
      switchMap(({ template }: ReturnType<typeof TemplateDataActions.export>) =>
        this.reportManagerService.fetchTemplate$(template.id).pipe(
          map(() =>
            TemplateDataActions.exportSuccess({
              template,
            })
          ),
          catchError((error: unknown) =>
            of(
              TemplateDataActions.exportFailure({
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
      ofType(TemplateDataActions.import),
      exhaustMap(
        ({ template }: ReturnType<typeof TemplateDataActions.import>) =>
          this.reportManagerService.importTemplate$(template).pipe(
            map((importedTemplate: TemplateDto) =>
              TemplateDataActions.importSuccess({
                template: importedTemplate,
              })
            ),
            catchError((error: unknown) =>
              of(
                TemplateDataActions.importFailure({
                  error: { error, data: template },
                })
              )
            )
          )
      )
    );
  });
}
