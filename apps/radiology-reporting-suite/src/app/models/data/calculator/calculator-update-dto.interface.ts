import { CalculatorBaseDto } from './calculator-base-dto.interface';

export interface CalculatorUpdateDto extends CalculatorBaseDto {
  readonly id: string;
}
