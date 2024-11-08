import { RadioFindingAreaDto } from './radio-finding-area.interface.dto';
import { RadioFindingDetailsDto } from './radio-finding-details.interface.dto';

export interface RadioFindingAreaModelDto extends RadioFindingAreaDto {
  readonly findingDetails: RadioFindingDetailsDto[];
}
