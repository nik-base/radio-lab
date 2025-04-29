import { VariableValueBase } from './variable-value-base.interface';

export interface VariableValueCreate extends VariableValueBase {
  readonly variableId: string;
}
