import { CalculatorOutcomeData } from '../calculator-outcome/calculator-outcome-data.interface';

import { CalculatorQuestion } from './calculator-question.interface';

export interface CalculatorQuestionData extends CalculatorQuestion {
  readonly scopes: ReadonlyArray<CalculatorOutcomeData>;
}
