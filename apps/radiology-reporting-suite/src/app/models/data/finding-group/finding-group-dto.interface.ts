import { FindingGroupBaseDto } from './finding-group-base-dto.interface';

export interface FindingGroupDto extends FindingGroupBaseDto {
  readonly id: string;
  readonly scopeId: string;
}
