import { VariableImportDto } from '../variable/variable-import-dto.interface';

import { FindingBaseDto } from './finding-base-dto.interface';

export interface FindingImportDto extends FindingBaseDto {
  readonly variables: ReadonlyArray<VariableImportDto>;
}
