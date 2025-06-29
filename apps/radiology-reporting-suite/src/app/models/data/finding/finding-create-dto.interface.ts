import { FindingBaseDto } from './finding-base-dto.interface';

export interface FindingCreateDto extends FindingBaseDto {
  readonly scopeId: string;
  readonly groupId: string;
  readonly classifierId: string;
}
