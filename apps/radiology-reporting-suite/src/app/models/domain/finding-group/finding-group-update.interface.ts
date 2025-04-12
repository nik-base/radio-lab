import { FindingGroupBase } from './finding-group-base.interface';

export interface FindingGroupUpdate extends FindingGroupBase {
  readonly id: string;
  readonly scopeId: string;
}
