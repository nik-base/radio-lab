import { FindingDto } from '../finding/finding-dto.interface';

import { FindingClassifierDto } from './finding-classifier-dto.interface';

export interface FindingClassifierDataDto extends FindingClassifierDto {
  readonly findings: ReadonlyArray<FindingDto>;
}
