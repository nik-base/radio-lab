import { CalculatorOutcomeBase } from './calculator-outcome-base.interface';

export interface CalculatorOutcome extends CalculatorOutcomeBase {
  readonly id: string;
}
