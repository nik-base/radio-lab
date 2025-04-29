import { VariableValueExport } from '../variable-value/variable-value-export.interface';

import { Variable } from './variable.interface';

export interface VariableExport extends Variable {
  readonly variableValues: ReadonlyArray<VariableValueExport>;
}
