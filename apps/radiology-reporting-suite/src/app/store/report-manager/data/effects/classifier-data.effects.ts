import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, switchMap } from 'rxjs';

import { FindingClassifierDto } from '@app/models/data';
import { ReportManagerService } from '@app/services/report-manager/report-manager.service';

import { ClassifierDataActions } from '../actions/classifier-data.actions';

@Injectable()
export class ClassifierDataEffects {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  private readonly actions$: Actions = inject(Actions);

  private readonly reportManagerService: ReportManagerService =
    inject(ReportManagerService);

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly fetch$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ClassifierDataActions.fetch),
      switchMap(
        ({
          scopeId,
          groupId,
        }: ReturnType<typeof ClassifierDataActions.fetch>) =>
          this.reportManagerService
            .fetchFindingClassifiers$(scopeId, groupId)
            .pipe(
              map((classifiers: FindingClassifierDto[]) =>
                ClassifierDataActions.fetchSuccess({ classifiers })
              ),
              catchError((error: unknown) =>
                of(
                  ClassifierDataActions.fetchFailure({
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
      ofType(ClassifierDataActions.create),
      exhaustMap(
        ({ classifier }: ReturnType<typeof ClassifierDataActions.create>) =>
          this.reportManagerService.createFindingClassifier$(classifier).pipe(
            map((createdClassifier: FindingClassifierDto) =>
              ClassifierDataActions.createSuccess({
                classifier: createdClassifier,
              })
            ),
            catchError((error: unknown) =>
              of(
                ClassifierDataActions.createFailure({
                  error: { error, data: classifier },
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
      ofType(ClassifierDataActions.update),
      switchMap(
        ({ classifier }: ReturnType<typeof ClassifierDataActions.update>) =>
          this.reportManagerService.updateFindingClassifier$(classifier).pipe(
            map((updatedClassifier: FindingClassifierDto) =>
              ClassifierDataActions.updateSuccess({
                classifier: updatedClassifier,
              })
            ),
            catchError((error: unknown) =>
              of(
                ClassifierDataActions.updateFailure({
                  error: { error, data: classifier },
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
      ofType(ClassifierDataActions.delete),
      exhaustMap(
        ({ classifier }: ReturnType<typeof ClassifierDataActions.delete>) =>
          this.reportManagerService
            .deleteFindingClassifier$(classifier.id)
            .pipe(
              map(() =>
                ClassifierDataActions.deleteSuccess({
                  classifier,
                })
              ),
              catchError((error: unknown) =>
                of(
                  ClassifierDataActions.deleteFailure({
                    error: { error, data: classifier },
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
      ofType(ClassifierDataActions.reorder),
      switchMap(
        ({ sortOrders }: ReturnType<typeof ClassifierDataActions.reorder>) =>
          this.reportManagerService.reorderFindingClassifiers$(sortOrders).pipe(
            map(() => ClassifierDataActions.reorderSuccess({ sortOrders })),
            catchError((error: unknown) =>
              of(
                ClassifierDataActions.reorderFailure({
                  error: { error },
                })
              )
            )
          )
      )
    );
  });
}
