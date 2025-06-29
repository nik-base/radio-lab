import { NgModule } from '@angular/core';
import { DBConfig, NgxIndexedDBModule } from 'ngx-indexed-db';

const calculatorDBConfig: DBConfig = {
  name: 'RadioCalculatorDataDB',
  version: 1,
  objectStoresMeta: [
    {
      store: 'calculators',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'name', keypath: 'name', options: { unique: false } },
        { name: 'sortOrder', keypath: 'sortOrder', options: { unique: false } },
        {
          name: 'description',
          keypath: 'description',
          options: { unique: false },
        },
        {
          name: 'decriptionHTML',
          keypath: 'descriptioHTML',
          options: { unique: false },
        },
        {
          name: 'decriptionJSON',
          keypath: 'descriptionJSON',
          options: { unique: false },
        },
        {
          name: 'initialQuestionId',
          keypath: 'initialQuestionId',
          options: { unique: false },
        },
      ],
    },
    {
      store: 'questions',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        {
          name: 'question',
          keypath: 'question',
          options: { unique: false },
        },
        {
          name: 'questionHTML',
          keypath: 'questionHTML',
          options: { unique: false },
        },
        {
          name: 'questionJSON',
          keypath: 'questionJSON',
          options: { unique: false },
        },
        {
          name: 'calculatorId',
          keypath: 'calculatorId',
          options: { unique: false },
        },
      ],
    },
    {
      store: 'answers',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        {
          name: 'answer',
          keypath: 'answer',
          options: { unique: false },
        },
        {
          name: 'answerHTML',
          keypath: 'answerHTML',
          options: { unique: false },
        },
        {
          name: 'answerJSON',
          keypath: 'answerJSON',
          options: { unique: false },
        },
        { name: 'score', keypath: 'score', options: { unique: false } },
        {
          name: 'nextQuestionId',
          keypath: 'nextQuestionId',
          options: { unique: false },
        },
        { name: 'outcomeId', keypath: 'outcomeId', options: { unique: false } },
        {
          name: 'questionId',
          keypath: 'questionId',
          options: { unique: false },
        },
      ],
    },
    {
      store: 'outcomes',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'result', keypath: 'result', options: { unique: false } },
        {
          name: 'recommendation',
          keypath: 'recommendation',
          options: { unique: false },
        },
        {
          name: 'recommendationHTML',
          keypath: 'recommendationHTML',
          options: { unique: false },
        },
        {
          name: 'recommendationJSON',
          keypath: 'recommendationJSON',
          options: { unique: false },
        },
        { name: 'minScore', keypath: 'minScore', options: { unique: false } },
        { name: 'maxScore', keypath: 'maxScore', options: { unique: false } },
        {
          name: 'calculatorId',
          keypath: 'calculatorId',
          options: { unique: false },
        },
      ],
    },
  ],
};

@NgModule({
  imports: [NgxIndexedDBModule.forRoot(calculatorDBConfig)],
})
export class CalculatorDBModule {}
