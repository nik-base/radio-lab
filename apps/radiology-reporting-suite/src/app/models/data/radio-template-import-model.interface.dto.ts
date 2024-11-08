import { RadioFindingAreaImportModelDto } from './radio-finding-area-import-model.interface.dto';
import { RadioTemplateBaseDto } from './radio-template-base.interface.dto';

export interface RadioTemplateImportModelDto extends RadioTemplateBaseDto {
  readonly findingAreas: RadioFindingAreaImportModelDto[];
}
