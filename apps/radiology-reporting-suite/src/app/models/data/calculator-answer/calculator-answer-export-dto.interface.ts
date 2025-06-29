import { CalculatorOutcomeExportDto } from '../calculator-outcome/calculator-outcome-export-dto.interface';

import { CalculatorAnswerDto } from './calculator-answer-dto.interface';

export interface CalculatorAnswerExportDto extends CalculatorAnswerDto {
  readonly scopes: ReadonlyArray<CalculatorOutcomeExportDto>;
}
