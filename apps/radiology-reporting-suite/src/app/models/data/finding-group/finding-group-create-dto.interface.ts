import { FindingGroupBaseDto } from './finding-group-base-dto.interface';

export interface FindingGroupCreateDto extends FindingGroupBaseDto {
  readonly scopeId: string;
}
