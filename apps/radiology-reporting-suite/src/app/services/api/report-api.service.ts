/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  FindingCreateDto,
  FindingDto,
  FindingUpdateDto,
  ScopeCreateDto,
  ScopeDto,
  ScopeUpdateDto,
  SortOrderUpdateDto,
  TemplateCreateDto,
  TemplateDataDto,
  TemplateDto,
  TemplateImportDto,
  TemplateUpdateDto,
} from '../../models/data';
import { ReportBaseService } from '../report-base.service';

@Injectable({ providedIn: 'root' })
export class ReportApiService extends ReportBaseService {
  override fetchTemplates$(): Observable<TemplateDto[]> {
    throw new Error('Method not implemented.');
  }

  override fetchScopes$(templateId: string): Observable<ScopeDto[]> {
    throw new Error('Method not implemented.');
  }

  override fetchFindings$(scopeId: string): Observable<FindingDto[]> {
    throw new Error('Method not implemented.');
  }

  override createTemplate$(
    template: TemplateCreateDto
  ): Observable<TemplateDto> {
    throw new Error('Method not implemented.');
  }

  override createScope$(scope: ScopeCreateDto): Observable<ScopeDto> {
    throw new Error('Method not implemented.');
  }

  override createFinding$(finding: FindingCreateDto): Observable<FindingDto> {
    throw new Error('Method not implemented.');
  }

  override updateTemplate$(
    template: TemplateUpdateDto
  ): Observable<TemplateDto> {
    throw new Error('Method not implemented.');
  }

  override updateScope$(scope: ScopeUpdateDto): Observable<ScopeDto> {
    throw new Error('Method not implemented.');
  }

  override updateFinding$(finding: FindingUpdateDto): Observable<FindingDto> {
    throw new Error('Method not implemented.');
  }

  override deleteTemplate$(templateId: string): Observable<void> {
    throw new Error('Method not implemented.');
  }

  override deleteScope$(scopeId: string): Observable<void> {
    throw new Error('Method not implemented.');
  }

  override deleteFinding$(findingId: string): Observable<void> {
    throw new Error('Method not implemented.');
  }

  override updateScopesSortOrder$(
    sortOrderUpdateRequest: SortOrderUpdateDto
  ): Observable<void> {
    throw new Error('Method not implemented.');
  }

  override updateFindingsSortOrder$(
    sortOrderUpdateRequest: SortOrderUpdateDto
  ): Observable<void> {
    throw new Error('Method not implemented.');
  }

  override fetchTemplate$(templateId: string): Observable<TemplateDataDto> {
    throw new Error('Method not implemented.');
  }

  override importTemplate$(
    template: TemplateImportDto
  ): Observable<TemplateDto> {
    throw new Error('Method not implemented.');
  }

  override cloneScope$(scopeId: string): Observable<ScopeDto> {
    throw new Error('Method not implemented.');
  }

  override cloneFinding$(findingId: string): Observable<FindingDto> {
    throw new Error('Method not implemented.');
  }
}
