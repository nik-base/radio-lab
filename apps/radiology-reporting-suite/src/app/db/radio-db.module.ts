import { NgModule } from '@angular/core';
import { DBConfig, NgxIndexedDBModule } from 'ngx-indexed-db';

const radioDbConfig: DBConfig = {
  name: 'RadioReportDB',
  version: 2,
  objectStoresMeta: [
    {
      store: 'templates',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'name', keypath: 'name', options: { unique: false } },
        {
          name: 'decription',
          keypath: 'protocol.text',
          options: { unique: false },
        },
        {
          name: 'decriptionHTML',
          keypath: 'protocol.html',
          options: { unique: false },
        },
        {
          name: 'decriptionJSON',
          keypath: 'protocol.json',
          options: { unique: false },
        },
        {
          name: 'patientInfo',
          keypath: 'patientInfo.text',
          options: { unique: false },
        },
        {
          name: 'patientInfoHTML',
          keypath: 'patientInfo.html',
          options: { unique: false },
        },
        {
          name: 'patientInfoJSON',
          keypath: 'patientInfo.json',
          options: { unique: false },
        },
      ],
    },
    {
      store: 'protocols',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'name', keypath: 'name', options: { unique: false } },
        { name: 'order', keypath: 'sortOrder', options: { unique: false } },
        {
          name: 'templateId',
          keypath: 'templateId',
          options: { unique: false },
        },
      ],
    },
    {
      store: 'findings',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'title', keypath: 'title', options: { unique: false } },
        { name: 'group', keypath: 'group', options: { unique: false } },
        { name: 'order', keypath: 'sortOrder', options: { unique: false } },
        {
          name: 'protocolId',
          keypath: 'findingAreaId',
          options: { unique: false },
        },
        {
          name: 'decription',
          keypath: 'decription.text',
          options: { unique: false },
        },
        {
          name: 'decriptionHTML',
          keypath: 'decription.html',
          options: { unique: false },
        },
        {
          name: 'decriptionJSON',
          keypath: 'decription.json',
          options: { unique: false },
        },
        {
          name: 'impression',
          keypath: 'impression.text',
          options: { unique: false },
        },
        {
          name: 'impressionHTML',
          keypath: 'impression.html',
          options: { unique: false },
        },
        {
          name: 'impressionJSON',
          keypath: 'impression.json',
          options: { unique: false },
        },
        {
          name: 'recommendation',
          keypath: 'recommendation.text',
          options: { unique: false },
        },
        {
          name: 'recommendationHTML',
          keypath: 'recommendation.html',
          options: { unique: false },
        },
        {
          name: 'recommendationJSON',
          keypath: 'recommendation.json',
          options: { unique: false },
        },
        {
          name: 'isNormal',
          keypath: 'isNormal',
          options: { unique: false },
        },
      ],
    },
  ],
};

@NgModule({
  imports: [NgxIndexedDBModule.forRoot(radioDbConfig)],
})
export class RadioDBModule {}
