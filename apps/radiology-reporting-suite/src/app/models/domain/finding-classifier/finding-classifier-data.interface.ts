import { Finding } from '../finding/finding.interface';

import { FindingClassifier } from './finding-classifier.interface';

export interface FindingClassifierData extends FindingClassifier {
  readonly findings: ReadonlyArray<Finding>;
}
