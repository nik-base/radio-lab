import { RadioFindingDetailsBaseDto } from './radio-finding-details-base.interface.dto';

export interface RadioFindingDetailsUpdateRequestDto
  extends RadioFindingDetailsBaseDto {
  readonly id: string;
  readonly findingAreaId: string;
}
