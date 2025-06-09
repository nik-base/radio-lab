import { FindingClassifierExportDto } from '../finding-classifier/finding-classifier-export-dto.interface';

import { FindingGroupDto } from './finding-group-dto.interface';

export interface FindingGroupExportDto extends FindingGroupDto {
  readonly classifiers: ReadonlyArray<FindingClassifierExportDto>;
}
