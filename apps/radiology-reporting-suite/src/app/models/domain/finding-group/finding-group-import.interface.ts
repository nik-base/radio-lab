import { FindingClassifierImport } from '../finding-classifier/finding-classifier-import.interface';

import { FindingGroupBase } from './finding-group-base.interface';

export interface FindingGroupImport extends FindingGroupBase {
  readonly classifiers: ReadonlyArray<FindingClassifierImport>;
}
