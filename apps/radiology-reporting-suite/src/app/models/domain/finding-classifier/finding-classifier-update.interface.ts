import { FindingClassifierBase } from './finding-classifier-base.interface';

export interface FindingClassifierUpdate extends FindingClassifierBase {
  readonly id: string;
  readonly scopeId: string;
  readonly groupId: string;
}
