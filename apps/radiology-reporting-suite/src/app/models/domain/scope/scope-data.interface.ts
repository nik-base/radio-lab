import { Finding } from '../finding/finding.interface';

import { Scope } from './scope.interface';

export interface ScopeData extends Scope {
  readonly findings: ReadonlyArray<Finding>;
}
