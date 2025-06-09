import { VariableBase } from './variable-base.interface';

export interface VariableUpdate extends VariableBase {
  readonly id: string;
  readonly entityId: string;
}
