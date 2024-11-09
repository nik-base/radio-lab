/* eslint-disable @typescript-eslint/no-unused-vars */
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { RadioDBService } from '../db/radio-db.service';
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

@Injectable()
export class RadioDataService {
  private readonly radioDBService: RadioDBService = inject(RadioDBService);

  fetchTemplates$(): Observable<RadioTemplateDto[]> {
    return this.radioDBService.fetchTemplates$();
  }

  fetchFindingAreas$(templateId: string): Observable<RadioFindingAreaDto[]> {
    throw new Error('Method not implemented.');
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
