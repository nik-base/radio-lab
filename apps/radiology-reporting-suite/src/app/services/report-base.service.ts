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
  TemplateExportDto,
  TemplateImportDto,
  TemplateUpdateDto,
  VariableCreateDto,
  VariableDto,
  VariableUpdateDto,
  VariableValueCreateDto,
  VariableValueDto,
  VariableValueUpdateDto,
} from '../models/data';

export abstract class ReportBaseService {
  abstract fetchTemplates$(): Observable<TemplateDto[]>;

  abstract fetchScopes$(templateId: string): Observable<ScopeDto[]>;

  abstract fetchFindings$(
    scopeId: string,
    groupId?: string,
    classifierId?: string
  ): Observable<FindingDto[]>;

  abstract fetchFindingsByScopeId$(scopeId: string): Observable<FindingDto[]>;

  abstract fetchFindingGroups$(scopeId: string): Observable<FindingGroupDto[]>;

  abstract fetchFindingClassifiers$(
    scopeId: string,
    groupId?: string
  ): Observable<FindingClassifierDto[]>;

  abstract fetchAllFindingVariables$(): Observable<VariableDto[]>;

  abstract fetchAllFindingVariablesExcept$(
    findingId: string
  ): Observable<VariableDto[]>;

  abstract fetchFindingVariables$(findingId: string): Observable<VariableDto[]>;

  abstract fetchVariableValues$(
    variableId: string
  ): Observable<VariableValueDto[]>;

  abstract createTemplate$(
    template: TemplateCreateDto
  ): Observable<TemplateDto>;

  abstract createScope$(scope: ScopeCreateDto): Observable<ScopeDto>;

  abstract createFinding$(finding: FindingCreateDto): Observable<FindingDto>;

  abstract createFindingGroup$(
    group: FindingGroupCreateDto
  ): Observable<FindingGroupDto>;

  abstract createFindingClassifier$(
    classifier: FindingClassifierCreateDto
  ): Observable<FindingClassifierDto>;

  abstract createVariable$(
    variable: VariableCreateDto
  ): Observable<VariableDto>;

  abstract createVariableValue$(
    variableValue: VariableValueCreateDto
  ): Observable<VariableValueDto>;

  abstract updateTemplate$(
    template: TemplateUpdateDto
  ): Observable<TemplateDto>;

  abstract updateScope$(scope: ScopeUpdateDto): Observable<ScopeDto>;

  abstract updateFinding$(finding: FindingUpdateDto): Observable<FindingDto>;

  abstract updateFindingGroup$(
    group: FindingGroupUpdateDto
  ): Observable<FindingGroupDto>;

  abstract updateFindingClassifier$(
    classifier: FindingClassifierUpdateDto
  ): Observable<FindingClassifierDto>;

  abstract updateVariable$(
    variable: VariableUpdateDto
  ): Observable<VariableDto>;

  abstract updateVariableValue$(
    variableValue: VariableValueUpdateDto
  ): Observable<VariableValueDto>;

  abstract deleteTemplate$(templateId: string): Observable<void>;

  abstract deleteScope$(scopeId: string): Observable<void>;

  abstract deleteFinding$(findingId: string): Observable<void>;

  abstract deleteFindingGroup$(groupId: string): Observable<void>;

  abstract deleteFindingClassifier$(classifierId: string): Observable<void>;

  abstract deleteVariable$(variableId: string): Observable<void>;

  abstract deleteVariableValue$(variableValueId: string): Observable<void>;

  abstract reorderTemplates$(
    sortOrderUpdateRequest: SortOrderUpdateDto
  ): Observable<void>;

  abstract reorderScopes$(
    sortOrderUpdateRequest: SortOrderUpdateDto
  ): Observable<void>;

  abstract reorderFindings$(
    sortOrderUpdateRequest: SortOrderUpdateDto
  ): Observable<void>;

  abstract reorderFindingGroups$(
    sortOrderUpdateRequest: SortOrderUpdateDto
  ): Observable<void>;

  abstract reorderFindingClassifiers$(
    sortOrderUpdateRequest: SortOrderUpdateDto
  ): Observable<void>;

  abstract reorderVariables$(
    sortOrderUpdateRequest: SortOrderUpdateDto
  ): Observable<void>;

  abstract reorderVariableValues$(
    sortOrderUpdateRequest: SortOrderUpdateDto
  ): Observable<void>;

  abstract fetchTemplate$(templateId: string): Observable<TemplateDataDto>;

  abstract exportTemplate$(templateId: string): Observable<TemplateExportDto>;

  abstract importTemplate$(
    template: TemplateImportDto
  ): Observable<TemplateDto>;

  abstract cloneScope$(
    scopeId: string,
    templateId: string
  ): Observable<ScopeDto>;

  abstract cloneFinding$(
    findingId: string,
    groupId: string,
    classifierId: string
  ): Observable<FindingDto>;

  abstract cloneVariable$(
    variableId: string,
    entityId: string
  ): Observable<VariableDto>;
}
