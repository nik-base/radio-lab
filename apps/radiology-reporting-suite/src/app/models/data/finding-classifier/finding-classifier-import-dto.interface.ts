import { FindingImportDto } from '../finding/finding-import-dto.interface';

import { FindingClassifierBaseDto } from './finding-classifier-base-dto.interface';

export interface FindingClassifierImportDto extends FindingClassifierBaseDto {
  readonly findings: ReadonlyArray<FindingImportDto>;
}
