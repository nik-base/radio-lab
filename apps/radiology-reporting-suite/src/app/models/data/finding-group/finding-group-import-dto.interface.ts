import { FindingClassifierBaseDto } from '../finding-classifier/finding-classifier-base-dto.interface';

import { FindingGroupBaseDto } from './finding-group-base-dto.interface';

export interface FindingGroupImportDto extends FindingGroupBaseDto {
  readonly classifiers: ReadonlyArray<FindingClassifierBaseDto>;
}
