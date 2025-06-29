import { inject, Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { map, Observable } from 'rxjs';

import {
  CalculatorAnswerCreateDto,
  CalculatorAnswerDto,
  CalculatorAnswerUpdateDto,
  CalculatorBaseDto,
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
  EditorContentDto,
  SortOrderUpdateDto,
} from '@app/models/data';
import { CalculatorBaseService } from '@app/services/calculator-base.service';

import { CalculatorDBModel } from './calculator-db.models';

@Injectable({ providedIn: 'root' })
export class CalculatorDBService extends CalculatorBaseService {
  private readonly dbService: NgxIndexedDBService = inject(NgxIndexedDBService);

  override fetchCalculators$(): Observable<CalculatorDto[]> {
    return this.dbService
      .getAll<CalculatorDBModel>('calculators')
      .pipe(
        map((calulators: CalculatorDBModel[]) =>
          calulators.map(
            (calulator: CalculatorDBModel): CalculatorDto =>
              this.mapCalculatorDBModelToDto(calulator)
          )
        )
      );
  }

  override createCalculator$(
    calculator: CalculatorCreateDto
  ): Observable<CalculatorDto> {
    const dbModel: CalculatorDBModel =
      this.mapCalculatorCreateDtoToDBModel(calculator);

    return this.createCalculatorInDb$(dbModel);
  }

  override updateCalculator$(
    calculator: CalculatorUpdateDto
  ): Observable<CalculatorDto> {
    throw new Error('Method not implemented.');
  }
  override deleteCalculator$(calculatorId: string): Observable<void> {
    throw new Error('Method not implemented.');
  }
  override reorderCalculators$(
    sortOrderUpdateRequest: SortOrderUpdateDto
  ): Observable<void> {
    throw new Error('Method not implemented.');
  }
  override fetchCalculator$(
    calculatorId: string
  ): Observable<CalculatorDataDto> {
    throw new Error('Method not implemented.');
  }
  override exportCalculator$(
    calculatorId: string
  ): Observable<CalculatorExportDto> {
    throw new Error('Method not implemented.');
  }
  override importCalculator$(
    calculator: CalculatorImportDto
  ): Observable<CalculatorDto> {
    throw new Error('Method not implemented.');
  }
  override fetchQuestions$(
    calculatorId: string
  ): Observable<CalculatorQuestionDto[]> {
    throw new Error('Method not implemented.');
  }
  override createQuestion$(
    question: CalculatorQuestionCreateDto
  ): Observable<CalculatorQuestionDto> {
    throw new Error('Method not implemented.');
  }
  override updateQuestion$(
    question: CalculatorQuestionUpdateDto
  ): Observable<CalculatorQuestionDto> {
    throw new Error('Method not implemented.');
  }
  override deleteQuestion$(questionId: string): Observable<void> {
    throw new Error('Method not implemented.');
  }
  override fetchAnswers$(
    questionId: string
  ): Observable<CalculatorAnswerDto[]> {
    throw new Error('Method not implemented.');
  }
  override createAnswer$(
    answer: CalculatorAnswerCreateDto
  ): Observable<CalculatorAnswerDto> {
    throw new Error('Method not implemented.');
  }
  override updateAnswer$(
    answer: CalculatorAnswerUpdateDto
  ): Observable<CalculatorAnswerDto> {
    throw new Error('Method not implemented.');
  }
  override deleteAnswer$(answerId: string): Observable<void> {
    throw new Error('Method not implemented.');
  }
  override fetchOutcomes$(
    calculatorId: string
  ): Observable<CalculatorOutcomeDto[]> {
    throw new Error('Method not implemented.');
  }
  override createOutcome$(
    outcome: CalculatorOutcomeCreateDto
  ): Observable<CalculatorOutcomeDto> {
    throw new Error('Method not implemented.');
  }
  override updateOutcome$(
    outcome: CalculatorOutcomeUpdateDto
  ): Observable<CalculatorOutcomeDto> {
    throw new Error('Method not implemented.');
  }
  override deleteOutcome$(outcomeId: string): Observable<void> {
    throw new Error('Method not implemented.');
  }

  private createCalculatorInDb$(
    dbModel: CalculatorDBModel
  ): Observable<CalculatorDto> {
    return this.dbService
      .add<CalculatorDBModel>('calculators', dbModel)
      .pipe(
        map(
          (data: CalculatorDBModel): CalculatorDto =>
            this.mapCalculatorDBModelToDto(data)
        )
      );
  }

  private mapCalculatorDBModelToDto(dbModel: CalculatorDBModel): CalculatorDto {
    return {
      ...this.mapCalculatorDBModelToBaseDto(dbModel),
      id: dbModel.id,
    };
  }

  private mapCalculatorCreateDtoToDBModel(
    dto: CalculatorCreateDto
  ): CalculatorDBModel {
    return {
      ...this.mapCalculatorBaseDtoToDBModel(dto),
      id: this.generateId(),
    };
  }

  private mapCalculatorBaseDtoToDBModel(
    dto: CalculatorBaseDto
  ): Omit<CalculatorDBModel, 'id'> {
    return {
      ...this.mapEditorContentToDescription(dto.description),
      name: dto.name,
      sortOrder: dto.sortOrder,
      initialQuestionId: dto.initialQuestionId,
    };
  }

  private mapCalculatorDBModelToBaseDto(
    dbModel: CalculatorDBModel
  ): CalculatorBaseDto {
    return {
      name: dbModel.name,
      sortOrder: dbModel.sortOrder,
      initialQuestionId: dbModel.initialQuestionId,
      description: this.mapDescriptionToEditorContent(dbModel),
    };
  }

  private mapEditorContentToDescription(
    editorContent: EditorContentDto | null
  ): Pick<
    CalculatorDBModel,
    'description' | 'descriptionHTML' | 'descriptionJSON'
  > {
    if (!editorContent) {
      return {
        description: null,
        descriptionHTML: null,
        descriptionJSON: null,
      };
    }

    return {
      description: editorContent.text,
      descriptionHTML: editorContent.html,
      descriptionJSON: editorContent.json,
    };
  }

  private mapDescriptionToEditorContent(
    dbModel: CalculatorDBModel
  ): EditorContentDto | null {
    if (!dbModel.descriptionHTML) {
      return null;
    }

    return {
      text: dbModel.description ?? '',
      html: dbModel.descriptionHTML ?? '',
      json: dbModel.descriptionJSON ?? '',
    };
  }

  private generateId(): string {
    return crypto.randomUUID();
  }
}
