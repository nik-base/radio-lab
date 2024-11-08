import { RadioFindingDetailsBaseDto } from './radio-finding-details-base.interface.dto';

export interface RadioFindingDetailsDto extends RadioFindingDetailsBaseDto {
  readonly id: string;
  readonly findingAreaId: string;
}
