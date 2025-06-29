import { CalculatorQuestionBaseDto } from './calculator-question-base-dto.interface';

export interface CalculatorQuestionUpdateDto extends CalculatorQuestionBaseDto {
  readonly id: string;
}
