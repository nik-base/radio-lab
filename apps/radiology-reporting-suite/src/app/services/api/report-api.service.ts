/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  FindingClassifierCreateDto,
  FindingClassifierDto,
  FindingClassifierUpdateDto,
  FindingCreateDto,
  FindingDto,
  FindingGroupCreateDto,
  FindingGroupDto,
  FindingGroupUpdateDto,
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
  override fetchFindingGroups$(scopeId: string): Observable<FindingGroupDto[]> {
    throw new Error('Method not implemented.');
  }

  override fetchFindingClassifiers$(
    scopeId: string,
    groupId?: string
  ): Observable<FindingClassifierDto[]> {
    throw new Error('Method not implemented.');
  }

  override createFindingGroup$(
    group: FindingGroupCreateDto
  ): Observable<FindingGroupDto> {
    throw new Error('Method not implemented.');
  }

  override createFindingClassifier$(
    classifier: FindingClassifierCreateDto
  ): Observable<FindingClassifierDto> {
    throw new Error('Method not implemented.');
  }

  override updateFindingGroup$(
    group: FindingGroupUpdateDto
  ): Observable<FindingGroupDto> {
    throw new Error('Method not implemented.');
  }

  override updateFindingClassifier$(
    classifier: FindingClassifierUpdateDto
  ): Observable<FindingClassifierDto> {
    throw new Error('Method not implemented.');
  }

  override deleteFindingGroup$(groupId: string): Observable<void> {
    throw new Error('Method not implemented.');
  }

  override deleteFindingClassifier$(classifierId: string): Observable<void> {
    throw new Error('Method not implemented.');
  }

  override reorderTemplates$(
    sortOrderUpdateRequest: SortOrderUpdateDto
  ): Observable<void> {
    throw new Error('Method not implemented.');
  }

  override reorderFindingGroups$(
    sortOrderUpdateRequest: SortOrderUpdateDto
  ): Observable<void> {
    throw new Error('Method not implemented.');
  }

  override reorderFindingClassifiers$(
    sortOrderUpdateRequest: SortOrderUpdateDto
  ): Observable<void> {
    throw new Error('Method not implemented.');
  }

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

  override reorderScopes$(
    sortOrderUpdateRequest: SortOrderUpdateDto
  ): Observable<void> {
    throw new Error('Method not implemented.');
  }

  override reorderFindings$(
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
