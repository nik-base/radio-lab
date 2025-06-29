import { CalculatorAnswerBaseDto } from './calculator-answer-base-dto.interface';

export interface CalculatorAnswerDto extends CalculatorAnswerBaseDto {
  readonly id: string;
}
