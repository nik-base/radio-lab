import { FindingGroupBaseDto } from './finding-group-base-dto.interface';

export interface FindingGroupUpdateDto extends FindingGroupBaseDto {
  readonly id: string;
  readonly scopeId: string;
}
