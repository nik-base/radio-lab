import { FindingGroupData } from '../finding-group/finding-group-data.interface';

import { Scope } from './scope.interface';

export interface ScopeData extends Scope {
  readonly groups: ReadonlyArray<FindingGroupData>;
}
