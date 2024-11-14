import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs';

import { ApplicationErrorMapperService } from '@app/mapper/application-error-mapper.service';
import { ScopeMapperService } from '@app/mapper/scope-mapper.service';
import { SortOrderMapperService } from '@app/mapper/sort-order-mapper.service';
import {
  ScopeCreateDto,
  ScopeDto,
  ScopeUpdateDto,
  SortOrderUpdateDto,
} from '@app/models/data';
import { Scope } from '@app/models/domain';

import { ReportManagerScopeDataActions } from '../../data/actions/report-manager-scope-data.actions';
import { ReportManagerScopeActions } from '../actions/report-manager-scope.actions';

@Injectable()
export class ReportManagerScopeEffects {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  private readonly actions$: Actions = inject(Actions);

  private readonly scopeMapper: ScopeMapperService = inject(ScopeMapperService);

  private readonly sortOrderMapper: SortOrderMapperService = inject(
    SortOrderMapperService
  );

  private readonly errorMapper: ApplicationErrorMapperService = inject(
    ApplicationErrorMapperService
  );

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly fetch$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportManagerScopeActions.fetch),
      map(
        ({ templateId }: ReturnType<typeof ReportManagerScopeActions.fetch>) =>
          ReportManagerScopeDataActions.fetch({ templateId })
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly fetchFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportManagerScopeDataActions.fetchFailure),
      map(
        ({
          error,
        }: ReturnType<typeof ReportManagerScopeDataActions.fetchFailure>) => {
          return ReportManagerScopeActions.fetchFailure({
            error: this.errorMapper.mapFromDto(error, 'Failed to fetch scopes'),
          });
        }
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly fetchSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportManagerScopeDataActions.fetchSuccess),
      map(
        ({
          scopes,
        }: ReturnType<typeof ReportManagerScopeDataActions.fetchSuccess>) => {
          return ReportManagerScopeActions.fetchSuccess({
            scopes: scopes.map(
              (scope: ScopeDto): Scope => this.scopeMapper.mapFromDto(scope)
            ),
          });
        }
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly create$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportManagerScopeActions.create),
      map(({ scope }: ReturnType<typeof ReportManagerScopeActions.create>) => {
        const dto: ScopeCreateDto = this.scopeMapper.mapToCreateDto(scope);

        return ReportManagerScopeDataActions.create({
          scope: dto,
        });
      })
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly createFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportManagerScopeDataActions.createFailure),
      map(
        ({
          error,
        }: ReturnType<typeof ReportManagerScopeDataActions.createFailure>) => {
          return ReportManagerScopeActions.createFailure({
            error: this.errorMapper.mapFromDto(
              error,
              'Failed to create scope',
              this.scopeMapper.mapFromCreateDto.bind(error.data)
            ),
          });
        }
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly createSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportManagerScopeDataActions.createSuccess),
      map(
        ({
          scope,
        }: ReturnType<typeof ReportManagerScopeDataActions.createSuccess>) =>
          ReportManagerScopeActions.createSuccess({
            scope: this.scopeMapper.mapFromDto(scope),
          })
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly update$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportManagerScopeActions.update),
      map(({ scope }: ReturnType<typeof ReportManagerScopeActions.update>) => {
        const dto: ScopeUpdateDto = this.scopeMapper.mapToUpdateDto(scope);

        return ReportManagerScopeDataActions.update({
          scope: dto,
        });
      })
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly updateFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportManagerScopeDataActions.updateFailure),
      map(
        ({
          error,
        }: ReturnType<typeof ReportManagerScopeDataActions.updateFailure>) => {
          return ReportManagerScopeActions.updateFailure({
            error: this.errorMapper.mapFromDto(
              error,
              'Failed to update scope',
              this.scopeMapper.mapFromUpdateDto.bind(error.data)
            ),
          });
        }
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly updateSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportManagerScopeDataActions.updateSuccess),
      map(
        ({
          scope,
        }: ReturnType<typeof ReportManagerScopeDataActions.updateSuccess>) =>
          ReportManagerScopeActions.updateSuccess({
            scope: this.scopeMapper.mapFromDto(scope),
          })
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly delete$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportManagerScopeActions.delete),
      map(({ scope }: ReturnType<typeof ReportManagerScopeActions.delete>) => {
        const dto: ScopeDto = this.scopeMapper.mapToDto(scope);

        return ReportManagerScopeDataActions.delete({
          scope: dto,
        });
      })
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly deleteFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportManagerScopeDataActions.deleteFailure),
      map(
        ({
          error,
        }: ReturnType<typeof ReportManagerScopeDataActions.deleteFailure>) => {
          return ReportManagerScopeActions.deleteFailure({
            error: this.errorMapper.mapFromDto(
              error,
              'Failed to delete scope',
              this.scopeMapper.mapFromDto.bind(error.data)
            ),
          });
        }
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly deleteSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportManagerScopeDataActions.deleteSuccess),
      map(
        ({
          scope,
        }: ReturnType<typeof ReportManagerScopeDataActions.deleteSuccess>) =>
          ReportManagerScopeActions.deleteSuccess({
            scope: this.scopeMapper.mapFromDto(scope),
          })
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly reorder$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportManagerScopeActions.reorder),
      map(
        ({
          sortOrders,
        }: ReturnType<typeof ReportManagerScopeActions.reorder>) => {
          const dto: SortOrderUpdateDto =
            this.sortOrderMapper.mapToDto(sortOrders);

          return ReportManagerScopeDataActions.reorder({
            sortOrders: dto,
          });
        }
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly reorderFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportManagerScopeDataActions.reorderFailure),
      map(
        ({
          error,
        }: ReturnType<typeof ReportManagerScopeDataActions.reorderFailure>) => {
          return ReportManagerScopeActions.reorderFailure({
            error: this.errorMapper.mapFromDto(
              error,
              'Failed to reorder scopes'
            ),
          });
        }
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly reorderSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportManagerScopeDataActions.reorderSuccess),
      map(
        ({
          sortOrders,
        }: ReturnType<typeof ReportManagerScopeDataActions.reorderSuccess>) =>
          ReportManagerScopeActions.reorderSuccess({ sortOrders })
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly clone$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportManagerScopeActions.clone),
      map(
        ({
          scope,
          templateId,
        }: ReturnType<typeof ReportManagerScopeActions.clone>) => {
          const dto: ScopeDto = this.scopeMapper.mapToDto(scope);

          return ReportManagerScopeDataActions.clone({
            scope: dto,
            templateId,
          });
        }
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly cloneFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportManagerScopeDataActions.cloneFailure),
      map(
        ({
          error,
        }: ReturnType<typeof ReportManagerScopeDataActions.cloneFailure>) => {
          return ReportManagerScopeActions.cloneFailure({
            error: this.errorMapper.mapFromDto(
              error,
              'Failed to import scope',
              this.scopeMapper.mapFromDto.bind(error.data)
            ),
          });
        }
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly cloneSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportManagerScopeDataActions.cloneSuccess),
      map(
        ({
          scope,
          templateId,
        }: ReturnType<typeof ReportManagerScopeDataActions.cloneSuccess>) =>
          ReportManagerScopeActions.cloneSuccess({
            scope: this.scopeMapper.mapFromDto(scope),
            templateId,
          })
      )
    );
  });
}
