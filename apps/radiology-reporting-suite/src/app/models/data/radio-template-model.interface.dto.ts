import { RadioFindingAreaModelDto } from './radio-finding-area-model.interface.dto';
import { RadioTemplateDto } from './radio-template.interface.dto';

export interface RadioTemplateModelDto extends RadioTemplateDto {
  readonly findingAreas: RadioFindingAreaModelDto[];
}
