import { EditorContentDto } from '../editor-content-dto.interface';

export interface CalculatorAnswerBaseDto {
  readonly answer: EditorContentDto;
  readonly questionId: string;
  readonly score: number;
  readonly nextQuestionId: string | null;
  readonly outcomeId: string | null;
}
