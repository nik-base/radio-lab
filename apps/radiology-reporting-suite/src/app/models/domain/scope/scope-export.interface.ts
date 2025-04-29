import { FindingGroupExport } from '../finding-group/finding-group-export.interface';

import { Scope } from './scope.interface';

export interface ScopeExport extends Scope {
  readonly groups: ReadonlyArray<FindingGroupExport>;
}
