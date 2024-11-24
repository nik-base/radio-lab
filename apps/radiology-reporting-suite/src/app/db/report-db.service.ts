import { inject, Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { concatMap, forkJoin, map, mergeMap, Observable, of } from 'rxjs';

import {
  EditorContentDto,
  FindingBaseDto,
  FindingCreateDto,
  FindingDto,
  FindingUpdateDto,
  ScopeBaseDto,
  ScopeCreateDto,
  ScopeDataDto,
  ScopeDto,
  ScopeImportDto,
  ScopeUpdateDto,
  SortOrderItemDto,
  SortOrderUpdateDto,
  TemplateBaseDto,
  TemplateCreateDto,
  TemplateDataDto,
  TemplateDto,
  TemplateImportDto,
  TemplateUpdateDto,
} from '../models/data';
import { ReportBaseService } from '../services/report-base.service';

import {
  FindingDBModel,
  ScopeDBModel,
  TemplateDBModel,
} from './report-db.models';

@Injectable({ providedIn: 'root' })
export class ReportDBService extends ReportBaseService {
  private readonly dbService: NgxIndexedDBService = inject(NgxIndexedDBService);

  override fetchTemplates$(): Observable<TemplateDto[]> {
    return this.dbService
      .getAll<TemplateDBModel>('templates')
      .pipe(
        map((templates: TemplateDBModel[]) =>
          templates.map(
            (template: TemplateDBModel): TemplateDto =>
              this.mapTemplateDBModelToDto(template)
          )
        )
      );
  }

  override fetchScopes$(templateId: string): Observable<ScopeDto[]> {
    return this.dbService
      .getAllByIndex<ScopeDBModel>(
        'protocols',
        'templateId',
        IDBKeyRange.only(templateId)
      )
      .pipe(
        map((scopes: ScopeDBModel[]) =>
          scopes.map(
            (scope: ScopeDBModel): ScopeDto => this.mapScopeDBModelToDto(scope)
          )
        )
      );
  }

  override fetchFindings$(scopeId: string): Observable<FindingDto[]> {
    return this.dbService
      .getAllByIndex<FindingDBModel>(
        'findings',
        'protocolId',
        IDBKeyRange.only(scopeId)
      )
      .pipe(
        map((findings: FindingDBModel[]) =>
          findings.map(
            (finding: FindingDBModel): FindingDto =>
              this.mapFindingDBModelToDto(finding)
          )
        )
      );
  }

  override createTemplate$(
    template: TemplateCreateDto
  ): Observable<TemplateDto> {
    const dbModel: TemplateDBModel =
      this.mapTemplateCreateDtoToDBModel(template);

    return this.createTemplateInDb$(dbModel);
  }

  override createScope$(scope: ScopeCreateDto): Observable<ScopeDto> {
    const dbModel: ScopeDBModel = this.mapScopeCreateDtoToDBModel(scope);

    return this.createScopeInDb$(dbModel);
  }

  override createFinding$(finding: FindingCreateDto): Observable<FindingDto> {
    const dbModel: FindingDBModel = this.mapFindingCreateDtoToDBModel(finding);

    return this.dbService
      .add<FindingDBModel>('findings', dbModel)
      .pipe(
        map(
          (data: FindingDBModel): FindingDto =>
            this.mapFindingDBModelToDto(data)
        )
      );
  }

  override updateTemplate$(
    template: TemplateUpdateDto
  ): Observable<TemplateDto> {
    const dbModel: TemplateDBModel =
      this.mapTemplateUpdateDtoToDBModel(template);

    return this.dbService
      .update<TemplateDBModel>('templates', dbModel)
      .pipe(
        map(
          (data: TemplateDBModel): TemplateDto =>
            this.mapTemplateDBModelToDto(data)
        )
      );
  }

  override updateScope$(scope: ScopeUpdateDto): Observable<ScopeDto> {
    const dbModel: ScopeDBModel = this.mapScopeUpdateDtoToDBModel(scope);

    return this.dbService
      .update<ScopeDBModel>('protocols', dbModel)
      .pipe(
        map((data: ScopeDBModel): ScopeDto => this.mapScopeDBModelToDto(data))
      );
  }

  override updateFinding$(finding: FindingUpdateDto): Observable<FindingDto> {
    const dbModel: FindingDBModel = this.mapFindingUpdateDtoToDBModel(finding);

    return this.dbService
      .update<FindingDBModel>('findings', dbModel)
      .pipe(
        map(
          (data: FindingDBModel): FindingDto =>
            this.mapFindingDBModelToDto(data)
        )
      );
  }

  override deleteTemplate$(templateId: string): Observable<void> {
    return this.dbService
      .delete<TemplateDBModel>('templates', templateId)
      .pipe(map(() => void 0));
  }

  override deleteScope$(scopeId: string): Observable<void> {
    return this.dbService
      .delete<ScopeDBModel>('protocols', scopeId)
      .pipe(map(() => void 0));
  }

  override deleteFinding$(findingId: string): Observable<void> {
    return this.dbService
      .delete<FindingDBModel>('findings', findingId)
      .pipe(map(() => void 0));
  }

  override reorderScopes$(
    sortOrderUpdateRequest: SortOrderUpdateDto
  ): Observable<void> {
    const scopeIds: string[] = sortOrderUpdateRequest.sortOrdersMap.map(
      (sortOrder: SortOrderItemDto): string => sortOrder.id
    );

    const scopes$: Observable<ScopeDBModel[]> =
      this.dbService.bulkGet<ScopeDBModel>('protocols', scopeIds);

    return scopes$.pipe(
      mergeMap((scopes: ScopeDBModel[]) => {
        const scopesToUpdate: ScopeDBModel[] = this.getUpdatedScopesSortOrder(
          scopes,
          sortOrderUpdateRequest
        );

        return this.dbService.bulkPut<ScopeDBModel>(
          'protocols',
          scopesToUpdate
        );
      }),
      map(() => void 0)
    );
  }

  override reorderFindings$(
    sortOrderUpdateRequest: SortOrderUpdateDto
  ): Observable<void> {
    const findingIds: string[] = sortOrderUpdateRequest.sortOrdersMap.map(
      (sortOrder: SortOrderItemDto): string => sortOrder.id
    );

    const findings$: Observable<FindingDBModel[]> =
      this.dbService.bulkGet<FindingDBModel>('findings', findingIds);

    return findings$.pipe(
      mergeMap((findings: FindingDBModel[]) => {
        const findingsToUpdate: FindingDBModel[] =
          this.getUpdatedFindingsSortOrder(findings, sortOrderUpdateRequest);

        return this.dbService.bulkPut<FindingDBModel>(
          'findings',
          findingsToUpdate
        );
      }),
      map(() => void 0)
    );
  }

  override fetchTemplate$(templateId: string): Observable<TemplateDataDto> {
    return this.dbService
      .getByID<TemplateDBModel>('templates', templateId)
      .pipe(
        mergeMap(
          (template: TemplateDBModel): Observable<TemplateDataDto> =>
            this.getScopesForTemplate$(template)
        )
      );
  }

  override importTemplate$(
    template: TemplateImportDto
  ): Observable<TemplateDto> {
    const templateDbModel: TemplateDBModel =
      this.mapTemplateCreateDtoToDBModel(template);

    const scopeIdsMap: Record<string, ScopeImportDto> =
      this.generateScopeIdsMap(template);

    const scopes: ScopeDBModel[] = this.generateScopesForImport(
      scopeIdsMap,
      templateDbModel
    );

    const findings: FindingDBModel[] =
      this.generateFindingsForImport(scopeIdsMap);

    return forkJoin([
      this.createTemplateInDb$(templateDbModel),
      this.dbService.bulkAdd<ScopeDBModel>('protocols', scopes),
      this.dbService.bulkAdd<FindingDBModel>('findings', findings),
    ]).pipe(
      map(
        ([template]: [TemplateDto, number[], number[]]): TemplateDto => template
      )
    );
  }

  override cloneScope$(
    scopeId: string,
    templateId: string
  ): Observable<ScopeDto> {
    return this.fetchScopesData$(scopeId).pipe(
      mergeMap((scope: ScopeDataDto): Observable<ScopeDto> => {
        const scopeDbModel: ScopeDBModel = this.mapScopeBaseDtoToCloneDBModel(
          scope,
          templateId
        );

        const findings: FindingDBModel[] = this.generateFindingsForClone$(
          scope,
          scopeDbModel
        );

        return forkJoin([
          this.createScopeInDb$(scopeDbModel),
          this.dbService.bulkAdd<FindingDBModel>('findings', findings),
        ]).pipe(map(([scope]: [ScopeDto, number[]]): ScopeDto => scope));
      })
    );
  }

  override cloneFinding$(findingId: string): Observable<FindingDto> {
    return this.dbService.getByID<FindingDBModel>('findings', findingId).pipe(
      mergeMap(
        (finding: FindingDBModel): Observable<FindingDto> =>
          this.createFinding$({
            ...this.mapFindingDBModelToCreateDto(finding),
          })
      )
    );
  }

  private generateId(): string {
    return crypto.randomUUID();
  }

  private generateFindingsForClone$(
    scope: ScopeDataDto,
    scopeDBModel: ScopeDBModel
  ): FindingDBModel[] {
    return scope.findings.map(
      (finding: FindingBaseDto): FindingDBModel => ({
        ...this.mapFindingBaseDtoToDBModel(finding),
        id: this.generateId(),
        protocolId: scopeDBModel.id,
      })
    );
  }

  private createScopeInDb$(dbModel: ScopeDBModel): Observable<ScopeDto> {
    return this.dbService
      .add<ScopeDBModel>('protocols', dbModel)
      .pipe(
        map((data: ScopeDBModel): ScopeDto => this.mapScopeDBModelToDto(data))
      );
  }

  private generateScopeIdsMap(
    template: TemplateImportDto
  ): Record<string, ScopeImportDto> {
    return template.scopes.reduce(
      (
        accumulator: Record<string, ScopeImportDto>,
        current: ScopeImportDto
      ) => {
        accumulator[this.generateId()] = current;
        return accumulator;
      },
      {} as Record<string, ScopeImportDto>
    );
  }

  private generateFindingsForImport(
    scopeIdsMap: Record<string, ScopeImportDto>
  ): FindingDBModel[] {
    return Object.entries(scopeIdsMap)
      .map(([scopeId, scope]: [string, ScopeImportDto]): FindingDBModel[] =>
        scope.findings.map(
          (finding: FindingBaseDto): FindingDBModel => ({
            ...this.mapFindingBaseDtoToDBModel(finding),
            id: this.generateId(),
            protocolId: scopeId,
          })
        )
      )
      .flat();
  }

  private generateScopesForImport(
    findingScopeIdsMap: Record<string, ScopeImportDto>,
    templateDbModel: TemplateDBModel
  ): ScopeDBModel[] {
    return Object.entries(findingScopeIdsMap).map(
      ([scopeId, scope]: [string, ScopeImportDto]): ScopeDBModel => ({
        ...this.mapScopeBaseDtoToDBModel(scope),
        templateId: templateDbModel.id,
        id: scopeId,
      })
    );
  }

  private createTemplateInDb$(
    template: TemplateDBModel
  ): Observable<TemplateDto> {
    return this.dbService
      .add<TemplateDBModel>('templates', template)
      .pipe(
        map(
          (data: TemplateDBModel): TemplateDto =>
            this.mapTemplateDBModelToDto(data)
        )
      );
  }

  private getScopesForTemplate$(
    template: TemplateDBModel
  ): Observable<TemplateDataDto> {
    return this.dbService
      .getAllByIndex<ScopeDBModel>(
        'protocols',
        'templateId',
        IDBKeyRange.only(template.id)
      )
      .pipe(
        concatMap(
          (scopes: ScopeDBModel[]): Observable<TemplateDataDto> =>
            this.mapTemplateScopesToTemplateDataDto(scopes, template)
        )
      );
  }

  private mapTemplateScopesToTemplateDataDto(
    scopes: ScopeDBModel[],
    template: TemplateDBModel
  ): Observable<TemplateDataDto> {
    if (!scopes?.length) {
      return of<TemplateDataDto>({
        ...this.mapTemplateDBModelToBaseDto(template),
        id: template.id,
        scopes: [],
      });
    }

    return this.getFindingsForScopes$(scopes, template);
  }

  private getFindingsForScopes$(
    scopes: ScopeDBModel[],
    template: TemplateDBModel
  ): Observable<TemplateDataDto> {
    const scopes$: Observable<ScopeDataDto>[] = scopes.map(
      (scope: ScopeDBModel): Observable<ScopeDataDto> =>
        this.fetchFindingsForScope$(scope)
    );

    return forkJoin(scopes$).pipe(
      map(
        (scopes: ScopeDataDto[]): TemplateDataDto => ({
          ...this.mapTemplateDBModelToBaseDto(template),
          id: template.id,
          scopes: scopes,
        })
      )
    );
  }

  private fetchFindingsForScope$(
    scope: ScopeDBModel
  ): Observable<ScopeDataDto> {
    return this.dbService
      .getAllByIndex<FindingDBModel>(
        'findings',
        'protocolId',
        IDBKeyRange.only(scope.id)
      )
      .pipe(
        map(
          (findings: FindingDBModel[]): ScopeDataDto =>
            this.mapScopeFindingsToDto(scope, findings)
        )
      );
  }

  private mapScopeFindingsToDto(
    scope: ScopeDBModel,
    findings: FindingDBModel[]
  ): ScopeDataDto {
    return {
      ...this.mapScopeDBModelToBaseDto(scope),
      id: scope.id,
      templateId: scope.templateId,
      findings: findings.map(
        (finding: FindingDBModel): FindingDto =>
          this.mapFindingDBModelToDto(finding)
      ),
    };
  }

  private fetchScopesData$(scopeId: string): Observable<ScopeDataDto> {
    return this.dbService
      .getByID<ScopeDBModel>('protocols', scopeId)
      .pipe(
        mergeMap(
          (scope: ScopeDBModel): Observable<ScopeDataDto> =>
            this.fetchFindingsForScope$(scope)
        )
      );
  }

  private getUpdatedScopesSortOrder(
    scopes: ScopeDBModel[],
    sortOrderUpdateRequest: SortOrderUpdateDto
  ): ScopeDBModel[] {
    return scopes.map((scope: ScopeDBModel): ScopeDBModel => {
      const sortOrderItem: SortOrderItemDto | undefined =
        sortOrderUpdateRequest.sortOrdersMap.find(
          (sortOrder: SortOrderItemDto): boolean => sortOrder.id === scope.id
        );

      if (!sortOrderItem) {
        return scope;
      }

      return {
        ...scope,
        order: sortOrderItem.sortOrder,
      };
    });
  }

  private getUpdatedFindingsSortOrder(
    findings: FindingDBModel[],
    sortOrderUpdateRequest: SortOrderUpdateDto
  ): FindingDBModel[] {
    return findings.map((finding: FindingDBModel): FindingDBModel => {
      const sortOrderItem: SortOrderItemDto | undefined =
        sortOrderUpdateRequest.sortOrdersMap.find(
          (sortOrder: SortOrderItemDto): boolean => sortOrder.id === finding.id
        );

      if (!sortOrderItem) {
        return finding;
      }

      return {
        ...finding,
        order: sortOrderItem.sortOrder,
      };
    });
  }

  private mapTemplateUpdateDtoToDBModel(
    template: TemplateUpdateDto
  ): TemplateDBModel {
    return {
      ...this.mapTemplateBaseDtoToDBModel(template),
      id: template.id,
    };
  }

  private mapScopeUpdateDtoToDBModel(scope: ScopeUpdateDto): ScopeDBModel {
    return {
      ...this.mapScopeBaseDtoToDBModel(scope),
      id: scope.id,
      templateId: scope.templateId,
    };
  }

  private mapFindingUpdateDtoToDBModel(
    finding: FindingUpdateDto
  ): FindingDBModel {
    return {
      ...this.mapFindingBaseDtoToDBModel(finding),
      id: finding.id,
      protocolId: finding.scopeId,
    };
  }

  private mapTemplateBaseDtoToDBModel(
    template: TemplateBaseDto
  ): Omit<TemplateDBModel, 'id'> {
    return {
      ...this.mapEditorContentToProtocol(template.protocol),
      ...this.mapEditorContentToPatientInfo(template.patientInfo),
      name: template.name,
    };
  }

  private mapFindingDBModelToCreateDto(
    template: FindingDBModel
  ): FindingCreateDto {
    return {
      ...this.mapFindingDBModelToBaseDto(template),
      scopeId: template.protocolId,
    };
  }

  private mapTemplateCreateDtoToDBModel(
    template: TemplateCreateDto
  ): TemplateDBModel {
    return {
      ...this.mapTemplateBaseDtoToDBModel(template),
      id: this.generateId(),
    };
  }

  private mapTemplateDBModelToBaseDto(
    template: TemplateDBModel
  ): TemplateBaseDto {
    return {
      name: template.name,
      protocol: this.mapProtocolToEditorContent(template),
      patientInfo: this.mapPatientInfoToEditorContent(template),
    };
  }

  private mapTemplateDBModelToDto(template: TemplateDBModel): TemplateDto {
    return {
      ...this.mapTemplateDBModelToBaseDto(template),
      id: template.id,
    };
  }

  private mapScopeBaseDtoToDBModel(
    scope: ScopeBaseDto
  ): Omit<ScopeDBModel, 'id' | 'templateId'> {
    return {
      name: scope.name,
      order: scope.sortOrder,
    };
  }

  private mapScopeCreateDtoToDBModel(scope: ScopeCreateDto): ScopeDBModel {
    return {
      ...this.mapScopeBaseDtoToDBModel(scope),
      id: this.generateId(),
      templateId: scope.templateId,
    };
  }

  private mapScopeBaseDtoToCloneDBModel(
    scope: ScopeBaseDto,
    templateId: string
  ): ScopeDBModel {
    return {
      ...this.mapScopeBaseDtoToDBModel(scope),
      id: this.generateId(),
      templateId,
    };
  }

  private mapScopeDBModelToBaseDto(scope: ScopeDBModel): ScopeBaseDto {
    return {
      name: scope.name,
      sortOrder: scope.order,
    };
  }

  private mapScopeDBModelToDto(scope: ScopeDBModel): ScopeDto {
    return {
      ...this.mapScopeDBModelToBaseDto(scope),
      id: scope.id,
      templateId: scope.templateId,
    };
  }

  private mapFindingBaseDtoToDBModel(
    finding: FindingBaseDto
  ): Omit<FindingDBModel, 'id' | 'protocolId'> {
    return {
      ...this.mapEditorContentToFindingDescription(finding.description),
      ...this.mapEditorContentToImpression(finding.impression),
      ...this.mapEditorContentToRecommendation(finding.recommendation),
      title: finding.name,
      group: finding.group ?? undefined,
      order: finding.sortOrder,
      isNormal: finding.isNormal,
    };
  }

  private mapFindingCreateDtoToDBModel(
    finding: FindingCreateDto
  ): FindingDBModel {
    return {
      ...this.mapFindingBaseDtoToDBModel(finding),
      id: this.generateId(),
      protocolId: finding.scopeId,
    };
  }

  private mapFindingDBModelToBaseDto(finding: FindingDBModel): FindingBaseDto {
    return {
      name: finding.title,
      group: finding.group ?? null,
      isNormal: finding.isNormal ?? false,
      sortOrder: finding.order ?? 0,
      description: this.mapFindingDescriptionToEditorContent(finding),
      impression: this.mapImpressionToEditorContent(finding),
      recommendation: this.mapRecommendationToEditorContent(finding),
    };
  }

  private mapFindingDBModelToDto(finding: FindingDBModel): FindingDto {
    return {
      ...this.mapFindingDBModelToBaseDto(finding),
      id: finding.id,
      scopeId: finding.protocolId,
    };
  }

  private mapProtocolToEditorContent(
    editorContent: TemplateDBModel
  ): EditorContentDto {
    return {
      text: editorContent.description ?? '',
      html: editorContent.descriptionHTML ?? '',
      json: editorContent.descriptionJSON ?? '',
    };
  }

  private mapEditorContentToProtocol(
    editorContent: EditorContentDto
  ): Pick<
    TemplateDBModel,
    'description' | 'descriptionHTML' | 'descriptionJSON'
  > {
    return {
      description: editorContent.text,
      descriptionHTML: editorContent.html,
      descriptionJSON: editorContent.json,
    };
  }

  private mapPatientInfoToEditorContent(
    editorContent: TemplateDBModel
  ): EditorContentDto | null {
    if (!editorContent.patientInfoHTML) {
      return null;
    }

    return {
      text: editorContent.patientInfo ?? '',
      html: editorContent.patientInfoHTML ?? '',
      json: editorContent.patientInfoJSON ?? '',
    };
  }

  private mapEditorContentToPatientInfo(
    editorContent: EditorContentDto | null
  ): Pick<
    TemplateDBModel,
    'patientInfo' | 'patientInfoHTML' | 'patientInfoJSON'
  > {
    if (!editorContent) {
      return {
        patientInfo: undefined,
        patientInfoHTML: undefined,
        patientInfoJSON: undefined,
      };
    }

    return {
      patientInfo: editorContent.text,
      patientInfoHTML: editorContent.html,
      patientInfoJSON: editorContent.json,
    };
  }

  private mapFindingDescriptionToEditorContent(
    editorContent: FindingDBModel
  ): EditorContentDto {
    return {
      text: editorContent.description ?? '',
      html: editorContent.descriptionHTML ?? '',
      json: editorContent.descriptionJSON ?? '',
    };
  }

  private mapEditorContentToFindingDescription(
    editorContent: EditorContentDto
  ): Pick<
    FindingDBModel,
    'description' | 'descriptionHTML' | 'descriptionJSON'
  > {
    return {
      description: editorContent.text,
      descriptionHTML: editorContent.html,
      descriptionJSON: editorContent.json,
    };
  }

  private mapImpressionToEditorContent(
    editorContent: FindingDBModel
  ): EditorContentDto | null {
    if (!editorContent.impressionHTML) {
      return null;
    }

    return {
      text: editorContent.impression ?? '',
      html: editorContent.impressionHTML ?? '',
      json: editorContent.impressionJSON ?? '',
    };
  }

  private mapEditorContentToImpression(
    editorContent: EditorContentDto | null
  ): Pick<FindingDBModel, 'impression' | 'impressionHTML' | 'impressionJSON'> {
    if (!editorContent) {
      return {
        impression: undefined,
        impressionHTML: undefined,
        impressionJSON: undefined,
      };
    }

    return {
      impression: editorContent.text,
      impressionHTML: editorContent.html,
      impressionJSON: editorContent.json,
    };
  }

  private mapRecommendationToEditorContent(
    editorContent: FindingDBModel
  ): EditorContentDto | null {
    if (!editorContent.recommendationHTML) {
      return null;
    }

    return {
      text: editorContent.recommendation ?? '',
      html: editorContent.recommendationHTML ?? '',
      json: editorContent.recommendationJSON ?? '',
    };
  }

  private mapEditorContentToRecommendation(
    editorContent: EditorContentDto | null
  ): Pick<
    FindingDBModel,
    'recommendation' | 'recommendationHTML' | 'recommendationJSON'
  > {
    if (!editorContent) {
      return {
        recommendation: undefined,
        recommendationHTML: undefined,
        recommendationJSON: undefined,
      };
    }

    return {
      recommendation: editorContent.text,
      recommendationHTML: editorContent.html,
      recommendationJSON: editorContent.json,
    };
  }
}
