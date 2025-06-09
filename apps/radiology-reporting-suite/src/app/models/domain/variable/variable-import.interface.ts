import { VariableValueImport } from '../variable-value/variable-value-import.interface';

import { VariableBase } from './variable-base.interface';

export interface VariableImport extends VariableBase {
  readonly id: string;
  readonly variableValues: ReadonlyArray<VariableValueImport>;
}
