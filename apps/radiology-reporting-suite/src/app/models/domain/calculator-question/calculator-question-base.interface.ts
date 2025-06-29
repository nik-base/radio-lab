import { EditorContent } from '../editor-content.interface';

export interface CalculatorQuestionBase {
  readonly question: EditorContent;
  readonly calculatorId: string;
}
