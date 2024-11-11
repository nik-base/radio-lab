import { FindingBaseDto } from './finding-base-dto.interface';

export interface FindingUpdateDto extends FindingBaseDto {
  readonly id: string;
  readonly scopeId: string;
}
