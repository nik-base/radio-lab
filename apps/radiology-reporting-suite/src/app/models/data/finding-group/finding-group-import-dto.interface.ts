import { FindingClassifierImportDto } from '../finding-classifier/finding-classifier-import-dto.interface';

import { FindingGroupBaseDto } from './finding-group-base-dto.interface';

export interface FindingGroupImportDto extends FindingGroupBaseDto {
  readonly classifiers: ReadonlyArray<FindingClassifierImportDto>;
}
