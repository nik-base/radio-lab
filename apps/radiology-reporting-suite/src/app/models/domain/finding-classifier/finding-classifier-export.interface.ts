import { FindingExport } from '../finding/finding-export.interface';

import { FindingClassifier } from './finding-classifier.interface';

export interface FindingClassifierExport extends FindingClassifier {
  readonly findings: ReadonlyArray<FindingExport>;
}
