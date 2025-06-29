import { EditorContent } from '../editor-content.interface';

export interface CalculatorBase {
  readonly name: string;
  readonly sortOrder: number;
  readonly description: EditorContent | null;
  readonly initialQuestionId: string | null;
}
