import { inject, Injectable } from '@angular/core';
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
export class ReportDataService {
  private readonly reportService: ReportBaseService = inject(ReportBaseService);

  fetchTemplates$(): Observable<TemplateDto[]> {
    return this.reportService.fetchTemplates$();
  }

  fetchScopes$(templateId: string): Observable<ScopeDto[]> {
    return this.reportService.fetchScopes$(templateId);
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

  createFinding$(finding: FindingCreateDto): Observable<FindingDto> {
    return this.reportService.createFinding$(finding);
  }

  updateTemplate$(template: TemplateUpdateDto): Observable<TemplateDto> {
    return this.reportService.updateTemplate$(template);
  }

  updateScope$(scope: ScopeUpdateDto): Observable<ScopeDto> {
    return this.reportService.updateScope$(scope);
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

  deleteFinding$(findingId: string): Observable<void> {
    return this.reportService.deleteFinding$(findingId);
  }

  updateScopesSortOrder$(
    sortOrderUpdateRequest: SortOrderUpdateDto
  ): Observable<void> {
    return this.reportService.updateScopesSortOrder$(sortOrderUpdateRequest);
  }

  updateFindingsSortOrder$(
    sortOrderUpdateRequest: SortOrderUpdateDto
  ): Observable<void> {
    return this.reportService.updateFindingsSortOrder$(sortOrderUpdateRequest);
  }

  fetchTemplate$(templateId: string): Observable<TemplateDataDto> {
    return this.reportService.fetchTemplate$(templateId);
  }

  importTemplate$(template: TemplateImportDto): Observable<TemplateDto> {
    return this.reportService.importTemplate$(template);
  }

  cloneScope$(scopeId: string): Observable<ScopeDto> {
    return this.reportService.cloneScope$(scopeId);
  }

  cloneFinding$(findingId: string): Observable<FindingDto> {
    return this.reportService.cloneFinding$(findingId);
  }
}
