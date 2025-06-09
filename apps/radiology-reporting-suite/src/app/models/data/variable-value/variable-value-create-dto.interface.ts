import { VariableValueBaseDto } from './variable-value-base-dto.interface';

export interface VariableValueCreateDto extends VariableValueBaseDto {
  readonly variableId: string;
}
