import { CalculatorAnswerBase } from './calculator-answer-base.interface';

export interface CalculatorAnswerUpdate extends CalculatorAnswerBase {
  readonly id: string;
}
