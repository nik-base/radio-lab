import { CalculatorOutcomeExport } from '../calculator-outcome/calculator-outcome-export.interface';

import { CalculatorAnswer } from './calculator-answer.interface';

export interface CalculatorAnswerExport extends CalculatorAnswer {
  readonly scopes: ReadonlyArray<CalculatorOutcomeExport>;
}
