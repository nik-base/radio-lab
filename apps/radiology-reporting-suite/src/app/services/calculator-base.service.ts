import { Observable } from 'rxjs';

import {
  CalculatorAnswerCreateDto,
  CalculatorAnswerDto,
  CalculatorAnswerUpdateDto,
  CalculatorCreateDto,
  CalculatorDataDto,
  CalculatorDto,
  CalculatorExportDto,
  CalculatorImportDto,
  CalculatorOutcomeCreateDto,
  CalculatorOutcomeDto,
  CalculatorOutcomeUpdateDto,
  CalculatorQuestionCreateDto,
  CalculatorQuestionDto,
  CalculatorQuestionUpdateDto,
  CalculatorUpdateDto,
  SortOrderUpdateDto,
} from '@app/models/data';

export abstract class CalculatorBaseService {
  abstract fetchCalculators$(): Observable<CalculatorDto[]>;

  abstract createCalculator$(
    calculator: CalculatorCreateDto
  ): Observable<CalculatorDto>;

  abstract updateCalculator$(
    calculator: CalculatorUpdateDto
  ): Observable<CalculatorDto>;

  abstract deleteCalculator$(calculatorId: string): Observable<void>;

  abstract reorderCalculators$(
    sortOrderUpdateRequest: SortOrderUpdateDto
  ): Observable<void>;

  abstract fetchCalculator$(
    calculatorId: string
  ): Observable<CalculatorDataDto>;

  abstract exportCalculator$(
    calculatorId: string
  ): Observable<CalculatorExportDto>;

  abstract importCalculator$(
    calculator: CalculatorImportDto
  ): Observable<CalculatorDto>;

  abstract fetchQuestions$(
    calculatorId: string
  ): Observable<CalculatorQuestionDto[]>;

  abstract createQuestion$(
    question: CalculatorQuestionCreateDto
  ): Observable<CalculatorQuestionDto>;

  abstract updateQuestion$(
    question: CalculatorQuestionUpdateDto
  ): Observable<CalculatorQuestionDto>;

  abstract deleteQuestion$(questionId: string): Observable<void>;

  abstract fetchAnswers$(questionId: string): Observable<CalculatorAnswerDto[]>;

  abstract createAnswer$(
    answer: CalculatorAnswerCreateDto
  ): Observable<CalculatorAnswerDto>;

  abstract updateAnswer$(
    answer: CalculatorAnswerUpdateDto
  ): Observable<CalculatorAnswerDto>;

  abstract deleteAnswer$(answerId: string): Observable<void>;

  abstract fetchOutcomes$(
    calculatorId: string
  ): Observable<CalculatorOutcomeDto[]>;

  abstract createOutcome$(
    outcome: CalculatorOutcomeCreateDto
  ): Observable<CalculatorOutcomeDto>;

  abstract updateOutcome$(
    outcome: CalculatorOutcomeUpdateDto
  ): Observable<CalculatorOutcomeDto>;

  abstract deleteOutcome$(outcomeId: string): Observable<void>;
}
