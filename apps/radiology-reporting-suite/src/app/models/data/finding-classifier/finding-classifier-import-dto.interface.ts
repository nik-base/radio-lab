import { FindingBaseDto } from '../finding/finding-base-dto.interface';

import { FindingClassifierBaseDto } from './finding-classifier-base-dto.interface';

export interface FindingClassifierImportDto extends FindingClassifierBaseDto {
  readonly findings: ReadonlyArray<FindingBaseDto>;
}
