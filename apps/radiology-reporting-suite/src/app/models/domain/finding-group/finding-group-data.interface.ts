import { FindingClassifier } from '../finding-classifier/finding-classifier.interface';

import { FindingGroup } from './finding-group.interface';

export interface FindingGroupData extends FindingGroup {
  readonly classifiers: ReadonlyArray<FindingClassifier>;
}
