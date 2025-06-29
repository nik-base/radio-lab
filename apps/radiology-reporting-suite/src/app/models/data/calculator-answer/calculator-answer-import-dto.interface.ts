import { CalculatorOutcomeImportDto } from '../calculator-outcome/calculator-outcome-import-dto.interface';

import { CalculatorAnswerBaseDto } from './calculator-answer-base-dto.interface';

export interface CalculatorAnswerImportDto extends CalculatorAnswerBaseDto {
  readonly scopes: ReadonlyArray<CalculatorOutcomeImportDto>;
}
