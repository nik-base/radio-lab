import { CalculatorQuestionBase } from './calculator-question-base.interface';

export interface CalculatorQuestion extends CalculatorQuestionBase {
  readonly id: string;
}
