import { FindingBase } from './finding-base.interface';

export interface FindingCreate extends FindingBase {
  readonly scopeId: string;
  readonly groupId: string;
  readonly classifierId: string;
}
