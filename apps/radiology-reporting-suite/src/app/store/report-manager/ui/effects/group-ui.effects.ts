import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap } from 'rxjs';

import { APP_NOTIFICATION_TYPE } from '@app/constants';
import { ApplicationUIActions } from '@app/store/actions/application-ui.actions';

import { GroupActions } from '../../domain/actions/group.actions';
import { ClassifierUIActions } from '../actions/classifier-ui.actions';
import { GroupUIActions } from '../actions/group-ui.actions';

@Injectable()
export class GroupUIEffects {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  private readonly actions$: Actions = inject(Actions);

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly fetch$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GroupUIActions.fetch),
      map(({ scopeId }: ReturnType<typeof GroupUIActions.fetch>) =>
        GroupActions.fetch({ scopeId })
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly create$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GroupUIActions.create),
      map(({ group }: ReturnType<typeof GroupUIActions.create>) =>
        GroupActions.create({
          group,
        })
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly update$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GroupUIActions.update),
      map(({ group }: ReturnType<typeof GroupUIActions.update>) =>
        GroupActions.update({
          group,
        })
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly delete$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GroupUIActions.delete),
      map(({ group }: ReturnType<typeof GroupUIActions.delete>) =>
        GroupActions.delete({
          group,
        })
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly reorder$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GroupUIActions.reorder),
      map(({ sortOrders }: ReturnType<typeof GroupUIActions.reorder>) =>
        GroupActions.reorder({
          sortOrders,
        })
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly change$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GroupUIActions.change),
      // eslint-disable-next-line @ngrx/no-multiple-actions-in-effects
      mergeMap(({ group }: ReturnType<typeof GroupUIActions.change>) => [
        GroupActions.setSelected({ group }),
        ClassifierUIActions.reset(),
        ClassifierUIActions.fetch({
          scopeId: group.scopeId,
          groupId: group.id,
        }),
      ])
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly reset$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GroupUIActions.reset),
      map(() => GroupActions.reset())
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly failure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        GroupActions.fetchFailure,
        GroupActions.createFailure,
        GroupActions.updateFailure,
        GroupActions.deleteFailure,
        GroupActions.reorderFailure
      ),
      map(
        ({
          error,
        }:
          | ReturnType<typeof GroupActions.fetchFailure>
          | ReturnType<typeof GroupActions.createFailure>
          | ReturnType<typeof GroupActions.updateFailure>
          | ReturnType<typeof GroupActions.deleteFailure>
          | ReturnType<typeof GroupActions.reorderFailure>) =>
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
        GroupActions.createSuccess,
        GroupActions.updateSuccess,
        GroupActions.deleteSuccess
      ),
      map(
        (
          action:
            | ReturnType<typeof GroupActions.createSuccess>
            | ReturnType<typeof GroupActions.updateSuccess>
            | ReturnType<typeof GroupActions.deleteSuccess>
        ) =>
          ApplicationUIActions.notify({
            notification: {
              title: 'Success',
              message: `FindingGroup '${action.group.name}' ${this.getActionType(action)} successfully`,
              type: APP_NOTIFICATION_TYPE.Success,
            },
          })
      )
    );
  });

  private getActionType(
    action:
      | ReturnType<typeof GroupActions.createSuccess>
      | ReturnType<typeof GroupActions.updateSuccess>
      | ReturnType<typeof GroupActions.deleteSuccess>
  ): string {
    switch (action.type) {
      case GroupActions.createSuccess.type:
        return 'created';
      case GroupActions.updateSuccess.type:
        return 'updated';
      case GroupActions.deleteSuccess.type:
        return 'deleted';
    }
  }
}
