import { CalculatorOutcomeBase } from './calculator-outcome-base.interface';

export interface CalculatorOutcomeUpdate extends CalculatorOutcomeBase {
  readonly id: string;
}
