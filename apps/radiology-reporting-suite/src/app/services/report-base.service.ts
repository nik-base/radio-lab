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
} from '../models/data';

export abstract class ReportBaseService {
  abstract fetchTemplates$(): Observable<TemplateDto[]>;

  abstract fetchScopes$(templateId: string): Observable<ScopeDto[]>;

  abstract fetchFindings$(scopeId: string): Observable<FindingDto[]>;

  abstract createTemplate$(
    template: TemplateCreateDto
  ): Observable<TemplateDto>;

  abstract createScope$(scope: ScopeCreateDto): Observable<ScopeDto>;

  abstract createFinding$(finding: FindingCreateDto): Observable<FindingDto>;

  abstract updateTemplate$(
    template: TemplateUpdateDto
  ): Observable<TemplateDto>;

  abstract updateScope$(scope: ScopeUpdateDto): Observable<ScopeDto>;

  abstract updateFinding$(finding: FindingUpdateDto): Observable<FindingDto>;

  abstract deleteTemplate$(templateId: string): Observable<void>;

  abstract deleteScope$(scopeId: string): Observable<void>;

  abstract deleteFinding$(findingId: string): Observable<void>;

  abstract updateScopesSortOrder$(
    sortOrderUpdateRequest: SortOrderUpdateDto
  ): Observable<void>;

  abstract updateFindingsSortOrder$(
    sortOrderUpdateRequest: SortOrderUpdateDto
  ): Observable<void>;

  abstract fetchTemplate$(templateId: string): Observable<TemplateDataDto>;

  abstract importTemplate$(
    template: TemplateImportDto
  ): Observable<TemplateDto>;
  abstract cloneScope$(scopeId: string): Observable<ScopeDto>;

  abstract cloneFinding$(findingId: string): Observable<FindingDto>;
}
