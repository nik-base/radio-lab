import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs';

import { APP_NOTIFICATION_TYPE } from '@app/constants';
import { ApplicationUIActions } from '@app/store/actions/application-ui.actions';

import { FindingActions } from '../../domain/actions/finding.actions';
import { FindingUIActions } from '../actions/finding-ui.actions';

@Injectable()
export class FindingUIEffects {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  private readonly actions$: Actions = inject(Actions);

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly fetch$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FindingUIActions.fetch),
      map(({ scopeId }: ReturnType<typeof FindingUIActions.fetch>) =>
        FindingActions.fetch({ scopeId })
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly create$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FindingUIActions.create),
      map(({ finding }: ReturnType<typeof FindingUIActions.create>) =>
        FindingActions.create({
          finding,
        })
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly update$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FindingUIActions.update),
      map(({ finding }: ReturnType<typeof FindingUIActions.update>) =>
        FindingActions.update({
          finding,
        })
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly delete$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FindingUIActions.delete),
      map(({ finding }: ReturnType<typeof FindingUIActions.delete>) =>
        FindingActions.delete({
          finding,
        })
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly reorder$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FindingUIActions.reorder),
      map(({ sortOrders }: ReturnType<typeof FindingUIActions.reorder>) =>
        FindingActions.reorder({
          sortOrders,
        })
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly clone$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FindingUIActions.clone),
      map(({ finding }: ReturnType<typeof FindingUIActions.clone>) =>
        FindingActions.clone({
          finding,
        })
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly reset$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FindingUIActions.reset),
      map(() => FindingActions.reset())
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly failure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        FindingActions.fetchFailure,
        FindingActions.createFailure,
        FindingActions.updateFailure,
        FindingActions.deleteFailure,
        FindingActions.cloneFailure,
        FindingActions.reorderFailure
      ),
      map(
        ({
          error,
        }:
          | ReturnType<typeof FindingActions.fetchFailure>
          | ReturnType<typeof FindingActions.createFailure>
          | ReturnType<typeof FindingActions.updateFailure>
          | ReturnType<typeof FindingActions.deleteFailure>
          | ReturnType<typeof FindingActions.cloneFailure>
          | ReturnType<typeof FindingActions.reorderFailure>) =>
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

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly success$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        FindingActions.createSuccess,
        FindingActions.updateSuccess,
        FindingActions.deleteSuccess,
        FindingActions.cloneSuccess
      ),
      map(
        (
          action:
            | ReturnType<typeof FindingActions.createSuccess>
            | ReturnType<typeof FindingActions.updateSuccess>
            | ReturnType<typeof FindingActions.deleteSuccess>
            | ReturnType<typeof FindingActions.cloneSuccess>
        ) =>
          ApplicationUIActions.notify({
            notification: {
              title: 'Success',
              message: `Finding '${action.finding.name}' ${this.getActionType(action)} successfully`,
              type: APP_NOTIFICATION_TYPE.Success,
            },
          })
      )
    );
  });

  private getActionType(
    action:
      | ReturnType<typeof FindingActions.createSuccess>
      | ReturnType<typeof FindingActions.updateSuccess>
      | ReturnType<typeof FindingActions.deleteSuccess>
      | ReturnType<typeof FindingActions.cloneSuccess>
  ): string {
    switch (action.type) {
      case FindingActions.createSuccess.type:
        return 'created';
      case FindingActions.updateSuccess.type:
        return 'updated';
      case FindingActions.deleteSuccess.type:
        return 'deleted';
      case FindingActions.cloneSuccess.type:
        return 'cloned';
    }
  }
}
