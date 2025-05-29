import { FindingData, ScopeData } from '../domain';

export interface EditorFindingData {
  readonly scope: ScopeData;
  readonly scopeIndex: number;
  readonly finding: FindingData;
}
