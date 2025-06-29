import { CalculatorOutcomeExport } from '../calculator-outcome/calculator-outcome-export.interface';

import { CalculatorQuestion } from './calculator-question.interface';

export interface CalculatorQuestionExport extends CalculatorQuestion {
  readonly scopes: ReadonlyArray<CalculatorOutcomeExport>;
}
