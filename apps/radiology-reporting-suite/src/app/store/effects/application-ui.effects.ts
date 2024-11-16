import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MessageService } from 'primeng/api';
import { filter, tap } from 'rxjs';

import { APP_NOTIFICATION_TYPE } from '@app/constants';

import { ApplicationUIActions } from '../actions/application-ui.actions';

@Injectable()
export class ApplicationUIEffects {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  private readonly actions$: Actions = inject(Actions);

  private readonly uiMessageService: MessageService = inject(MessageService);

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
            this.uiMessageService.add({
              severity: 'error',
              summary: notification.title,
              detail: notification.message,
              life: 3000,
            })
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
            this.uiMessageService.add({
              severity: 'success',
              summary: notification.title,
              detail: notification.message,
              life: 3000,
            })
        )
      );
    },
    { dispatch: false }
  );
}
