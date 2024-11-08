import { RadioFindingDetailsBaseDto } from './radio-finding-details-base.interface.dto';

export interface RadioFindingDetailsCreateRequestDto
  extends RadioFindingDetailsBaseDto {
  readonly findingAreaId: string;
}
