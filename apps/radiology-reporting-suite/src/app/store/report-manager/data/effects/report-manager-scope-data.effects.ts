import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, switchMap } from 'rxjs';

import { ScopeDto } from '@app/models/data';
import { ReportManagerService } from '@app/services/report-manager/report-manager.service';

import { ReportManagerScopeDataActions } from '../actions/report-manager-scope-data.actions';

@Injectable()
export class ReportManagerScopeDataEffects {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  private readonly actions$: Actions = inject(Actions);

  private readonly reportManagerService: ReportManagerService =
    inject(ReportManagerService);

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly fetch$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportManagerScopeDataActions.fetch),
      exhaustMap(
        ({
          templateId,
        }: ReturnType<typeof ReportManagerScopeDataActions.fetch>) =>
          this.reportManagerService.fetchScopes$(templateId).pipe(
            map((scopes: ScopeDto[]) =>
              ReportManagerScopeDataActions.fetchSuccess({ scopes })
            ),
            catchError((error: unknown) =>
              of(
                ReportManagerScopeDataActions.fetchFailure({
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
      ofType(ReportManagerScopeDataActions.create),
      exhaustMap(
        ({ scope }: ReturnType<typeof ReportManagerScopeDataActions.create>) =>
          this.reportManagerService.createScope$(scope).pipe(
            map((createdScope: ScopeDto) =>
              ReportManagerScopeDataActions.createSuccess({
                scope: createdScope,
              })
            ),
            catchError((error: unknown) =>
              of(
                ReportManagerScopeDataActions.createFailure({
                  error: { error, data: scope },
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
      ofType(ReportManagerScopeDataActions.update),
      switchMap(
        ({ scope }: ReturnType<typeof ReportManagerScopeDataActions.update>) =>
          this.reportManagerService.updateScope$(scope).pipe(
            map((updatedScope: ScopeDto) =>
              ReportManagerScopeDataActions.updateSuccess({
                scope: updatedScope,
              })
            ),
            catchError((error: unknown) =>
              of(
                ReportManagerScopeDataActions.updateFailure({
                  error: { error, data: scope },
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
      ofType(ReportManagerScopeDataActions.delete),
      exhaustMap(
        ({ scope }: ReturnType<typeof ReportManagerScopeDataActions.delete>) =>
          this.reportManagerService.deleteScope$(scope.id).pipe(
            map(() =>
              ReportManagerScopeDataActions.deleteSuccess({
                scope,
              })
            ),
            catchError((error: unknown) =>
              of(
                ReportManagerScopeDataActions.deleteFailure({
                  error: { error, data: scope },
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
      ofType(ReportManagerScopeDataActions.reorder),
      exhaustMap(
        ({
          sortOrders,
        }: ReturnType<typeof ReportManagerScopeDataActions.reorder>) =>
          this.reportManagerService.reorderScopes$(sortOrders).pipe(
            map(() => ReportManagerScopeDataActions.reorderSuccess()),
            catchError((error: unknown) =>
              of(
                ReportManagerScopeDataActions.reorderFailure({
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
      ofType(ReportManagerScopeDataActions.clone),
      exhaustMap(
        ({
          scope,
          templateId,
        }: ReturnType<typeof ReportManagerScopeDataActions.clone>) =>
          this.reportManagerService.cloneScope$(scope.id, templateId).pipe(
            map((importedScope: ScopeDto) =>
              ReportManagerScopeDataActions.cloneSuccess({
                scope: importedScope,
              })
            ),
            catchError((error: unknown) =>
              of(
                ReportManagerScopeDataActions.cloneFailure({
                  error: { error, data: scope },
                })
              )
            )
          )
      )
    );
  });
}
