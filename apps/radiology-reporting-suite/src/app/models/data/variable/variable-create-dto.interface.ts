import { VariableBaseDto } from './variable-base-dto.interface';

export interface VariableCreateDto extends VariableBaseDto {
  readonly entityId: string;
}
