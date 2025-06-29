import { CalculatorQuestionExport } from '../calculator-question/calculator-question-export.interface';

import { Calculator } from './calculator.interface';

export interface CalculatorExport extends Calculator {
  readonly scopes: ReadonlyArray<CalculatorQuestionExport>;
}
