import { CalculatorAnswerBase } from './calculator-answer-base.interface';

export interface CalculatorAnswer extends CalculatorAnswerBase {
  readonly id: string;
}
