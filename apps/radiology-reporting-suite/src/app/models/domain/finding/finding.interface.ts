import { FindingBase } from './finding-base.interface';

export interface Finding extends FindingBase {
  readonly id: string;
  readonly scopeId: string;
  readonly groupId: string;
  readonly classifierId: string;
}
