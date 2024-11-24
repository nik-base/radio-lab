import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mergeMap } from 'rxjs';

import { TemplateActions } from '../../domain/actions/template.actions';
import { ReportManagerUIActions } from '../actions/report-manager-ui.actions';
import { TemplateUIActions } from '../actions/template-ui.actions';

@Injectable()
export class ReportManagerUIEffects {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  private readonly actions$: Actions = inject(Actions);

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly load$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportManagerUIActions.load),
      // eslint-disable-next-line @ngrx/no-multiple-actions-in-effects
      mergeMap(() => [TemplateUIActions.fetch(), TemplateActions.reset()])
    );
  });
}
