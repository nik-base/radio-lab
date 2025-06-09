import { ScopeExportDto } from '../scope/scope-export-dto.interface';

import { TemplateDto } from './template-dto.interface';

export interface TemplateExportDto extends TemplateDto {
  readonly scopes: ReadonlyArray<ScopeExportDto>;
}
