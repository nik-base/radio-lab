import { FindingClassifierDto } from '../finding-classifier/finding-classifier-dto.interface';

import { FindingGroupDto } from './finding-group-dto.interface';

export interface FindingGroupDataDto extends FindingGroupDto {
  readonly classifiers: ReadonlyArray<FindingClassifierDto>;
}
