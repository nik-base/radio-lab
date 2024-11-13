import { ScopeImport } from '../scope/scope-import.interface';

import { TemplateBase } from './template-base.interface';

export interface TemplateImport extends TemplateBase {
  readonly scopes: ReadonlyArray<ScopeImport>;
}
