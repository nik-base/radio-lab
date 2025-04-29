import { VariableValueBaseDto } from './variable-value-base-dto.interface';

export interface VariableValueDto extends VariableValueBaseDto {
  readonly id: string;
  readonly variableId: string;
}
