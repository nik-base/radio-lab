import { FindingDto } from '../finding/finding-dto.interface';

import { ScopeDto } from './scope-dto.interface';

export interface ScopeDataDto extends ScopeDto {
  readonly findings: FindingDto[];
}
