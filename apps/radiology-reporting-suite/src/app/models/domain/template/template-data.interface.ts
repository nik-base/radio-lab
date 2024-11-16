import { ScopeData } from '../scope/scope-data.interface';

import { Template } from './template.interface';

export interface TemplateData extends Template {
  readonly scopes: ScopeData[];
}
