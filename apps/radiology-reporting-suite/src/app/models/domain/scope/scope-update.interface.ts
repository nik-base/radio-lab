import { ScopeBase } from './scope-base.interface';

export interface ScopeUpdate extends ScopeBase {
  readonly id: string;
  readonly templateId: string;
}
