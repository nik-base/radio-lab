import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs';

import { LoggerService } from '@app/utils/services/logger.service';

import { ApplicationActions } from '../actions/application.actions';

@Injectable()
export class ApplicationEffects {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  private readonly actions$: Actions = inject(Actions);

  private readonly logger: LoggerService = inject(LoggerService);

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly logError$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(ApplicationActions.error),
        tap(({ error }: ReturnType<typeof ApplicationActions.error>) =>
          this.logger.error(`[Error] ${error.message}`, error.error, error.data)
        )
      );
    },
    { dispatch: false }
  );
}
