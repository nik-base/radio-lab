import { CalculatorQuestionDataDto } from '../calculator-question/calculator-question-data-dto.interface';

import { CalculatorDto } from './calculator-dto.interface';

export interface CalculatorDataDto extends CalculatorDto {
  readonly scopes: ReadonlyArray<CalculatorQuestionDataDto>;
}
