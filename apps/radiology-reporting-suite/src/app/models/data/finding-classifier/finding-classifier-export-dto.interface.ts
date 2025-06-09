import { FindingExportDto } from '../finding/finding-export-dto.interface';

import { FindingClassifierDto } from './finding-classifier-dto.interface';

export interface FindingClassifierExportDto extends FindingClassifierDto {
  readonly findings: ReadonlyArray<FindingExportDto>;
}
