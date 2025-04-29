import { FindingGroupImportDto } from '../finding-group/finding-group-import-dto.interface';

import { ScopeBaseDto } from './scope-base-dto.interface';

export interface ScopeImportDto extends ScopeBaseDto {
  readonly groups: ReadonlyArray<FindingGroupImportDto>;
}
