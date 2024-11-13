import { ScopeBase } from './scope-base.interface';

export interface ScopeCreate extends ScopeBase {
  readonly templateId: string;
}
