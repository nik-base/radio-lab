import { NgModule } from '@angular/core';
import { DBConfig, NgxIndexedDBModule } from 'ngx-indexed-db';

const reportDBConfig: DBConfig = {
  name: 'RadioReportDataDB',
  version: 2,
  objectStoresMeta: [
    {
      store: 'templates',
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
      store: 'scopes',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'name', keypath: 'name', options: { unique: false } },
        { name: 'sortOrder', keypath: 'sortOrder', options: { unique: false } },
        {
          name: 'templateId',
          keypath: 'templateId',
          options: { unique: false },
        },
      ],
    },
    {
      store: 'findingGroups',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'name', keypath: 'name', options: { unique: false } },
        { name: 'sortOrder', keypath: 'sortOrder', options: { unique: false } },
        { name: 'isDefault', keypath: 'isDefault', options: { unique: false } },
        {
          name: 'scopeId',
          keypath: 'scopeId',
          options: { unique: false },
        },
        {
          name: 'info',
          keypath: 'info',
          options: { unique: false },
        },
        {
          name: 'infoHTML',
          keypath: 'infoHTML',
          options: { unique: false },
        },
        {
          name: 'infoJSON',
          keypath: 'infoJSON',
          options: { unique: false },
        },
      ],
    },
    {
      store: 'findingClassifiers',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'name', keypath: 'name', options: { unique: false } },
        { name: 'sortOrder', keypath: 'sortOrder', options: { unique: false } },
        { name: 'isDefault', keypath: 'isDefault', options: { unique: false } },
        {
          name: 'scopeId',
          keypath: 'scopeId',
          options: { unique: false },
        },
        {
          name: 'groupId',
          keypath: 'groupId',
          options: { unique: false },
        },
        {
          name: 'info',
          keypath: 'info',
          options: { unique: false },
        },
        {
          name: 'infoHTML',
          keypath: 'infoHTML',
          options: { unique: false },
        },
        {
          name: 'infoJSON',
          keypath: 'infoJSON',
          options: { unique: false },
        },
      ],
    },
    {
      store: 'findings',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'name', keypath: 'name', options: { unique: false } },
        { name: 'sortOrder', keypath: 'sortOrder', options: { unique: false } },
        { name: 'groupId', keypath: 'groupId', options: { unique: false } },
        {
          name: 'classifierId',
          keypath: 'classifierId',
          options: { unique: false },
        },
        {
          name: 'scopeId',
          keypath: 'scopeId',
          options: { unique: false },
        },
        {
          name: 'description',
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
        {
          name: 'info',
          keypath: 'info',
          options: { unique: false },
        },
        {
          name: 'infoHTML',
          keypath: 'infoHTML',
          options: { unique: false },
        },
        {
          name: 'infoJSON',
          keypath: 'infoJSON',
          options: { unique: false },
        },
      ],
    },
    {
      store: 'variables',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'name', keypath: 'name', options: { unique: false } },
        { name: 'type', keypath: 'type', options: { unique: false } },
        { name: 'source', keypath: 'source', options: { unique: false } },
        { name: 'entityId', keypath: 'entityId', options: { unique: false } },
        { name: 'sortOrder', keypath: 'sortOrder', options: { unique: false } },
      ],
    },
    {
      store: 'variableValues',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'name', keypath: 'name', options: { unique: false } },
        { name: 'sortOrder', keypath: 'sortOrder', options: { unique: false } },
        {
          name: 'variableId',
          keypath: 'variableId',
          options: { unique: false },
        },
      ],
    },
  ],
};

@NgModule({
  imports: [NgxIndexedDBModule.forRoot(reportDBConfig)],
})
export class ReportDBModule {}
