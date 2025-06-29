import { CalculatorQuestionExportDto } from '../calculator-question/calculator-question-export-dto.interface';

import { CalculatorDto } from './calculator-dto.interface';

export interface CalculatorExportDto extends CalculatorDto {
  readonly scopes: ReadonlyArray<CalculatorQuestionExportDto>;
}
