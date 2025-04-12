import { FindingBaseDto } from './finding-base-dto.interface';

export interface FindingDataDto extends FindingBaseDto {
  readonly group?: string;
  readonly classifier?: string;
}
