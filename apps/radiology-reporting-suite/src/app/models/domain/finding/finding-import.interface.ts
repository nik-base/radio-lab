import { VariableImport } from '../variable/variable-import.interface';

import { FindingBase } from './finding-base.interface';

export interface FindingImport extends FindingBase {
  readonly variables: ReadonlyArray<VariableImport>;
}
