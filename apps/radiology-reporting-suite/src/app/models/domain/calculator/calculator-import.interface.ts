import { CalculatorQuestionImport } from '../calculator-question/calculator-question-import.interface';

import { CalculatorBase } from './calculator-base.interface';

export interface CalculatorImport extends CalculatorBase {
  readonly scopes: ReadonlyArray<CalculatorQuestionImport>;
}
