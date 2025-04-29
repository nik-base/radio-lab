import { VariableValueBase } from './variable-value-base.interface';

export interface VariableValue extends VariableValueBase {
  readonly id: string;
  readonly variableId: string;
}
