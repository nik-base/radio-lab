import { CalculatorOutcomeDataDto } from '../calculator-outcome/calculator-outcome-data-dto.interface';

import { CalculatorQuestionDto } from './calculator-question-dto.interface';

export interface CalculatorQuestionDataDto extends CalculatorQuestionDto {
  readonly scopes: ReadonlyArray<CalculatorOutcomeDataDto>;
}
