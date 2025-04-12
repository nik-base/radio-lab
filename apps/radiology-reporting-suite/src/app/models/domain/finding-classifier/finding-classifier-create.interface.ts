import { FindingClassifierBase } from './finding-classifier-base.interface';

export interface FindingClassifierCreate extends FindingClassifierBase {
  readonly scopeId: string;
  readonly groupId: string;
}
