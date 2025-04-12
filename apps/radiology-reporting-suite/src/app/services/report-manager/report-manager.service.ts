import { inject, Injectable } from '@angular/core';
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
export class ReportManagerService {
  private readonly reportService: ReportBaseService = inject(ReportBaseService);

  fetchTemplates$(): Observable<TemplateDto[]> {
    return this.reportService.fetchTemplates$();
  }

  fetchScopes$(templateId: string): Observable<ScopeDto[]> {
    return this.reportService.fetchScopes$(templateId);
  }

  fetchFindingGroups$(scopeId: string): Observable<FindingGroupDto[]> {
    return this.reportService.fetchFindingGroups$(scopeId);
  }

  fetchFindingClassifiers$(
    scopeId: string,
    groupId: string
  ): Observable<FindingClassifierDto[]> {
    return this.reportService.fetchFindingClassifiers$(scopeId, groupId);
  }

  fetchFindings$(scopeId: string): Observable<FindingDto[]> {
    return this.reportService.fetchFindings$(scopeId);
  }

  createTemplate$(template: TemplateCreateDto): Observable<TemplateDto> {
    return this.reportService.createTemplate$(template);
  }

  createScope$(scope: ScopeCreateDto): Observable<ScopeDto> {
    return this.reportService.createScope$(scope);
  }

  createFindingGroup$(
    group: FindingGroupCreateDto
  ): Observable<FindingGroupDto> {
    return this.reportService.createFindingGroup$(group);
  }

  createFindingClassifier$(
    classifier: FindingClassifierCreateDto
  ): Observable<FindingClassifierDto> {
    return this.reportService.createFindingClassifier$(classifier);
  }

  createFinding$(finding: FindingCreateDto): Observable<FindingDto> {
    return this.reportService.createFinding$(finding);
  }

  updateTemplate$(template: TemplateUpdateDto): Observable<TemplateDto> {
    return this.reportService.updateTemplate$(template);
  }

  updateScope$(scope: ScopeUpdateDto): Observable<ScopeDto> {
    return this.reportService.updateScope$(scope);
  }

  updateFindingGroup$(
    group: FindingGroupUpdateDto
  ): Observable<FindingGroupDto> {
    return this.reportService.updateFindingGroup$(group);
  }

  updateFindingClassifier$(
    classifier: FindingClassifierUpdateDto
  ): Observable<FindingClassifierDto> {
    return this.reportService.updateFindingClassifier$(classifier);
  }

  updateFinding$(finding: FindingUpdateDto): Observable<FindingDto> {
    return this.reportService.updateFinding$(finding);
  }

  deleteTemplate$(templateId: string): Observable<void> {
    return this.reportService.deleteTemplate$(templateId);
  }

  deleteScope$(scopeId: string): Observable<void> {
    return this.reportService.deleteScope$(scopeId);
  }

  deleteFindingGroup$(groupId: string): Observable<void> {
    return this.reportService.deleteFindingGroup$(groupId);
  }

  deleteFindingClassifier$(classifierId: string): Observable<void> {
    return this.reportService.deleteFindingClassifier$(classifierId);
  }

  deleteFinding$(findingId: string): Observable<void> {
    return this.reportService.deleteFinding$(findingId);
  }

  reorderTemplates$(
    sortOrderUpdateRequest: SortOrderUpdateDto
  ): Observable<void> {
    return this.reportService.reorderTemplates$(sortOrderUpdateRequest);
  }

  reorderScopes$(sortOrderUpdateRequest: SortOrderUpdateDto): Observable<void> {
    return this.reportService.reorderScopes$(sortOrderUpdateRequest);
  }

  reorderFindingGroups$(
    sortOrderUpdateRequest: SortOrderUpdateDto
  ): Observable<void> {
    return this.reportService.reorderFindingGroups$(sortOrderUpdateRequest);
  }

  reorderFindingClassifiers$(
    sortOrderUpdateRequest: SortOrderUpdateDto
  ): Observable<void> {
    return this.reportService.reorderFindingClassifiers$(
      sortOrderUpdateRequest
    );
  }

  reorderFindings$(
    sortOrderUpdateRequest: SortOrderUpdateDto
  ): Observable<void> {
    return this.reportService.reorderFindings$(sortOrderUpdateRequest);
  }

  fetchTemplate$(templateId: string): Observable<TemplateDataDto> {
    return this.reportService.fetchTemplate$(templateId);
  }

  importTemplate$(template: TemplateImportDto): Observable<TemplateDto> {
    return this.reportService.importTemplate$(template);
  }

  cloneScope$(scopeId: string, templateId: string): Observable<ScopeDto> {
    return this.reportService.cloneScope$(scopeId, templateId);
  }

  cloneFinding$(findingId: string): Observable<FindingDto> {
    return this.reportService.cloneFinding$(findingId);
  }
}
