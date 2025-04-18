import { signalStore, withMethods } from '@ngrx/signals';

import {
  FindingGroupCreateDto,
  FindingGroupDto,
  FindingGroupUpdateDto,
} from '@app/models/data';
import {
  FindingGroup,
  FindingGroupCreate,
  FindingGroupUpdate,
} from '@app/models/domain';
import { GroupManagerService } from '@app/services/report-manager/group-manager.service';

import { withCRUD } from '../utils/signal-store-features/with-crud.store-feature';

import { AppEntityState } from './entity-state.interface';

const initialState: AppEntityState<FindingGroup> = {
  current: null,
  isLoading: false,
  error: null,
  currentOperation: null,
};

// eslint-disable-next-line @typescript-eslint/typedef
export const GroupStore = signalStore(
  withCRUD<
    FindingGroup,
    FindingGroupDto,
    FindingGroupCreate,
    FindingGroupCreateDto,
    FindingGroupUpdate,
    FindingGroupUpdateDto,
    { id: string },
    GroupManagerService
  >(initialState, GroupManagerService, 'group', 'groups'),
  withMethods(
    (
      // eslint-disable-next-line @typescript-eslint/typedef
      store
    ) => ({
      change(entity: FindingGroup | null): void {
        store.select(entity);
      },

      reset(): void {
        store.resetState();
      },
    })
  )
);
