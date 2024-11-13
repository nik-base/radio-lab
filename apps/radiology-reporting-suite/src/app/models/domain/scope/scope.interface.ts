import { ScopeBase } from './scope-base.interface';

export interface Scope extends ScopeBase {
  readonly id: string;
  readonly templateId: string;
}
