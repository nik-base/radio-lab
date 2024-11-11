import { FindingBaseDto } from './finding-base-dto.interface';

export interface FindingDto extends FindingBaseDto {
  readonly id: string;
  readonly scopeId: string;
}
