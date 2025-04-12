import { FindingBaseDto } from '../finding/finding-base-dto.interface';

import { FindingGroupBaseDto } from './finding-group-base-dto.interface';

export interface FindingGroupImportDto extends FindingGroupBaseDto {
  readonly findings: ReadonlyArray<FindingBaseDto>;
}
