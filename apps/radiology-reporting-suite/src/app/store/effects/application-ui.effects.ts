import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { filter, tap } from 'rxjs';

import { APP_NOTIFICATION_TYPE } from '@app/constants';

import { ApplicationUIActions } from '../actions/application-ui.actions';

@Injectable()
export class ApplicationUIEffects {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  private readonly actions$: Actions = inject(Actions);

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly notifyError$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(ApplicationUIActions.notify),
        filter(
          ({ notification }: ReturnType<typeof ApplicationUIActions.notify>) =>
            notification.type === APP_NOTIFICATION_TYPE.Error
        ),
        tap(
          ({ notification }: ReturnType<typeof ApplicationUIActions.notify>) =>
            console.log(notification)
        )
      );
    },
    { dispatch: false }
  );

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly notifySuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(ApplicationUIActions.notify),
        filter(
          ({ notification }: ReturnType<typeof ApplicationUIActions.notify>) =>
            notification.type === APP_NOTIFICATION_TYPE.Success
        ),
        tap(
          ({ notification }: ReturnType<typeof ApplicationUIActions.notify>) =>
            console.log(notification)
        )
      );
    },
    { dispatch: false }
  );
}
