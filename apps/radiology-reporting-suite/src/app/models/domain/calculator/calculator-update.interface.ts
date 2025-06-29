import { CalculatorBase } from './calculator-base.interface';

export interface CalculatorUpdate extends CalculatorBase {
  readonly id: string;
}
