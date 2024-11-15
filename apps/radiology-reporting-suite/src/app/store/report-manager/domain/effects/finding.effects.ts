import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs';

import { ApplicationErrorMapperService } from '@app/mapper/application-error-mapper.service';
import { FindingMapperService } from '@app/mapper/finding-mapper.service';
import { SortOrderMapperService } from '@app/mapper/sort-order-mapper.service';
import {
  FindingCreateDto,
  FindingDto,
  FindingUpdateDto,
  SortOrderUpdateDto,
} from '@app/models/data';
import { Finding } from '@app/models/domain';
import { ApplicationActions } from '@app/store/actions/application.actions';

import { FindingDataActions } from '../../data/actions/finding-data.actions';
import { FindingActions } from '../actions/finding.actions';

@Injectable()
export class FindingEffects {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  private readonly actions$: Actions = inject(Actions);

  private readonly findingMapper: FindingMapperService =
    inject(FindingMapperService);

  private readonly sortOrderMapper: SortOrderMapperService = inject(
    SortOrderMapperService
  );

  private readonly errorMapper: ApplicationErrorMapperService = inject(
    ApplicationErrorMapperService
  );

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly fetch$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FindingActions.fetch),
      map(({ scopeId }: ReturnType<typeof FindingActions.fetch>) =>
        FindingDataActions.fetch({ scopeId })
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly fetchFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FindingDataActions.fetchFailure),
      map(({ error }: ReturnType<typeof FindingDataActions.fetchFailure>) => {
        return FindingActions.fetchFailure({
          error: this.errorMapper.mapFromDto(error, 'Failed to fetch findings'),
        });
      })
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly fetchSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FindingDataActions.fetchSuccess),
      map(
        ({ findings }: ReturnType<typeof FindingDataActions.fetchSuccess>) => {
          return FindingActions.fetchSuccess({
            findings: findings.map(
              (finding: FindingDto): Finding =>
                this.findingMapper.mapFromDto(finding)
            ),
          });
        }
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly create$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FindingActions.create),
      map(({ finding }: ReturnType<typeof FindingActions.create>) => {
        const dto: FindingCreateDto =
          this.findingMapper.mapToCreateDto(finding);

        return FindingDataActions.create({
          finding: dto,
        });
      })
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly createFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FindingDataActions.createFailure),
      map(({ error }: ReturnType<typeof FindingDataActions.createFailure>) => {
        return FindingActions.createFailure({
          error: this.errorMapper.mapFromDto(
            error,
            `Failed to create finding: ${error.data?.name}`,
            this.findingMapper.mapFromCreateDto.bind(error.data)
          ),
        });
      })
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly createSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FindingDataActions.createSuccess),
      map(({ finding }: ReturnType<typeof FindingDataActions.createSuccess>) =>
        FindingActions.createSuccess({
          finding: this.findingMapper.mapFromDto(finding),
        })
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly update$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FindingActions.update),
      map(({ finding }: ReturnType<typeof FindingActions.update>) => {
        const dto: FindingUpdateDto =
          this.findingMapper.mapToUpdateDto(finding);

        return FindingDataActions.update({
          finding: dto,
        });
      })
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly updateFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FindingDataActions.updateFailure),
      map(({ error }: ReturnType<typeof FindingDataActions.updateFailure>) => {
        return FindingActions.updateFailure({
          error: this.errorMapper.mapFromDto(
            error,
            `Failed to update finding: ${error.data?.name}`,
            this.findingMapper.mapFromUpdateDto.bind(error.data)
          ),
        });
      })
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly updateSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FindingDataActions.updateSuccess),
      map(({ finding }: ReturnType<typeof FindingDataActions.updateSuccess>) =>
        FindingActions.updateSuccess({
          finding: this.findingMapper.mapFromDto(finding),
        })
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly delete$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FindingActions.delete),
      map(({ finding }: ReturnType<typeof FindingActions.delete>) => {
        const dto: FindingDto = this.findingMapper.mapToDto(finding);

        return FindingDataActions.delete({
          finding: dto,
        });
      })
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly deleteFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FindingDataActions.deleteFailure),
      map(({ error }: ReturnType<typeof FindingDataActions.deleteFailure>) => {
        return FindingActions.deleteFailure({
          error: this.errorMapper.mapFromDto(
            error,
            `Failed to delete finding: ${error.data?.name}`,
            this.findingMapper.mapFromDto.bind(error.data)
          ),
        });
      })
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly deleteSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FindingDataActions.deleteSuccess),
      map(({ finding }: ReturnType<typeof FindingDataActions.deleteSuccess>) =>
        FindingActions.deleteSuccess({
          finding: this.findingMapper.mapFromDto(finding),
        })
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly reorder$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FindingActions.reorder),
      map(({ sortOrders }: ReturnType<typeof FindingActions.reorder>) => {
        const dto: SortOrderUpdateDto =
          this.sortOrderMapper.mapToDto(sortOrders);

        return FindingDataActions.reorder({
          sortOrders: dto,
        });
      })
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly reorderFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FindingDataActions.reorderFailure),
      map(({ error }: ReturnType<typeof FindingDataActions.reorderFailure>) => {
        return FindingActions.reorderFailure({
          error: this.errorMapper.mapFromDto(
            error,
            'Failed to reorder findings'
          ),
        });
      })
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly reorderSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FindingDataActions.reorderSuccess),
      map(
        ({
          sortOrders,
        }: ReturnType<typeof FindingDataActions.reorderSuccess>) =>
          FindingActions.reorderSuccess({ sortOrders })
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly clone$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FindingActions.clone),
      map(({ finding }: ReturnType<typeof FindingActions.clone>) => {
        const dto: FindingDto = this.findingMapper.mapToDto(finding);

        return FindingDataActions.clone({
          finding: dto,
        });
      })
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly cloneFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FindingDataActions.cloneFailure),
      map(({ error }: ReturnType<typeof FindingDataActions.cloneFailure>) => {
        return FindingActions.cloneFailure({
          error: this.errorMapper.mapFromDto(
            error,
            `Failed to clone finding: ${error.data?.name}`,
            this.findingMapper.mapFromDto.bind(error.data)
          ),
        });
      })
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly cloneSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FindingDataActions.cloneSuccess),
      map(({ finding }: ReturnType<typeof FindingDataActions.cloneSuccess>) =>
        FindingActions.cloneSuccess({
          finding: this.findingMapper.mapFromDto(finding),
        })
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly failure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        FindingActions.fetchFailure,
        FindingActions.createFailure,
        FindingActions.updateFailure,
        FindingActions.deleteFailure,
        FindingActions.cloneFailure,
        FindingActions.reorderFailure
      ),
      map(
        ({
          error,
        }:
          | ReturnType<typeof FindingActions.fetchFailure>
          | ReturnType<typeof FindingActions.createFailure>
          | ReturnType<typeof FindingActions.updateFailure>
          | ReturnType<typeof FindingActions.deleteFailure>
          | ReturnType<typeof FindingActions.cloneFailure>
          | ReturnType<typeof FindingActions.reorderFailure>) =>
          ApplicationActions.error({ error })
      )
    );
  });
}
