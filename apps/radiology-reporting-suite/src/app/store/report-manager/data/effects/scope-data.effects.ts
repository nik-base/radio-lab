import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, switchMap } from 'rxjs';

import { ScopeDto } from '@app/models/data';
import { ReportManagerService } from '@app/services/report-manager/report-manager.service';

import { ScopeDataActions } from '../actions/scope-data.actions';

@Injectable()
export class ScopeDataEffects {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  private readonly actions$: Actions = inject(Actions);

  private readonly reportManagerService: ReportManagerService =
    inject(ReportManagerService);

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly fetch$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ScopeDataActions.fetch),
      switchMap(({ templateId }: ReturnType<typeof ScopeDataActions.fetch>) =>
        this.reportManagerService.fetchScopes$(templateId).pipe(
          map((scopes: ScopeDto[]) =>
            ScopeDataActions.fetchSuccess({ scopes })
          ),
          catchError((error: unknown) =>
            of(
              ScopeDataActions.fetchFailure({
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
      ofType(ScopeDataActions.create),
      exhaustMap(({ scope }: ReturnType<typeof ScopeDataActions.create>) =>
        this.reportManagerService.createScope$(scope).pipe(
          map((createdScope: ScopeDto) =>
            ScopeDataActions.createSuccess({
              scope: createdScope,
            })
          ),
          catchError((error: unknown) =>
            of(
              ScopeDataActions.createFailure({
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
      ofType(ScopeDataActions.update),
      switchMap(({ scope }: ReturnType<typeof ScopeDataActions.update>) =>
        this.reportManagerService.updateScope$(scope).pipe(
          map((updatedScope: ScopeDto) =>
            ScopeDataActions.updateSuccess({
              scope: updatedScope,
            })
          ),
          catchError((error: unknown) =>
            of(
              ScopeDataActions.updateFailure({
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
      ofType(ScopeDataActions.delete),
      exhaustMap(({ scope }: ReturnType<typeof ScopeDataActions.delete>) =>
        this.reportManagerService.deleteScope$(scope.id).pipe(
          map(() =>
            ScopeDataActions.deleteSuccess({
              scope,
            })
          ),
          catchError((error: unknown) =>
            of(
              ScopeDataActions.deleteFailure({
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
      ofType(ScopeDataActions.reorder),
      switchMap(({ sortOrders }: ReturnType<typeof ScopeDataActions.reorder>) =>
        this.reportManagerService.reorderScopes$(sortOrders).pipe(
          map(() => ScopeDataActions.reorderSuccess({ sortOrders })),
          catchError((error: unknown) =>
            of(
              ScopeDataActions.reorderFailure({
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
      ofType(ScopeDataActions.clone),
      exhaustMap(
        ({ scope, templateId }: ReturnType<typeof ScopeDataActions.clone>) =>
          this.reportManagerService.cloneScope$(scope.id, templateId).pipe(
            map((importedScope: ScopeDto) =>
              ScopeDataActions.cloneSuccess({
                scope: importedScope,
                templateId,
              })
            ),
            catchError((error: unknown) =>
              of(
                ScopeDataActions.cloneFailure({
                  error: { error, data: scope },
                })
              )
            )
          )
      )
    );
  });
}
