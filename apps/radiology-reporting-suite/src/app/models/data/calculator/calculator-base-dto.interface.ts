import { EditorContentDto } from '../editor-content-dto.interface';

export interface CalculatorBaseDto {
  readonly name: string;
  readonly sortOrder: number;
  readonly description: EditorContentDto | null;
  readonly initialQuestionId: string | null;
}
