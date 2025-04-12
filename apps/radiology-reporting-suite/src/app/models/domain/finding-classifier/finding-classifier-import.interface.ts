import { FindingBase } from '../finding/finding-base.interface';

import { FindingClassifierBase } from './finding-classifier-base.interface';

export interface FindingClassifierImport extends FindingClassifierBase {
  readonly findings: ReadonlyArray<FindingBase>;
}
