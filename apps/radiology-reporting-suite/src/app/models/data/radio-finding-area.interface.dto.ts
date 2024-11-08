import { RadioFindingAreaBaseDto } from './radio-finding-area-base.interface.dto';

export interface RadioFindingAreaDto extends RadioFindingAreaBaseDto {
  readonly id: string;
  readonly templateId: string;
}
