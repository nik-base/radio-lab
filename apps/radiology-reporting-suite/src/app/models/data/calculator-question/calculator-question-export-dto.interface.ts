import { CalculatorOutcomeExportDto } from '../calculator-outcome/calculator-outcome-export-dto.interface';

import { CalculatorQuestionDto } from './calculator-question-dto.interface';

export interface CalculatorQuestionExportDto extends CalculatorQuestionDto {
  readonly scopes: ReadonlyArray<CalculatorOutcomeExportDto>;
}
