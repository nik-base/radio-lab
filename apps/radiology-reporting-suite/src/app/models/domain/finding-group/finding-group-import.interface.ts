import { FindingClassifierBase } from '../finding-classifier/finding-classifier-base.interface';

import { FindingGroupBase } from './finding-group-base.interface';

export interface FindingGroupImport extends FindingGroupBase {
  readonly classifiers: ReadonlyArray<FindingClassifierBase>;
}
