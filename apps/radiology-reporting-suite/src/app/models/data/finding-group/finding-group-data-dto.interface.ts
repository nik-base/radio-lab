import { FindingDto } from '../finding/finding-dto.interface';

import { FindingGroupDto } from './finding-group-dto.interface';

export interface FindingGroupDataDto extends FindingGroupDto {
  readonly findings: ReadonlyArray<FindingDto>;
}
