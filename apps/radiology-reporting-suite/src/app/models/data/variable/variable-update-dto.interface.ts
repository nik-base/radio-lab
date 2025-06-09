import { VariableBaseDto } from './variable-base-dto.interface';

export interface VariableUpdateDto extends VariableBaseDto {
  readonly id: string;
  readonly entityId: string;
}
