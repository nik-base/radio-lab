import { VariableBase } from './variable-base.interface';

export interface Variable extends VariableBase {
  readonly id: string;
  readonly entityId: string;
}
