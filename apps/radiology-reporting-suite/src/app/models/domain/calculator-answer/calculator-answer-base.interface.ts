import { EditorContent } from '../editor-content.interface';

export interface CalculatorAnswerBase {
  readonly answer: EditorContent;
  readonly questionId: string;
  readonly score: number;
  readonly nextQuestionId: string | null;
  readonly outcomeId: string | null;
}
