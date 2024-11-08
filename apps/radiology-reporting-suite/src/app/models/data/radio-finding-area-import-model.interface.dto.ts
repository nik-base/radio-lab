import { RadioFindingAreaBaseDto } from './radio-finding-area-base.interface.dto';
import { RadioTemplateBaseDto } from './radio-template-base.interface.dto';

export interface RadioFindingAreaImportModelDto
  extends RadioFindingAreaBaseDto {
  readonly findingDetails: RadioTemplateBaseDto[];
}
