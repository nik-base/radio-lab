import { RadioFindingAreaBaseDto } from './radio-finding-area-base.interface.dto';
import { RadioFindingDetailsBaseDto } from './radio-finding-details-base.interface.dto';

export interface RadioFindingAreaImportModelDto
  extends RadioFindingAreaBaseDto {
  readonly findingDetails: RadioFindingDetailsBaseDto[];
}
