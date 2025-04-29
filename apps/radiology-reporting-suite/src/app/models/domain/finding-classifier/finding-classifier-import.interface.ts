import { FindingImport } from '../finding/finding-import.interface';

import { FindingClassifierBase } from './finding-classifier-base.interface';

export interface FindingClassifierImport extends FindingClassifierBase {
  readonly findings: ReadonlyArray<FindingImport>;
}
