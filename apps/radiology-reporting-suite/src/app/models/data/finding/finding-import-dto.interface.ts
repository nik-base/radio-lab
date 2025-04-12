import { FindingDto } from './finding-dto.interface';

export interface FindingDataDto extends FindingDto {
  readonly group: string;
  readonly classifier: string;
}
