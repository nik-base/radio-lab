import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, switchMap } from 'rxjs';

import { FindingDto } from '@app/models/data';
import { ReportManagerService } from '@app/services/report-manager/report-manager.service';

import { FindingDataActions } from '../actions/finding-data.actions';

@Injectable()
export class FindingDataEffects {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  private readonly actions$: Actions = inject(Actions);

  private readonly reportManagerService: ReportManagerService =
    inject(ReportManagerService);

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly fetch$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FindingDataActions.fetch),
      switchMap(({ scopeId }: ReturnType<typeof FindingDataActions.fetch>) =>
        this.reportManagerService.fetchFindings$(scopeId).pipe(
          map((findings: FindingDto[]) =>
            FindingDataActions.fetchSuccess({ findings })
          ),
          catchError((error: unknown) =>
            of(
              FindingDataActions.fetchFailure({
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
      ofType(FindingDataActions.create),
      exhaustMap(({ finding }: ReturnType<typeof FindingDataActions.create>) =>
        this.reportManagerService.createFinding$(finding).pipe(
          map((createdFinding: FindingDto) =>
            FindingDataActions.createSuccess({
              finding: createdFinding,
            })
          ),
          catchError((error: unknown) =>
            of(
              FindingDataActions.createFailure({
                error: { error, data: finding },
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
      ofType(FindingDataActions.update),
      switchMap(({ finding }: ReturnType<typeof FindingDataActions.update>) =>
        this.reportManagerService.updateFinding$(finding).pipe(
          map((updatedFinding: FindingDto) =>
            FindingDataActions.updateSuccess({
              finding: updatedFinding,
            })
          ),
          catchError((error: unknown) =>
            of(
              FindingDataActions.updateFailure({
                error: { error, data: finding },
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
      ofType(FindingDataActions.delete),
      exhaustMap(({ finding }: ReturnType<typeof FindingDataActions.delete>) =>
        this.reportManagerService.deleteFinding$(finding.id).pipe(
          map(() =>
            FindingDataActions.deleteSuccess({
              finding,
            })
          ),
          catchError((error: unknown) =>
            of(
              FindingDataActions.deleteFailure({
                error: { error, data: finding },
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
      ofType(FindingDataActions.reorder),
      switchMap(
        ({ sortOrders }: ReturnType<typeof FindingDataActions.reorder>) =>
          this.reportManagerService.reorderFindings$(sortOrders).pipe(
            map(() => FindingDataActions.reorderSuccess({ sortOrders })),
            catchError((error: unknown) =>
              of(
                FindingDataActions.reorderFailure({
                  error: { error },
                })
              )
            )
          )
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly clone$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FindingDataActions.clone),
      switchMap(({ finding }: ReturnType<typeof FindingDataActions.clone>) =>
        this.reportManagerService.cloneFinding$(finding.id).pipe(
          map((importedFinding: FindingDto) =>
            FindingDataActions.cloneSuccess({
              finding: importedFinding,
            })
          ),
          catchError((error: unknown) =>
            of(
              FindingDataActions.cloneFailure({
                error: { error, data: finding },
              })
            )
          )
        )
      )
    );
  });
}
