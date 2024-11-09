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
    return this.radioDBService.fetchFindingAreas$(templateId);
  }

  fetchFindingDetails$(
    findingAreaId: string
  ): Observable<RadioFindingDetailsDto[]> {
    return this.radioDBService.fetchFindingDetails$(findingAreaId);
  }

  createTemplate$(
    template: RadioTemplateCreateRequestDto
  ): Observable<RadioTemplateDto> {
    return this.radioDBService.createTemplate$(template);
  }

  createFindingArea$(
    findingArea: RadioFindingAreaCreateRequestDto
  ): Observable<RadioFindingAreaDto> {
    return this.radioDBService.createFindingArea$(findingArea);
  }

  createFindingDetails$(
    findingDetails: RadioFindingDetailsCreateRequestDto
  ): Observable<RadioFindingDetailsDto> {
    return this.radioDBService.createFindingDetails$(findingDetails);
  }

  updateTemplate$(
    template: RadioTemplateUpdateRequestDto
  ): Observable<RadioTemplateDto> {
    return this.radioDBService.updateTemplate$(template);
  }

  updateFindingArea$(
    findingArea: RadioFindingAreaUpdateRequestDto
  ): Observable<RadioFindingAreaDto> {
    return this.radioDBService.updateFindingArea$(findingArea);
  }

  updateFindingDetails$(
    findingDetails: RadioFindingDetailsUpdateRequestDto
  ): Observable<RadioFindingDetailsDto> {
    return this.radioDBService.updateFindingDetails$(findingDetails);
  }

  deleteTemplate$(templateId: string): Observable<RadioTemplateDto> {
    return this.radioDBService.deleteTemplate$(templateId);
  }

  deleteFindingArea$(findingAreaId: string): Observable<RadioFindingAreaDto> {
    return this.radioDBService.deleteFindingArea$(findingAreaId);
  }

  deleteFindingDetails$(
    findingDetailsId: string
  ): Observable<RadioFindingDetailsDto> {
    return this.radioDBService.deleteFindingDetails$(findingDetailsId);
  }

  updateFindingAreaSortOrder$(
    sortOrders: RadioSortOrderUpdateRequestDto
  ): Observable<void> {
    return this.radioDBService.updateFindingAreaSortOrder$(sortOrders);
  }

  updateFindingDetailsSortOrder$(
    sortOrders: RadioSortOrderUpdateRequestDto
  ): Observable<void> {
    return this.radioDBService.updateFindingDetailsSortOrder$(sortOrders);
  }

  fetchTemplate$(templateId: string): Observable<RadioTemplateModelDto> {
    return this.radioDBService.fetchTemplate$(templateId);
  }

  importTemplate$(
    template: RadioTemplateImportModelDto
  ): Observable<RadioTemplateDto> {
    return this.radioDBService.importTemplate$(template);
  }

  cloneFindingArea$(findingAreaId: string): Observable<RadioFindingAreaDto> {
    return this.radioDBService.cloneFindingArea$(findingAreaId);
  }

  cloneFindingDetails$(
    findingDetailsId: string
  ): Observable<RadioFindingDetailsDto> {
    return this.radioDBService.cloneFindingDetails$(findingDetailsId);
  }
}
