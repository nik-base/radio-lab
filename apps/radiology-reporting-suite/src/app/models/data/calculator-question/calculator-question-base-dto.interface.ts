import { EditorContentDto } from '../editor-content-dto.interface';

export interface CalculatorQuestionBaseDto {
  readonly question: EditorContentDto;
  readonly calculatorId: string;
}
