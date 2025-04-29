import { FindingGroupDataDto } from '../finding-group/finding-group-data-dto.interface';

import { ScopeDto } from './scope-dto.interface';

export interface ScopeDataDto extends ScopeDto {
  readonly groups: ReadonlyArray<FindingGroupDataDto>;
}
