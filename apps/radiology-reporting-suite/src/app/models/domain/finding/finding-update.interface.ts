import { FindingBase } from './finding-base.interface';

export interface FindingUpdate extends FindingBase {
  readonly id: string;
  readonly scopeId: string;
}