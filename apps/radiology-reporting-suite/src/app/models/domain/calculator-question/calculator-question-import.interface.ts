import { CalculatorOutcomeImport } from '../calculator-outcome/calculator-outcome-import.interface';

import { CalculatorQuestionBase } from './calculator-question-base.interface';

export interface CalculatorQuestionImport extends CalculatorQuestionBase {
  readonly scopes: ReadonlyArray<CalculatorOutcomeImport>;
}
