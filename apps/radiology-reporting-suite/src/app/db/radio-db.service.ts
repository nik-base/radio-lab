/* eslint-disable @typescript-eslint/no-unused-vars */
import { inject, Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { map, Observable } from 'rxjs';

import {
  RadioFindingAreaCreateRequestDto,
  RadioFindingAreaDto,
  RadioFindingAreaUpdateRequestDto,
  RadioFindingDetailsCreateRequestDto,
  RadioFindingDetailsDto,
  RadioFindingDetailsUpdateRequestDto,
  RadioSortOrderUpdateRequestDto,
  RadioTemplateCreateRequestDto,
  RadioTemplateDto,
  RadioTemplateImportModelDto,
  RadioTemplateModelDto,
  RadioTemplateUpdateRequestDto,
} from '../models/data';

import {
  RadioFindingAreaDBModel,
  RadioTemplateDBModel,
} from './radio-db.models';

@Injectable()
export class RadioDBService {
  private readonly radioDBService: NgxIndexedDBService =
    inject(NgxIndexedDBService);

  fetchTemplates$(): Observable<RadioTemplateDto[]> {
    return this.radioDBService.getAll<RadioTemplateDBModel>('templates').pipe(
      map((templates: RadioTemplateDBModel[]) =>
        templates.map(
          (template: RadioTemplateDBModel): RadioTemplateDto => ({
            id: template.id,
            name: template.name,
            protocol: {
              text: template.description ?? '',
              html: template.decriptionHTML ?? '',
              json: template.decriptionJSON ?? '',
            },
            patientInfo: {
              text: template.patientInfo ?? '',
              html: template.patientInfoHTML ?? '',
              json: template.patientInfoJSON ?? '',
            },
          })
        )
      )
    );
  }

  fetchFindingAreas$(templateId: string): Observable<RadioFindingAreaDto[]> {
    return this.radioDBService
      .getAllByIndex<RadioFindingAreaDBModel>(
        'protocols',
        'templateId',
        IDBKeyRange.only(templateId)
      )
      .pipe(
        map((protocols: RadioFindingAreaDBModel[]) => {
          return protocols.map(
            (protocol: RadioFindingAreaDBModel): RadioFindingAreaDto => ({
              id: protocol.id,
              name: protocol.name,
              sortOrder: protocol.order,
              templateId: protocol.templateId,
            })
          );
        })
      );
  }

  fetchFindingDetails$(
    findingAreaId: string
  ): Observable<RadioFindingDetailsDto[]> {
    throw new Error('Method not implemented.');
  }

  createTemplate$(
    temlate: RadioTemplateCreateRequestDto
  ): Observable<RadioTemplateDto> {
    throw new Error('Method not implemented.');
  }

  createFindingArea$(
    findingArea: RadioFindingAreaCreateRequestDto
  ): Observable<RadioFindingAreaDto> {
    throw new Error('Method not implemented.');
  }

  createFindingDetails$(
    findingDetails: RadioFindingDetailsCreateRequestDto
  ): Observable<RadioFindingDetailsDto> {
    throw new Error('Method not implemented.');
  }

  updateTemplate$(
    template: RadioTemplateUpdateRequestDto
  ): Observable<RadioTemplateDto> {
    throw new Error('Method not implemented.');
  }

  updateFindingArea$(
    findingArea: RadioFindingAreaUpdateRequestDto
  ): Observable<RadioFindingAreaDto> {
    throw new Error('Method not implemented.');
  }

  updateFindingDetails$(
    findingDetails: RadioFindingDetailsUpdateRequestDto
  ): Observable<RadioFindingDetailsDto> {
    throw new Error('Method not implemented.');
  }

  deleteTemplate$(templateId: string): Observable<RadioTemplateDto> {
    throw new Error('Method not implemented.');
  }

  deleteFindingArea$(findingAreaId: string): Observable<RadioFindingAreaDto> {
    throw new Error('Method not implemented.');
  }

  deleteFindingDetails$(
    findingDetailsId: string
  ): Observable<RadioFindingDetailsDto> {
    throw new Error('Method not implemented.');
  }

  updateFindingAreaSortOrder$(
    sortOrders: RadioSortOrderUpdateRequestDto
  ): Observable<void> {
    throw new Error('Method not implemented.');
  }

  updateFindingDetailsSortOrder$(
    sortOrders: RadioSortOrderUpdateRequestDto
  ): Observable<void> {
    throw new Error('Method not implemented.');
  }

  fetchTemplate$(templateId: string): Observable<RadioTemplateModelDto> {
    throw new Error('Method not implemented.');
  }

  importTemplate$(
    template: RadioTemplateImportModelDto
  ): Observable<RadioTemplateDto> {
    throw new Error('Method not implemented.');
  }

  cloneFindingArea$(findingAreaId: string): Observable<RadioFindingAreaDto> {
    throw new Error('Method not implemented.');
  }

  cloneFindingDetails$(
    findingDetailsId: string
  ): Observable<RadioFindingDetailsDto> {
    throw new Error('Method not implemented.');
  }
}
