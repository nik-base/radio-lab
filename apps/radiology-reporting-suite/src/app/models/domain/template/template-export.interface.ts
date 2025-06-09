import { ScopeExport } from '../scope/scope-export.interface';

import { Template } from './template.interface';

export interface TemplateExport extends Template {
  readonly scopes: ReadonlyArray<ScopeExport>;
}
