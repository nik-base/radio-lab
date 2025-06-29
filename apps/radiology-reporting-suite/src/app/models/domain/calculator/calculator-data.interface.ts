import { CalculatorQuestionData } from '../calculator-question/calculator-question-data.interface';

import { Calculator } from './calculator.interface';

export interface CalculatorData extends Calculator {
  readonly scopes: ReadonlyArray<CalculatorQuestionData>;
}
