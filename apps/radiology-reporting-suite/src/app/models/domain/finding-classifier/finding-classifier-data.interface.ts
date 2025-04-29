import { FindingData } from '../finding/finding-data.interface';

import { FindingClassifier } from './finding-classifier.interface';

export interface FindingClassifierData extends FindingClassifier {
  readonly findings: ReadonlyArray<FindingData>;
}
