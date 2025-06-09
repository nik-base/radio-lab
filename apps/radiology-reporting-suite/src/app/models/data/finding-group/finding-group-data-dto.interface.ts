import { FindingClassifierDataDto } from '../finding-classifier/finding-classifier-data-dto.interface';

import { FindingGroupDto } from './finding-group-dto.interface';

export interface FindingGroupDataDto extends FindingGroupDto {
  readonly classifiers: ReadonlyArray<FindingClassifierDataDto>;
}
