import { FindingClassifierBaseDto } from './finding-classifier-base-dto.interface';

export interface FindingClassifierCreateDto extends FindingClassifierBaseDto {
  readonly scopeId: string;
  readonly groupId: string;
}
