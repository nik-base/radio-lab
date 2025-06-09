import { VariableExport } from '../variable/variable-export.interface';

import { Finding } from './finding.interface';

export interface FindingExport extends Finding {
  readonly variables: ReadonlyArray<VariableExport>;
}
