import { CalculatorOutcomeImport } from '../calculator-outcome/calculator-outcome-import.interface';

import { CalculatorAnswerBase } from './calculator-answer-base.interface';

export interface CalculatorAnswerImport extends CalculatorAnswerBase {
  readonly scopes: ReadonlyArray<CalculatorOutcomeImport>;
}
