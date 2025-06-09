import { FindingGroupImport } from '../finding-group/finding-group-import.interface';

import { ScopeBase } from './scope-base.interface';

export interface ScopeImport extends ScopeBase {
  readonly groups: ReadonlyArray<FindingGroupImport>;
}
