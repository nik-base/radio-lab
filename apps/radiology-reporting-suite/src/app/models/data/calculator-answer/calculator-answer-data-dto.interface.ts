import { CalculatorOutcomeDataDto } from '../calculator-outcome/calculator-outcome-data-dto.interface';

import { CalculatorAnswerDto } from './calculator-answer-dto.interface';

export interface CalculatorAnswerDataDto extends CalculatorAnswerDto {
  readonly scopes: ReadonlyArray<CalculatorOutcomeDataDto>;
}
