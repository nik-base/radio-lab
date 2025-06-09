import { VariableValueExportDto } from '../variable-value/variable-value-export-dto.interface';

import { VariableDto } from './variable-dto.interface';

export interface VariableExportDto extends VariableDto {
  readonly variableValues: ReadonlyArray<VariableValueExportDto>;
}
