import { CalculatorAnswerBaseDto } from './calculator-answer-base-dto.interface';

export interface CalculatorAnswerUpdateDto extends CalculatorAnswerBaseDto {
  readonly id: string;
}
