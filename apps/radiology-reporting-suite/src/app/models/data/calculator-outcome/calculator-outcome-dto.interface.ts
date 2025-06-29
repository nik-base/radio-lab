import { CalculatorOutcomeBaseDto } from './calculator-outcome-base-dto.interface';

export interface CalculatorOutcomeDto extends CalculatorOutcomeBaseDto {
  readonly id: string;
}
