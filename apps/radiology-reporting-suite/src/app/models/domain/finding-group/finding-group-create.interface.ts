import { FindingGroupBase } from './finding-group-base.interface';

export interface FindingGroupCreate extends FindingGroupBase {
  readonly scopeId: string;
}
