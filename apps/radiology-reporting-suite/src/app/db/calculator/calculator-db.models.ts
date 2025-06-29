export interface CalculatorDBModel {
  readonly id: string;
  readonly name: string;
  readonly sortOrder: number;
  readonly description: string | null;
  readonly descriptionHTML: string | null;
  readonly descriptionJSON: string | null;
  readonly initialQuestionId: string | null;
}

export interface CalculatorQuestionDBModel {
  readonly id: string;
  readonly question: string;
  readonly questionHTML: string;
  readonly questionJSON: string;
  readonly calculatorId: string;
}

export interface CalculatorAnswerDBModel {
  readonly id: string;
  readonly answer: string;
  readonly answerHTML: string;
  readonly answerJSON: string;
  readonly questionId: string;
  readonly score: number;
  readonly nextQuestionId: string | null;
  readonly outcomeId: string | null;
}

export interface CalculatorOutcomeDBModel {
  readonly id: string;
  readonly result: string;
  readonly recommendation: string;
  readonly recommendationHTML: string;
  readonly recommendationJSON: string;
  readonly minScore: number | null;
  readonly maxScore: number | null;
  readonly calculatorId: string;
}
