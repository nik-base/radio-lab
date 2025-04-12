import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs';

import { ApplicationErrorMapperService } from '@app/mapper/application-error-mapper.service';
import { FindingGroupMapperService } from '@app/mapper/finding-group-mapper.service';
import { SortOrderMapperService } from '@app/mapper/sort-order-mapper.service';
import {
  FindingGroupCreateDto,
  FindingGroupDto,
  FindingGroupUpdateDto,
  SortOrderUpdateDto,
} from '@app/models/data';
import { FindingGroup } from '@app/models/domain';
import { ApplicationActions } from '@app/store/actions/application.actions';

import { GroupDataActions } from '../../data/actions/group-data.actions';
import { ClassifierActions } from '../actions/classifier.actions';
import { GroupActions } from '../actions/group.actions';

@Injectable()
export class GroupEffects {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  private readonly actions$: Actions = inject(Actions);

  private readonly groupMapper: FindingGroupMapperService = inject(
    FindingGroupMapperService
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
      ofType(GroupActions.fetch),
      map(({ scopeId }: ReturnType<typeof GroupActions.fetch>) =>
        GroupDataActions.fetch({ scopeId })
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly fetchFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GroupDataActions.fetchFailure),
      map(({ error }: ReturnType<typeof GroupDataActions.fetchFailure>) => {
        return GroupActions.fetchFailure({
          error: this.errorMapper.mapFromDto(error, 'Failed to fetch groups'),
        });
      })
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly fetchSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GroupDataActions.fetchSuccess),
      map(({ groups }: ReturnType<typeof GroupDataActions.fetchSuccess>) => {
        return GroupActions.fetchSuccess({
          groups: groups.map(
            (group: FindingGroupDto): FindingGroup =>
              this.groupMapper.mapFromDto(group)
          ),
        });
      })
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly create$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GroupActions.create),
      map(({ group }: ReturnType<typeof GroupActions.create>) => {
        const dto: FindingGroupCreateDto =
          this.groupMapper.mapToCreateDto(group);

        return GroupDataActions.create({
          group: dto,
        });
      })
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly createFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GroupDataActions.createFailure),
      map(({ error }: ReturnType<typeof GroupDataActions.createFailure>) => {
        return GroupActions.createFailure({
          error: this.errorMapper.mapFromDto(
            error,
            `Failed to create group: ${error.data?.name}`,
            this.groupMapper.mapFromCreateDto.bind(error.data)
          ),
        });
      })
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly createSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GroupDataActions.createSuccess),
      map(({ group }: ReturnType<typeof GroupDataActions.createSuccess>) =>
        GroupActions.createSuccess({
          group: this.groupMapper.mapFromDto(group),
        })
      )
    );
  });

  // // eslint-disable-next-line @typescript-eslint/typedef
  // readonly createDefaultFindingGroup$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(GroupActions.createSuccess),
  //     map(({ group }: ReturnType<typeof GroupActions.createSuccess>) =>
  //       GroupActions.createSuccess({
  //         group: this.groupMapper.mapFromDto(group),
  //       })
  //     )
  //   );
  // });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly update$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GroupActions.update),
      map(({ group }: ReturnType<typeof GroupActions.update>) => {
        const dto: FindingGroupUpdateDto =
          this.groupMapper.mapToUpdateDto(group);

        return GroupDataActions.update({
          group: dto,
        });
      })
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly updateFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GroupDataActions.updateFailure),
      map(({ error }: ReturnType<typeof GroupDataActions.updateFailure>) => {
        return GroupActions.updateFailure({
          error: this.errorMapper.mapFromDto(
            error,
            `Failed to update group: ${error.data?.name}`,
            this.groupMapper.mapFromUpdateDto.bind(error.data)
          ),
        });
      })
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly updateSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GroupDataActions.updateSuccess),
      map(({ group }: ReturnType<typeof GroupDataActions.updateSuccess>) =>
        GroupActions.updateSuccess({
          group: this.groupMapper.mapFromDto(group),
        })
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly delete$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GroupActions.delete),
      map(({ group }: ReturnType<typeof GroupActions.delete>) => {
        const dto: FindingGroupDto = this.groupMapper.mapToDto(group);

        return GroupDataActions.delete({
          group: dto,
        });
      })
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly deleteFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GroupDataActions.deleteFailure),
      map(({ error }: ReturnType<typeof GroupDataActions.deleteFailure>) => {
        return GroupActions.deleteFailure({
          error: this.errorMapper.mapFromDto(
            error,
            `Failed to delete group: ${error.data?.name}`,
            this.groupMapper.mapFromDto.bind(error.data)
          ),
        });
      })
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly deleteSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GroupDataActions.deleteSuccess),
      map(({ group }: ReturnType<typeof GroupDataActions.deleteSuccess>) =>
        GroupActions.deleteSuccess({
          group: this.groupMapper.mapFromDto(group),
        })
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly reorder$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GroupActions.reorder),
      map(({ sortOrders }: ReturnType<typeof GroupActions.reorder>) => {
        const dto: SortOrderUpdateDto =
          this.sortOrderMapper.mapToDto(sortOrders);

        return GroupDataActions.reorder({
          sortOrders: dto,
        });
      })
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly reorderFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GroupDataActions.reorderFailure),
      map(({ error }: ReturnType<typeof GroupDataActions.reorderFailure>) => {
        return GroupActions.reorderFailure({
          error: this.errorMapper.mapFromDto(error, 'Failed to reorder groups'),
        });
      })
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly reorderSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GroupDataActions.reorderSuccess),
      map(
        ({ sortOrders }: ReturnType<typeof GroupDataActions.reorderSuccess>) =>
          GroupActions.reorderSuccess({ sortOrders })
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly reset$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GroupActions.reset),
      map(() => ClassifierActions.reset())
    );
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  readonly failure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        GroupActions.fetchFailure,
        GroupActions.createFailure,
        GroupActions.updateFailure,
        GroupActions.deleteFailure,
        GroupActions.reorderFailure
      ),
      map(
        ({
          error,
        }:
          | ReturnType<typeof GroupActions.fetchFailure>
          | ReturnType<typeof GroupActions.createFailure>
          | ReturnType<typeof GroupActions.updateFailure>
          | ReturnType<typeof GroupActions.deleteFailure>
          | ReturnType<typeof GroupActions.reorderFailure>) =>
          ApplicationActions.error({ error })
      )
    );
  });
}
