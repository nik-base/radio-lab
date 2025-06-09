import { VariableValueBaseDto } from './variable-value-base-dto.interface';

export interface VariableValueUpdateDto extends VariableValueBaseDto {
  readonly id: string;
  readonly variableId: string;
}
