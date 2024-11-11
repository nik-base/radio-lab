import { ScopeDataDto } from '../scope/scope-data-dto.interface';

import { TemplateDto } from './template-dto.interface';

export interface TemplateDataDto extends TemplateDto {
  readonly scopes: ScopeDataDto[];
}
