import { CalculatorOutcomeBaseDto } from './calculator-outcome-base-dto.interface';

export interface CalculatorOutcomeUpdateDto extends CalculatorOutcomeBaseDto {
  readonly id: string;
}
