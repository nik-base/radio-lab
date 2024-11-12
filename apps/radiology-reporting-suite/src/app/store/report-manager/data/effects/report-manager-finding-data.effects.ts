import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, switchMap } from 'rxjs';

import { FindingDto } from '@app/models/data';
import { ReportManagerService } from 'app/services/report-manager/report-manager.service';
import { ReportManagerFindingDataActions } from '../actions/report-manager-finding-data.actions';

@Injectable()
export class ReportManagerFindingDataEffects {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  private readonly actions$: Actions = inject(Actions);

  private readonly reportManagerService: ReportManagerService =
    inject(ReportManagerService);

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly fetch$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportManagerFindingDataActions.fetch),
      exhaustMap(
        ({
          scopeId,
        }: ReturnType<typeof ReportManagerFindingDataActions.fetch>) =>
          this.reportManagerService.fetchFindings$(scopeId).pipe(
            map((findings: FindingDto[]) =>
              ReportManagerFindingDataActions.fetchSuccess({ findings })
            ),
            catchError((error: unknown) =>
              of(
                ReportManagerFindingDataActions.fetchFailure({
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
      ofType(ReportManagerFindingDataActions.create),
      exhaustMap(
        ({
          finding,
        }: ReturnType<typeof ReportManagerFindingDataActions.create>) =>
          this.reportManagerService.createFinding$(finding).pipe(
            map((createdFinding: FindingDto) =>
              ReportManagerFindingDataActions.createSuccess({
                finding: createdFinding,
              })
            ),
            catchError((error: unknown) =>
              of(
                ReportManagerFindingDataActions.createFailure({
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
      ofType(ReportManagerFindingDataActions.update),
      switchMap(
        ({
          finding,
        }: ReturnType<typeof ReportManagerFindingDataActions.update>) =>
          this.reportManagerService.updateFinding$(finding).pipe(
            map((updatedFinding: FindingDto) =>
              ReportManagerFindingDataActions.updateSuccess({
                finding: updatedFinding,
              })
            ),
            catchError((error: unknown) =>
              of(
                ReportManagerFindingDataActions.updateFailure({
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
      ofType(ReportManagerFindingDataActions.delete),
      exhaustMap(
        ({
          finding,
        }: ReturnType<typeof ReportManagerFindingDataActions.delete>) =>
          this.reportManagerService.deleteFinding$(finding.id).pipe(
            map(() =>
              ReportManagerFindingDataActions.deleteSuccess({
                finding,
              })
            ),
            catchError((error: unknown) =>
              of(
                ReportManagerFindingDataActions.deleteFailure({
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
      ofType(ReportManagerFindingDataActions.reorder),
      exhaustMap(
        ({
          sortOrders,
        }: ReturnType<typeof ReportManagerFindingDataActions.reorder>) =>
          this.reportManagerService.reorderFindings$(sortOrders).pipe(
            map(() => ReportManagerFindingDataActions.reorderSuccess()),
            catchError((error: unknown) =>
              of(
                ReportManagerFindingDataActions.reorderFailure({
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
      ofType(ReportManagerFindingDataActions.clone),
      exhaustMap(
        ({
          finding,
        }: ReturnType<typeof ReportManagerFindingDataActions.clone>) =>
          this.reportManagerService.cloneFinding$(finding.id).pipe(
            map((importedFinding: FindingDto) =>
              ReportManagerFindingDataActions.cloneSuccess({
                finding: importedFinding,
              })
            ),
            catchError((error: unknown) =>
              of(
                ReportManagerFindingDataActions.cloneFailure({
                  error: { error, data: finding },
                })
              )
            )
          )
      )
    );
  });
}
