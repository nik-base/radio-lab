import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap } from 'rxjs';

import { APP_NOTIFICATION_TYPE } from '@app/constants';
import { ApplicationUIActions } from '@app/store/actions/application-ui.actions';

import { ClassifierActions } from '../../domain/actions/classifier.actions';
import { ClassifierUIActions } from '../actions/classifier-ui.actions';
import { FindingUIActions } from '../actions/finding-ui.actions';

@Injectable()
export class ClassifierUIEffects {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  private readonly actions$: Actions = inject(Actions);

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly fetch$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ClassifierUIActions.fetch),
      map(
        ({ scopeId, groupId }: ReturnType<typeof ClassifierUIActions.fetch>) =>
          ClassifierActions.fetch({ scopeId, groupId })
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly create$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ClassifierUIActions.create),
      map(({ classifier }: ReturnType<typeof ClassifierUIActions.create>) =>
        ClassifierActions.create({
          classifier,
        })
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly update$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ClassifierUIActions.update),
      map(({ classifier }: ReturnType<typeof ClassifierUIActions.update>) =>
        ClassifierActions.update({
          classifier,
        })
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly delete$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ClassifierUIActions.delete),
      map(({ classifier }: ReturnType<typeof ClassifierUIActions.delete>) =>
        ClassifierActions.delete({
          classifier,
        })
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly reorder$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ClassifierUIActions.reorder),
      map(({ sortOrders }: ReturnType<typeof ClassifierUIActions.reorder>) =>
        ClassifierActions.reorder({
          sortOrders,
        })
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly change$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ClassifierUIActions.change),
      mergeMap(
        // eslint-disable-next-line @ngrx/no-multiple-actions-in-effects
        ({ classifier }: ReturnType<typeof ClassifierUIActions.change>) => [
          ClassifierActions.setSelected({ classifier }),
          FindingUIActions.reset(),
          FindingUIActions.fetch({
            scopeId: classifier.scopeId,
          }),
        ]
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly reset$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ClassifierUIActions.reset),
      map(() => ClassifierActions.reset())
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly failure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        ClassifierActions.fetchFailure,
        ClassifierActions.createFailure,
        ClassifierActions.updateFailure,
        ClassifierActions.deleteFailure,
        ClassifierActions.reorderFailure
      ),
      map(
        ({
          error,
        }:
          | ReturnType<typeof ClassifierActions.fetchFailure>
          | ReturnType<typeof ClassifierActions.createFailure>
          | ReturnType<typeof ClassifierActions.updateFailure>
          | ReturnType<typeof ClassifierActions.deleteFailure>
          | ReturnType<typeof ClassifierActions.reorderFailure>) =>
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
        ClassifierActions.createSuccess,
        ClassifierActions.updateSuccess,
        ClassifierActions.deleteSuccess
      ),
      map(
        (
          action:
            | ReturnType<typeof ClassifierActions.createSuccess>
            | ReturnType<typeof ClassifierActions.updateSuccess>
            | ReturnType<typeof ClassifierActions.deleteSuccess>
        ) =>
          ApplicationUIActions.notify({
            notification: {
              title: 'Success',
              message: `FindingClassifier '${action.classifier.name}' ${this.getActionType(action)} successfully`,
              type: APP_NOTIFICATION_TYPE.Success,
            },
          })
      )
    );
  });

  private getActionType(
    action:
      | ReturnType<typeof ClassifierActions.createSuccess>
      | ReturnType<typeof ClassifierActions.updateSuccess>
      | ReturnType<typeof ClassifierActions.deleteSuccess>
  ): string {
    switch (action.type) {
      case ClassifierActions.createSuccess.type:
        return 'created';
      case ClassifierActions.updateSuccess.type:
        return 'updated';
      case ClassifierActions.deleteSuccess.type:
        return 'deleted';
    }
  }
}
