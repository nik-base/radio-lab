import { CalculatorQuestionBase } from './calculator-question-base.interface';

export interface CalculatorQuestionUpdate extends CalculatorQuestionBase {
  readonly id: string;
}
