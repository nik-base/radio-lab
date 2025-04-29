import { VariableValueImportDto } from '../variable-value/variable-value-import-dto.interface';

import { VariableBaseDto } from './variable-base-dto.interface';

export interface VariableImportDto extends VariableBaseDto {
  readonly variableValues: ReadonlyArray<VariableValueImportDto>;
}
