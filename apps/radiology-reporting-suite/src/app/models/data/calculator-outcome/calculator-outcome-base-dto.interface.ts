import { EditorContentDto } from '../editor-content-dto.interface';

export interface CalculatorOutcomeBaseDto {
  readonly result: string;
  readonly recommendation: EditorContentDto;
  readonly minScore: number;
  readonly maxScore: number;
  readonly calculatorId: string;
}
