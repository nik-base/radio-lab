/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { RadioFindingAreaCreateRequestDto } from '../models/data/radio-finding-area-create-request.interface.dto';
import { RadioFindingAreaUpdateRequestDto } from '../models/data/radio-finding-area-update-request.interface.dto';
import { RadioFindingAreaDto } from '../models/data/radio-finding-area.interface.dto';
import { RadioFindingDetailsCreateRequestDto } from '../models/data/radio-finding-details-create-request.interface.dto';
import { RadioFindingDetailsUpdateRequestDto } from '../models/data/radio-finding-details-update-request.interface.dto';
import { RadioFindingDetailsDto } from '../models/data/radio-finding-details.interface.dto';
import { RadioSortOrderUpdateRequestDto } from '../models/data/radio-sort-order-update-request.interface.dto';
import { RadioTemplateCreateRequestDto } from '../models/data/radio-template-create-request.interface.dto';
import { RadioTemplateImportModelDto } from '../models/data/radio-template-import-model.interface.dto';
import { RadioTemplateModelDto } from '../models/data/radio-template-model.interface.dto';
import { RadioTemplateUpdateRequestDto } from '../models/data/radio-template-update-request.interface.dto';
import { RadioTemplateDto } from '../models/data/radio-template.interface.dto';

@Injectable({
  providedIn: 'root',
})
export class RadioDataService {
  fetchTemplates$(): Observable<RadioTemplateDto[]> {
    throw new Error('Method not implemented.');
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
}
