import { FindingGroupBase } from './finding-group-base.interface';

export interface FindingGroup extends FindingGroupBase {
  readonly id: string;
  readonly scopeId: string;
}
