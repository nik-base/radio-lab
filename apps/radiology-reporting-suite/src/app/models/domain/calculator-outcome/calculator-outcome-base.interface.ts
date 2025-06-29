import { EditorContent } from '../editor-content.interface';

export interface CalculatorOutcomeBase {
  readonly result: string;
  readonly recommendation: EditorContent;
  readonly minScore: number;
  readonly maxScore: number;
  readonly calculatorId: string;
}
