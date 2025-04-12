import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, switchMap } from 'rxjs';

import { FindingGroupDto } from '@app/models/data';
import { ReportManagerService } from '@app/services/report-manager/report-manager.service';

import { GroupDataActions } from '../actions/group-data.actions';

@Injectable()
export class GroupDataEffects {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  private readonly actions$: Actions = inject(Actions);

  private readonly reportManagerService: ReportManagerService =
    inject(ReportManagerService);

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly fetch$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GroupDataActions.fetch),
      switchMap(({ scopeId }: ReturnType<typeof GroupDataActions.fetch>) =>
        this.reportManagerService.fetchFindingGroups$(scopeId).pipe(
          map((groups: FindingGroupDto[]) =>
            GroupDataActions.fetchSuccess({ groups })
          ),
          catchError((error: unknown) =>
            of(
              GroupDataActions.fetchFailure({
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
      ofType(GroupDataActions.create),
      exhaustMap(({ group }: ReturnType<typeof GroupDataActions.create>) =>
        this.reportManagerService.createFindingGroup$(group).pipe(
          map((createdGroup: FindingGroupDto) =>
            GroupDataActions.createSuccess({
              group: createdGroup,
            })
          ),
          catchError((error: unknown) =>
            of(
              GroupDataActions.createFailure({
                error: { error, data: group },
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
      ofType(GroupDataActions.update),
      switchMap(({ group }: ReturnType<typeof GroupDataActions.update>) =>
        this.reportManagerService.updateFindingGroup$(group).pipe(
          map((updatedGroup: FindingGroupDto) =>
            GroupDataActions.updateSuccess({
              group: updatedGroup,
            })
          ),
          catchError((error: unknown) =>
            of(
              GroupDataActions.updateFailure({
                error: { error, data: group },
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
      ofType(GroupDataActions.delete),
      exhaustMap(({ group }: ReturnType<typeof GroupDataActions.delete>) =>
        this.reportManagerService.deleteFindingGroup$(group.id).pipe(
          map(() =>
            GroupDataActions.deleteSuccess({
              group,
            })
          ),
          catchError((error: unknown) =>
            of(
              GroupDataActions.deleteFailure({
                error: { error, data: group },
              })
            )
          )
        )
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly reorder$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GroupDataActions.reorder),
      switchMap(({ sortOrders }: ReturnType<typeof GroupDataActions.reorder>) =>
        this.reportManagerService.reorderFindingGroups$(sortOrders).pipe(
          map(() => GroupDataActions.reorderSuccess({ sortOrders })),
          catchError((error: unknown) =>
            of(
              GroupDataActions.reorderFailure({
                error: { error },
              })
            )
          )
        )
      )
    );
  });
}
