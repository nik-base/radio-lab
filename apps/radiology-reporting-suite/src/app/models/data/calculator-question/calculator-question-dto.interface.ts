import { CalculatorQuestionBaseDto } from './calculator-question-base-dto.interface';

export interface CalculatorQuestionDto extends CalculatorQuestionBaseDto {
  readonly id: string;
}
