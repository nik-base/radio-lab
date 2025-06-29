import { CalculatorOutcomeImportDto } from '../calculator-outcome/calculator-outcome-import-dto.interface';

import { CalculatorQuestionBaseDto } from './calculator-question-base-dto.interface';

export interface CalculatorQuestionImportDto extends CalculatorQuestionBaseDto {
  readonly scopes: ReadonlyArray<CalculatorOutcomeImportDto>;
}
