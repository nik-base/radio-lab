import { FindingDataDto } from '../finding/finding-data-dto.interface';

import { FindingClassifierDto } from './finding-classifier-dto.interface';

export interface FindingClassifierDataDto extends FindingClassifierDto {
  readonly findings: ReadonlyArray<FindingDataDto>;
}
