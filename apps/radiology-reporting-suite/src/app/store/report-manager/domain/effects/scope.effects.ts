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
import { ApplicationActions } from '@app/store/actions/application.actions';

import { ScopeDataActions } from '../../data/actions/scope-data.actions';
import { ScopeActions } from '../actions/scope.actions';

@Injectable()
export class ScopeEffects {
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
      ofType(ScopeActions.fetch),
      map(({ templateId }: ReturnType<typeof ScopeActions.fetch>) =>
        ScopeDataActions.fetch({ templateId })
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly fetchFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ScopeDataActions.fetchFailure),
      map(({ error }: ReturnType<typeof ScopeDataActions.fetchFailure>) => {
        return ScopeActions.fetchFailure({
          error: this.errorMapper.mapFromDto(error, 'Failed to fetch scopes'),
        });
      })
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly fetchSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ScopeDataActions.fetchSuccess),
      map(({ scopes }: ReturnType<typeof ScopeDataActions.fetchSuccess>) => {
        return ScopeActions.fetchSuccess({
          scopes: scopes.map(
            (scope: ScopeDto): Scope => this.scopeMapper.mapFromDto(scope)
          ),
        });
      })
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly create$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ScopeActions.create),
      map(({ scope }: ReturnType<typeof ScopeActions.create>) => {
        const dto: ScopeCreateDto = this.scopeMapper.mapToCreateDto(scope);

        return ScopeDataActions.create({
          scope: dto,
        });
      })
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly createFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ScopeDataActions.createFailure),
      map(({ error }: ReturnType<typeof ScopeDataActions.createFailure>) => {
        return ScopeActions.createFailure({
          error: this.errorMapper.mapFromDto(
            error,
            `Failed to create scope: ${error.data?.name}`,
            this.scopeMapper.mapFromCreateDto.bind(error.data)
          ),
        });
      })
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly createSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ScopeDataActions.createSuccess),
      map(({ scope }: ReturnType<typeof ScopeDataActions.createSuccess>) =>
        ScopeActions.createSuccess({
          scope: this.scopeMapper.mapFromDto(scope),
        })
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly update$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ScopeActions.update),
      map(({ scope }: ReturnType<typeof ScopeActions.update>) => {
        const dto: ScopeUpdateDto = this.scopeMapper.mapToUpdateDto(scope);

        return ScopeDataActions.update({
          scope: dto,
        });
      })
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly updateFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ScopeDataActions.updateFailure),
      map(({ error }: ReturnType<typeof ScopeDataActions.updateFailure>) => {
        return ScopeActions.updateFailure({
          error: this.errorMapper.mapFromDto(
            error,
            `Failed to update scope: ${error.data?.name}`,
            this.scopeMapper.mapFromUpdateDto.bind(error.data)
          ),
        });
      })
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly updateSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ScopeDataActions.updateSuccess),
      map(({ scope }: ReturnType<typeof ScopeDataActions.updateSuccess>) =>
        ScopeActions.updateSuccess({
          scope: this.scopeMapper.mapFromDto(scope),
        })
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly delete$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ScopeActions.delete),
      map(({ scope }: ReturnType<typeof ScopeActions.delete>) => {
        const dto: ScopeDto = this.scopeMapper.mapToDto(scope);

        return ScopeDataActions.delete({
          scope: dto,
        });
      })
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly deleteFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ScopeDataActions.deleteFailure),
      map(({ error }: ReturnType<typeof ScopeDataActions.deleteFailure>) => {
        return ScopeActions.deleteFailure({
          error: this.errorMapper.mapFromDto(
            error,
            `Failed to delete scope: ${error.data?.name}`,
            this.scopeMapper.mapFromDto.bind(error.data)
          ),
        });
      })
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly deleteSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ScopeDataActions.deleteSuccess),
      map(({ scope }: ReturnType<typeof ScopeDataActions.deleteSuccess>) =>
        ScopeActions.deleteSuccess({
          scope: this.scopeMapper.mapFromDto(scope),
        })
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly reorder$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ScopeActions.reorder),
      map(({ sortOrders }: ReturnType<typeof ScopeActions.reorder>) => {
        const dto: SortOrderUpdateDto =
          this.sortOrderMapper.mapToDto(sortOrders);

        return ScopeDataActions.reorder({
          sortOrders: dto,
        });
      })
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly reorderFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ScopeDataActions.reorderFailure),
      map(({ error }: ReturnType<typeof ScopeDataActions.reorderFailure>) => {
        return ScopeActions.reorderFailure({
          error: this.errorMapper.mapFromDto(error, 'Failed to reorder scopes'),
        });
      })
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly reorderSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ScopeDataActions.reorderSuccess),
      map(
        ({ sortOrders }: ReturnType<typeof ScopeDataActions.reorderSuccess>) =>
          ScopeActions.reorderSuccess({ sortOrders })
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly clone$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ScopeActions.clone),
      map(({ scope, templateId }: ReturnType<typeof ScopeActions.clone>) => {
        const dto: ScopeDto = this.scopeMapper.mapToDto(scope);

        return ScopeDataActions.clone({
          scope: dto,
          templateId,
        });
      })
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly cloneFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ScopeDataActions.cloneFailure),
      map(({ error }: ReturnType<typeof ScopeDataActions.cloneFailure>) => {
        return ScopeActions.cloneFailure({
          error: this.errorMapper.mapFromDto(
            error,
            `Failed to clone scope: ${error.data?.name}`,
            this.scopeMapper.mapFromDto.bind(error.data)
          ),
        });
      })
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly cloneSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ScopeDataActions.cloneSuccess),
      map(
        ({
          scope,
          templateId,
        }: ReturnType<typeof ScopeDataActions.cloneSuccess>) =>
          ScopeActions.cloneSuccess({
            scope: this.scopeMapper.mapFromDto(scope),
            templateId,
          })
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly failure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        ScopeActions.fetchFailure,
        ScopeActions.createFailure,
        ScopeActions.updateFailure,
        ScopeActions.deleteFailure,
        ScopeActions.cloneFailure,
        ScopeActions.reorderFailure
      ),
      map(
        ({
          error,
        }:
          | ReturnType<typeof ScopeActions.fetchFailure>
          | ReturnType<typeof ScopeActions.createFailure>
          | ReturnType<typeof ScopeActions.updateFailure>
          | ReturnType<typeof ScopeActions.deleteFailure>
          | ReturnType<typeof ScopeActions.cloneFailure>
          | ReturnType<typeof ScopeActions.reorderFailure>) =>
          ApplicationActions.error({ error })
      )
    );
  });
}
