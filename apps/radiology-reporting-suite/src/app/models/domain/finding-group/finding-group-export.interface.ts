import { FindingClassifierExport } from '../finding-classifier/finding-classifier-export.interface';

import { FindingGroup } from './finding-group.interface';

export interface FindingGroupExport extends FindingGroup {
  readonly classifiers: ReadonlyArray<FindingClassifierExport>;
}
