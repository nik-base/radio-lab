import { FindingGroupExportDto } from '../finding-group/finding-group-export-dto.interface';

import { ScopeDto } from './scope-dto.interface';

export interface ScopeExportDto extends ScopeDto {
  readonly groups: ReadonlyArray<FindingGroupExportDto>;
}
