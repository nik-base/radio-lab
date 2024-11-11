import { ScopeImportDto } from '../scope/scope-import-dto.interface';

import { TemplateBaseDto } from './template-base-dto.interface';

export interface TemplateImportDto extends TemplateBaseDto {
  readonly scopes: ScopeImportDto[];
}
