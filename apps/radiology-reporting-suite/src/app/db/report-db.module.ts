import { NgModule } from '@angular/core';
import { DBConfig, NgxIndexedDBModule } from 'ngx-indexed-db';

const reportDBConfig: DBConfig = {
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
          keypath: 'description',
          options: { unique: false },
        },
        {
          name: 'decriptionHTML',
          keypath: 'descriptioHTMLn',
          options: { unique: false },
        },
        {
          name: 'decriptionJSON',
          keypath: 'descriptionJSON',
          options: { unique: false },
        },
        {
          name: 'patientInfo',
          keypath: 'patientInfo',
          options: { unique: false },
        },
        {
          name: 'patientInfoHTML',
          keypath: 'patientInfoHTML',
          options: { unique: false },
        },
        {
          name: 'patientInfoJSON',
          keypath: 'patientInfoJSON',
          options: { unique: false },
        },
      ],
    },
    {
      store: 'protocols',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'name', keypath: 'name', options: { unique: false } },
        { name: 'order', keypath: 'order', options: { unique: false } },
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
        { name: 'order', keypath: 'order', options: { unique: false } },
        {
          name: 'protocolId',
          keypath: 'protocolId',
          options: { unique: false },
        },
        {
          name: 'decription',
          keypath: 'description',
          options: { unique: false },
        },
        {
          name: 'decriptionHTML',
          keypath: 'descriptionHTML',
          options: { unique: false },
        },
        {
          name: 'decriptionJSON',
          keypath: 'descriptionJSON',
          options: { unique: false },
        },
        {
          name: 'impression',
          keypath: 'impression',
          options: { unique: false },
        },
        {
          name: 'impressionHTML',
          keypath: 'impressionHTML',
          options: { unique: false },
        },
        {
          name: 'impressionJSON',
          keypath: 'impressionJSON',
          options: { unique: false },
        },
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
  imports: [NgxIndexedDBModule.forRoot(reportDBConfig)],
})
export class RadioDBModule {}
