import { FindingBase } from '../finding/finding-base.interface';

import { ScopeBase } from './scope-base.interface';

export interface ScopeImport extends ScopeBase {
  readonly findings: ReadonlyArray<FindingBase>;
}
