import { FindingBaseDto } from '../finding/finding-base-dto.interface';

import { ScopeBaseDto } from './scope-base-dto.interface';

export interface ScopeImportDto extends ScopeBaseDto {
  readonly findings: FindingBaseDto[];
}
