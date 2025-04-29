import { FindingClassifierData } from '../finding-classifier/finding-classifier-data.interface';

import { FindingGroup } from './finding-group.interface';

export interface FindingGroupData extends FindingGroup {
  readonly classifiers: ReadonlyArray<FindingClassifierData>;
}
