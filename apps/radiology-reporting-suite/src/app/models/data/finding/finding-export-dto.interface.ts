import { VariableExportDto } from '../variable/variable-export-dto.interface';

import { FindingDto } from './finding-dto.interface';

export interface FindingExportDto extends FindingDto {
  readonly variables: ReadonlyArray<VariableExportDto>;
}
