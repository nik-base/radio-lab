import { CalculatorBaseDto } from './calculator-base-dto.interface';

export interface CalculatorDto extends CalculatorBaseDto {
  readonly id: string;
}
