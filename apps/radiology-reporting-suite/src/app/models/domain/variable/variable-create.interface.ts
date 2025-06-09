import { VariableBase } from './variable-base.interface';

export interface VariableCreate extends VariableBase {
  readonly entityId: string;
}
