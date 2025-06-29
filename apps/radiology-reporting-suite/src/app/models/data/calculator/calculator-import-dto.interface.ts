import { CalculatorQuestionImportDto } from '../calculator-question/calculator-question-import-dto.interface';

import { CalculatorBaseDto } from './calculator-base-dto.interface';

export interface CalculatorImportDto extends CalculatorBaseDto {
  readonly scopes: ReadonlyArray<CalculatorQuestionImportDto>;
}
