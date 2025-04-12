import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs';

import { ApplicationErrorMapperService } from '@app/mapper/application-error-mapper.service';
import { FindingClassifierMapperService } from '@app/mapper/finding-classifier-mapper.service';
import { SortOrderMapperService } from '@app/mapper/sort-order-mapper.service';
import {
  FindingClassifierCreateDto,
  FindingClassifierDto,
  FindingClassifierUpdateDto,
  SortOrderUpdateDto,
} from '@app/models/data';
import { FindingClassifier } from '@app/models/domain';
import { ApplicationActions } from '@app/store/actions/application.actions';

import { ClassifierDataActions } from '../../data/actions/classifier-data.actions';
import { ClassifierActions } from '../actions/classifier.actions';
import { FindingActions } from '../actions/finding.actions';

@Injectable()
export class ClassifierEffects {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  private readonly actions$: Actions = inject(Actions);

  private readonly classifierMapper: FindingClassifierMapperService = inject(
    FindingClassifierMapperService
  );

  private readonly sortOrderMapper: SortOrderMapperService = inject(
    SortOrderMapperService
  );

  private readonly errorMapper: ApplicationErrorMapperService = inject(
    ApplicationErrorMapperService
  );

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly fetch$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ClassifierActions.fetch),
      map(({ scopeId, groupId }: ReturnType<typeof ClassifierActions.fetch>) =>
        ClassifierDataActions.fetch({ scopeId, groupId })
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly fetchFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ClassifierDataActions.fetchFailure),
      map(
        ({ error }: ReturnType<typeof ClassifierDataActions.fetchFailure>) => {
          return ClassifierActions.fetchFailure({
            error: this.errorMapper.mapFromDto(
              error,
              'Failed to fetch classifiers'
            ),
          });
        }
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly fetchSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ClassifierDataActions.fetchSuccess),
      map(
        ({
          classifiers,
        }: ReturnType<typeof ClassifierDataActions.fetchSuccess>) => {
          return ClassifierActions.fetchSuccess({
            classifiers: classifiers.map(
              (classifier: FindingClassifierDto): FindingClassifier =>
                this.classifierMapper.mapFromDto(classifier)
            ),
          });
        }
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly create$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ClassifierActions.create),
      map(({ classifier }: ReturnType<typeof ClassifierActions.create>) => {
        const dto: FindingClassifierCreateDto =
          this.classifierMapper.mapToCreateDto(classifier);

        return ClassifierDataActions.create({
          classifier: dto,
        });
      })
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly createFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ClassifierDataActions.createFailure),
      map(
        ({ error }: ReturnType<typeof ClassifierDataActions.createFailure>) => {
          return ClassifierActions.createFailure({
            error: this.errorMapper.mapFromDto(
              error,
              `Failed to create classifier: ${error.data?.name}`,
              this.classifierMapper.mapFromCreateDto.bind(error.data)
            ),
          });
        }
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly createSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ClassifierDataActions.createSuccess),
      map(
        ({
          classifier,
        }: ReturnType<typeof ClassifierDataActions.createSuccess>) =>
          ClassifierActions.createSuccess({
            classifier: this.classifierMapper.mapFromDto(classifier),
          })
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly update$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ClassifierActions.update),
      map(({ classifier }: ReturnType<typeof ClassifierActions.update>) => {
        const dto: FindingClassifierUpdateDto =
          this.classifierMapper.mapToUpdateDto(classifier);

        return ClassifierDataActions.update({
          classifier: dto,
        });
      })
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly updateFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ClassifierDataActions.updateFailure),
      map(
        ({ error }: ReturnType<typeof ClassifierDataActions.updateFailure>) => {
          return ClassifierActions.updateFailure({
            error: this.errorMapper.mapFromDto(
              error,
              `Failed to update classifier: ${error.data?.name}`,
              this.classifierMapper.mapFromUpdateDto.bind(error.data)
            ),
          });
        }
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly updateSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ClassifierDataActions.updateSuccess),
      map(
        ({
          classifier,
        }: ReturnType<typeof ClassifierDataActions.updateSuccess>) =>
          ClassifierActions.updateSuccess({
            classifier: this.classifierMapper.mapFromDto(classifier),
          })
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly delete$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ClassifierActions.delete),
      map(({ classifier }: ReturnType<typeof ClassifierActions.delete>) => {
        const dto: FindingClassifierDto =
          this.classifierMapper.mapToDto(classifier);

        return ClassifierDataActions.delete({
          classifier: dto,
        });
      })
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly deleteFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ClassifierDataActions.deleteFailure),
      map(
        ({ error }: ReturnType<typeof ClassifierDataActions.deleteFailure>) => {
          return ClassifierActions.deleteFailure({
            error: this.errorMapper.mapFromDto(
              error,
              `Failed to delete classifier: ${error.data?.name}`,
              this.classifierMapper.mapFromDto.bind(error.data)
            ),
          });
        }
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly deleteSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ClassifierDataActions.deleteSuccess),
      map(
        ({
          classifier,
        }: ReturnType<typeof ClassifierDataActions.deleteSuccess>) =>
          ClassifierActions.deleteSuccess({
            classifier: this.classifierMapper.mapFromDto(classifier),
          })
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly reorder$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ClassifierActions.reorder),
      map(({ sortOrders }: ReturnType<typeof ClassifierActions.reorder>) => {
        const dto: SortOrderUpdateDto =
          this.sortOrderMapper.mapToDto(sortOrders);

        return ClassifierDataActions.reorder({
          sortOrders: dto,
        });
      })
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly reorderFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ClassifierDataActions.reorderFailure),
      map(
        ({
          error,
        }: ReturnType<typeof ClassifierDataActions.reorderFailure>) => {
          return ClassifierActions.reorderFailure({
            error: this.errorMapper.mapFromDto(
              error,
              'Failed to reorder classifiers'
            ),
          });
        }
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly reorderSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ClassifierDataActions.reorderSuccess),
      map(
        ({
          sortOrders,
        }: ReturnType<typeof ClassifierDataActions.reorderSuccess>) =>
          ClassifierActions.reorderSuccess({ sortOrders })
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly reset$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ClassifierActions.reset),
      map(() => FindingActions.reset())
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
          ApplicationActions.error({ error })
      )
    );
  });
}
