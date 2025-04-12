import { FindingClassifierBaseDto } from './finding-classifier-base-dto.interface';

export interface FindingClassifierUpdateDto extends FindingClassifierBaseDto {
  readonly id: string;
  readonly scopeId: string;
  readonly groupId: string;
}
