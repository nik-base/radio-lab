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

import { ReportManagerFindingDataActions } from '../../data/actions/report-manager-finding-data.actions';
import { ReportManagerFindingActions } from '../actions/report-manager-finding.actions';

@Injectable()
export class ReportManagerFindingEffects {
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
      ofType(ReportManagerFindingActions.fetch),
      map(({ scopeId }: ReturnType<typeof ReportManagerFindingActions.fetch>) =>
        ReportManagerFindingDataActions.fetch({ scopeId })
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly fetchFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportManagerFindingDataActions.fetchFailure),
      map(
        ({
          error,
        }: ReturnType<typeof ReportManagerFindingDataActions.fetchFailure>) => {
          return ReportManagerFindingActions.fetchFailure({
            error: this.errorMapper.mapFromDto(
              error,
              'Failed to fetch findings'
            ),
          });
        }
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly fetchSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportManagerFindingDataActions.fetchSuccess),
      map(
        ({
          findings,
        }: ReturnType<typeof ReportManagerFindingDataActions.fetchSuccess>) => {
          return ReportManagerFindingActions.fetchSuccess({
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
      ofType(ReportManagerFindingActions.create),
      map(
        ({
          finding,
        }: ReturnType<typeof ReportManagerFindingActions.create>) => {
          const dto: FindingCreateDto =
            this.findingMapper.mapToCreateDto(finding);

          return ReportManagerFindingDataActions.create({
            finding: dto,
          });
        }
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly createFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportManagerFindingDataActions.createFailure),
      map(
        ({
          error,
        }: ReturnType<
          typeof ReportManagerFindingDataActions.createFailure
        >) => {
          return ReportManagerFindingActions.createFailure({
            error: this.errorMapper.mapFromDto(
              error,
              'Failed to create finding',
              this.findingMapper.mapFromCreateDto.bind(error.data)
            ),
          });
        }
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly createSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportManagerFindingDataActions.createSuccess),
      map(
        ({
          finding,
        }: ReturnType<typeof ReportManagerFindingDataActions.createSuccess>) =>
          ReportManagerFindingActions.createSuccess({
            finding: this.findingMapper.mapFromDto(finding),
          })
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly update$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportManagerFindingActions.update),
      map(
        ({
          finding,
        }: ReturnType<typeof ReportManagerFindingActions.update>) => {
          const dto: FindingUpdateDto =
            this.findingMapper.mapToUpdateDto(finding);

          return ReportManagerFindingDataActions.update({
            finding: dto,
          });
        }
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly updateFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportManagerFindingDataActions.updateFailure),
      map(
        ({
          error,
        }: ReturnType<
          typeof ReportManagerFindingDataActions.updateFailure
        >) => {
          return ReportManagerFindingActions.updateFailure({
            error: this.errorMapper.mapFromDto(
              error,
              'Failed to update finding',
              this.findingMapper.mapFromUpdateDto.bind(error.data)
            ),
          });
        }
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly updateSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportManagerFindingDataActions.updateSuccess),
      map(
        ({
          finding,
        }: ReturnType<typeof ReportManagerFindingDataActions.updateSuccess>) =>
          ReportManagerFindingActions.updateSuccess({
            finding: this.findingMapper.mapFromDto(finding),
          })
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly delete$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportManagerFindingActions.delete),
      map(
        ({
          finding,
        }: ReturnType<typeof ReportManagerFindingActions.delete>) => {
          const dto: FindingDto = this.findingMapper.mapToDto(finding);

          return ReportManagerFindingDataActions.delete({
            finding: dto,
          });
        }
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly deleteFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportManagerFindingDataActions.deleteFailure),
      map(
        ({
          error,
        }: ReturnType<
          typeof ReportManagerFindingDataActions.deleteFailure
        >) => {
          return ReportManagerFindingActions.deleteFailure({
            error: this.errorMapper.mapFromDto(
              error,
              'Failed to delete finding',
              this.findingMapper.mapFromDto.bind(error.data)
            ),
          });
        }
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly deleteSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportManagerFindingDataActions.deleteSuccess),
      map(
        ({
          finding,
        }: ReturnType<typeof ReportManagerFindingDataActions.deleteSuccess>) =>
          ReportManagerFindingActions.deleteSuccess({
            finding: this.findingMapper.mapFromDto(finding),
          })
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly reorder$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportManagerFindingActions.reorder),
      map(
        ({
          sortOrders,
        }: ReturnType<typeof ReportManagerFindingActions.reorder>) => {
          const dto: SortOrderUpdateDto =
            this.sortOrderMapper.mapToDto(sortOrders);

          return ReportManagerFindingDataActions.reorder({
            sortOrders: dto,
          });
        }
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly reorderFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportManagerFindingDataActions.reorderFailure),
      map(
        ({
          error,
        }: ReturnType<
          typeof ReportManagerFindingDataActions.reorderFailure
        >) => {
          return ReportManagerFindingActions.reorderFailure({
            error: this.errorMapper.mapFromDto(
              error,
              'Failed to reorder findings'
            ),
          });
        }
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly reorderSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportManagerFindingDataActions.reorderSuccess),
      map(
        ({
          sortOrders,
        }: ReturnType<typeof ReportManagerFindingDataActions.reorderSuccess>) =>
          ReportManagerFindingActions.reorderSuccess({ sortOrders })
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly clone$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportManagerFindingActions.clone),
      map(
        ({ finding }: ReturnType<typeof ReportManagerFindingActions.clone>) => {
          const dto: FindingDto = this.findingMapper.mapToDto(finding);

          return ReportManagerFindingDataActions.clone({
            finding: dto,
          });
        }
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly cloneFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportManagerFindingDataActions.cloneFailure),
      map(
        ({
          error,
        }: ReturnType<typeof ReportManagerFindingDataActions.cloneFailure>) => {
          return ReportManagerFindingActions.cloneFailure({
            error: this.errorMapper.mapFromDto(
              error,
              'Failed to import finding',
              this.findingMapper.mapFromDto.bind(error.data)
            ),
          });
        }
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly cloneSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportManagerFindingDataActions.cloneSuccess),
      map(
        ({
          finding,
        }: ReturnType<typeof ReportManagerFindingDataActions.cloneSuccess>) =>
          ReportManagerFindingActions.cloneSuccess({
            finding: this.findingMapper.mapFromDto(finding),
          })
      )
    );
  });
}
