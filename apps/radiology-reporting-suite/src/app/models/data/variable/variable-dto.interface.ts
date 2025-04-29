import { VariableBaseDto } from './variable-base-dto.interface';

export interface VariableDto extends VariableBaseDto {
  readonly id: string;
  readonly entityId: string;
}
