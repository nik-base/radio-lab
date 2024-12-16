import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap } from 'rxjs';

import { APP_NOTIFICATION_TYPE } from '@app/constants';
import { ApplicationUIActions } from '@app/store/actions/application-ui.actions';

import { ReportBuilderActions } from '../domain/report-builder.actions';

import { ReportBuilderUIActions } from './report-builder-ui.actions';

@Injectable()
export class ReportBuilderUIEffects {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  private readonly actions$: Actions = inject(Actions);

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly load$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportBuilderUIActions.load),
      // eslint-disable-next-line @ngrx/no-multiple-actions-in-effects
      mergeMap(() => [
        ReportBuilderUIActions.resetTemplateData(),
        ReportBuilderUIActions.fetchTemplates(),
      ])
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly fetchTemplates$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportBuilderUIActions.fetchTemplates),
      map(() => ReportBuilderActions.fetchTemplates())
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly fetchTemplateData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportBuilderUIActions.fetchTemplateData),
      map(
        ({
          templateId,
        }: ReturnType<typeof ReportBuilderUIActions.fetchTemplateData>) =>
          ReportBuilderActions.fetchTemplateData({ templateId })
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly fetchScopeOnFetchTemplateData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportBuilderUIActions.fetchTemplateData),
      map(() => ReportBuilderActions.resetScope())
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly setScope$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportBuilderUIActions.setScope),
      map(({ scope }: ReturnType<typeof ReportBuilderUIActions.setScope>) =>
        ReportBuilderActions.setScope({ scope })
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly resetScope$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportBuilderUIActions.resetScope),
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
          ApplicationUIActions.notify({
            notification: {
              title: 'Error',
              message: error.message,
              type: APP_NOTIFICATION_TYPE.Error,
            },
          })
      )
    );
  });
}
