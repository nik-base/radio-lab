import { VariableValueBase } from './variable-value-base.interface';

export interface VariableValueUpdate extends VariableValueBase {
  readonly id: string;
  readonly variableId: string;
}
