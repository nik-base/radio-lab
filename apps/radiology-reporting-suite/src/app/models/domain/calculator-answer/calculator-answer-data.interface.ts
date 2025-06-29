import { CalculatorOutcomeData } from '../calculator-outcome/calculator-outcome-data.interface';

import { CalculatorAnswer } from './calculator-answer.interface';

export interface CalculatorAnswerData extends CalculatorAnswer {
  readonly scopes: ReadonlyArray<CalculatorOutcomeData>;
}
