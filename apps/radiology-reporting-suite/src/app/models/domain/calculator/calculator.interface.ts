import { CalculatorBase } from './calculator-base.interface';

export interface Calculator extends CalculatorBase {
  readonly id: string;
}
