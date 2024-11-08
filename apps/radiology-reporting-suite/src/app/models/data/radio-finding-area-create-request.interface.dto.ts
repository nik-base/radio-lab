import { RadioFindingAreaBaseDto } from './radio-finding-area-base.interface.dto';

export interface RadioFindingAreaCreateRequestDto
  extends RadioFindingAreaBaseDto {
  readonly templateId: string;
}
