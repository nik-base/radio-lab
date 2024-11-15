import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs';

import { APP_NOTIFICATION_TYPE } from '@app/constants';
import { ApplicationUIActions } from '@app/store/actions/application-ui.actions';

import { ScopeActions } from '../../domain/actions/scope.actions';
import { ScopeUIActions } from '../actions/scope-ui.actions';

@Injectable()
export class ScopeUIEffects {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  private readonly actions$: Actions = inject(Actions);

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly fetch$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ScopeUIActions.fetch),
      map(({ templateId }: ReturnType<typeof ScopeUIActions.fetch>) =>
        ScopeActions.fetch({ templateId })
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly create$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ScopeUIActions.create),
      map(({ scope }: ReturnType<typeof ScopeUIActions.create>) =>
        ScopeActions.create({
          scope,
        })
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly update$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ScopeUIActions.update),
      map(({ scope }: ReturnType<typeof ScopeUIActions.update>) =>
        ScopeActions.update({
          scope,
        })
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly delete$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ScopeUIActions.delete),
      map(({ scope }: ReturnType<typeof ScopeUIActions.delete>) =>
        ScopeActions.delete({
          scope,
        })
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly reorder$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ScopeUIActions.reorder),
      map(({ sortOrders }: ReturnType<typeof ScopeUIActions.reorder>) =>
        ScopeActions.reorder({
          sortOrders,
        })
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly clone$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ScopeUIActions.clone),
      map(({ scope, templateId }: ReturnType<typeof ScopeUIActions.clone>) =>
        ScopeActions.clone({
          scope,
          templateId,
        })
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly reset$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ScopeUIActions.reset),
      map(() => ScopeActions.reset())
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly failure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        ScopeActions.fetchFailure,
        ScopeActions.createFailure,
        ScopeActions.updateFailure,
        ScopeActions.deleteFailure,
        ScopeActions.cloneFailure,
        ScopeActions.reorderFailure
      ),
      map(
        ({
          error,
        }:
          | ReturnType<typeof ScopeActions.fetchFailure>
          | ReturnType<typeof ScopeActions.createFailure>
          | ReturnType<typeof ScopeActions.updateFailure>
          | ReturnType<typeof ScopeActions.deleteFailure>
          | ReturnType<typeof ScopeActions.cloneFailure>
          | ReturnType<typeof ScopeActions.reorderFailure>) =>
          ApplicationUIActions.notify({
            notification: {
              title: 'Failed',
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
        ScopeActions.createSuccess,
        ScopeActions.updateSuccess,
        ScopeActions.deleteSuccess,
        ScopeActions.cloneSuccess
      ),
      map(
        (
          action:
            | ReturnType<typeof ScopeActions.createSuccess>
            | ReturnType<typeof ScopeActions.updateSuccess>
            | ReturnType<typeof ScopeActions.deleteSuccess>
            | ReturnType<typeof ScopeActions.cloneSuccess>
        ) =>
          ApplicationUIActions.notify({
            notification: {
              title: 'Success',
              message: `Scope '${action.scope.name}' ${this.getActionType(action)} successfully`,
              type: APP_NOTIFICATION_TYPE.Success,
            },
          })
      )
    );
  });

  private getActionType(
    action:
      | ReturnType<typeof ScopeActions.createSuccess>
      | ReturnType<typeof ScopeActions.updateSuccess>
      | ReturnType<typeof ScopeActions.deleteSuccess>
      | ReturnType<typeof ScopeActions.cloneSuccess>
  ): string {
    switch (action.type) {
      case ScopeActions.createSuccess.type:
        return 'created';
      case ScopeActions.updateSuccess.type:
        return 'updated';
      case ScopeActions.deleteSuccess.type:
        return 'deleted';
      case ScopeActions.cloneSuccess.type:
        return 'cloned';
    }
  }
}
