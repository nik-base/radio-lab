import { inject, Injectable } from '@angular/core';
import { forkJoin, map, mergeMap, Observable, of, switchMap, take } from 'rxjs';

import { VARIABLE_SOURCE } from '@app/constants';
import { findNextSortOrderWhenOptional } from '@app/utils/functions/order.functions';

import {
  EditorContentDto,
  FindingBaseDto,
  FindingClassifierBaseDto,
  FindingClassifierCreateDto,
  FindingClassifierDataDto,
  FindingClassifierDto,
  FindingClassifierExportDto,
  FindingClassifierImportDto,
  FindingClassifierUpdateDto,
  FindingCreateDto,
  FindingDataDto,
  FindingDto,
  FindingExportDto,
  FindingGroupBaseDto,
  FindingGroupCreateDto,
  FindingGroupDataDto,
  FindingGroupDto,
  FindingGroupExportDto,
  FindingGroupImportDto,
  FindingGroupUpdateDto,
  FindingImportDto,
  FindingUpdateDto,
  ScopeBaseDto,
  ScopeCreateDto,
  ScopeDataDto,
  ScopeDto,
  ScopeExportDto,
  ScopeImportDto,
  ScopeUpdateDto,
  SortOrderItemDto,
  SortOrderUpdateDto,
  TemplateBaseDto,
  TemplateCreateDto,
  TemplateDataDto,
  TemplateDto,
  TemplateExportDto,
  TemplateImportDto,
  TemplateUpdateDto,
  VariableBaseDto,
  VariableCreateDto,
  VariableDto,
  VariableExportDto,
  VariableImportDto,
  VariableUpdateDto,
  VariableValueBaseDto,
  VariableValueCreateDto,
  VariableValueDto,
  VariableValueExportDto,
  VariableValueImportDto,
  VariableValueUpdateDto,
} from '../models/data';
import { ReportBaseService } from '../services/report-base.service';

import { DelayedNgxIndexedDBService } from './delayed-ngx-indexed-db.service';
import { EditorVariableReplaceService } from './editor-variable-replace.service';
import {
  FindingClassifierDBModel,
  FindingDBModel,
  FindingGroupDBModel,
  ScopeDBModel,
  TemplateDBModel,
  VariableDBModel,
  VariableValueDBModel,
} from './report-db.models';

@Injectable({ providedIn: 'root' })
export class ReportDBService extends ReportBaseService {
  private readonly dbService: DelayedNgxIndexedDBService = inject(
    DelayedNgxIndexedDBService
  );

  private readonly editorVariableReplaceService: EditorVariableReplaceService =
    inject(EditorVariableReplaceService);

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
        'scopes',
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

  override fetchFindings$(
    scopeId: string,
    groupId?: string,
    classifierId?: string
  ): Observable<FindingDto[]> {
    return this.dbService
      .getAllByIndex<FindingDBModel>(
        'findings',
        'scopeId',
        IDBKeyRange.only(scopeId)
      )
      .pipe(
        map((findings: FindingDBModel[]) =>
          findings
            .filter(
              (item: FindingDBModel): boolean =>
                item.groupId === groupId && item.classifierId === classifierId
            )
            .map(
              (finding: FindingDBModel): FindingDto =>
                this.mapFindingDBModelToDto(finding)
            )
        )
      );
  }

  override fetchFindingsByScopeId$(scopeId: string): Observable<FindingDto[]> {
    return this.dbService
      .getAllByIndex<FindingDBModel>(
        'findings',
        'scopeId',
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

  override fetchFindingGroups$(scopeId: string): Observable<FindingGroupDto[]> {
    return this.dbService
      .getAllByIndex<FindingGroupDBModel>(
        'findingGroups',
        'scopeId',
        IDBKeyRange.only(scopeId)
      )
      .pipe(
        map((groups: FindingGroupDBModel[]) =>
          groups.map((group: FindingGroupDBModel) =>
            this.mapFindingGroupDBModelToDto(group)
          )
        )
      );
  }

  override fetchFindingClassifiers$(
    scopeId: string,
    groupId?: string
  ): Observable<FindingClassifierDto[]> {
    return this.dbService
      .getAllByIndex<FindingClassifierDBModel>(
        'findingClassifiers',
        'scopeId',
        IDBKeyRange.only(scopeId)
      )
      .pipe(
        map((classifiers: FindingClassifierDBModel[]) =>
          classifiers
            .filter(
              (item: FindingClassifierDBModel): boolean =>
                item.groupId === groupId
            )
            .map((classifier: FindingClassifierDBModel) =>
              this.mapFindingClassifierDBModelToDto(classifier)
            )
        )
      );
  }

  override fetchAllFindingVariables$(): Observable<VariableDto[]> {
    return this.dbService
      .getAllByIndex<VariableDBModel>(
        'variables',
        'source',
        IDBKeyRange.only(VARIABLE_SOURCE.Finding)
      )
      .pipe(
        map((variables: VariableDBModel[]) =>
          variables.map(
            (item: VariableDBModel): VariableDto =>
              this.mapVariableDBModelToDto(item)
          )
        )
      );
  }

  override fetchFindingVariables$(
    findingId: string
  ): Observable<VariableDto[]> {
    return this.dbService
      .getAllByIndex<VariableDBModel>(
        'variables',
        'entityId',
        IDBKeyRange.only(findingId)
      )
      .pipe(
        map((variables: VariableDBModel[]) =>
          variables
            .filter(
              (item: VariableDBModel): boolean =>
                item.source === VARIABLE_SOURCE.Finding
            )
            .map(
              (item: VariableDBModel): VariableDto =>
                this.mapVariableDBModelToDto(item)
            )
        )
      );
  }

  override fetchAllFindingVariablesExcept$(
    findingId: string
  ): Observable<VariableDto[]> {
    return this.dbService
      .getAllByIndex<VariableDBModel>(
        'variables',
        'source',
        IDBKeyRange.only(VARIABLE_SOURCE.Finding)
      )
      .pipe(
        map((variables: VariableDBModel[]) =>
          variables
            .filter(
              (item: VariableDBModel): boolean => item.entityId !== findingId
            )
            .map(
              (item: VariableDBModel): VariableDto =>
                this.mapVariableDBModelToDto(item)
            )
        )
      );
  }

  override fetchVariableValues$(
    variableId: string
  ): Observable<VariableValueDto[]> {
    return this.dbService
      .getAllByIndex<VariableValueDBModel>(
        'variableValues',
        'variableId',
        IDBKeyRange.only(variableId)
      )
      .pipe(
        map((variableValues: VariableValueDBModel[]) =>
          variableValues.map(
            (item: VariableValueDBModel): VariableValueDto =>
              this.mapVariableValueDBModelToDto(item)
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

    return this.createFindingInDb$(dbModel);
  }

  override createFindingGroup$(
    group: FindingGroupCreateDto
  ): Observable<FindingGroupDto> {
    const dbModel: FindingGroupDBModel =
      this.mapFindingGroupCreateDtoToDBModel(group);

    return this.createFindingGroupInDb$(dbModel);
  }

  override createFindingClassifier$(
    classifier: FindingClassifierCreateDto
  ): Observable<FindingClassifierDto> {
    const dbModel: FindingClassifierDBModel =
      this.mapFindingClassifierCreateDtoToDBModel(classifier);

    return this.createFindingClassifierInDb$(dbModel);
  }

  override createVariable$(
    variable: VariableCreateDto
  ): Observable<VariableDto> {
    const dbModel: VariableDBModel =
      this.mapVariableCreateDtoToDBModel(variable);

    return this.createVariableInDb$(dbModel);
  }

  override createVariableValue$(
    variableValue: VariableValueCreateDto
  ): Observable<VariableValueDto> {
    const dbModel: VariableValueDBModel =
      this.mapVariableValueCreateDtoToDBModel(variableValue);

    return this.createVariableValueInDb$(dbModel);
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
      .update<ScopeDBModel>('scopes', dbModel)
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

  override updateFindingGroup$(
    group: FindingGroupUpdateDto
  ): Observable<FindingGroupDto> {
    const dbModel: FindingGroupDBModel =
      this.mapFindingGroupUpdateDtoToDBModel(group);

    return this.dbService
      .update<FindingGroupDBModel>('findingGroups', dbModel)
      .pipe(
        map(
          (data: FindingGroupDBModel): FindingGroupDto =>
            this.mapFindingGroupDBModelToDto(data)
        )
      );
  }

  override updateFindingClassifier$(
    classifier: FindingClassifierUpdateDto
  ): Observable<FindingClassifierDto> {
    const dbModel: FindingClassifierDBModel =
      this.mapFindingClassiferUpdateDtoToDBModel(classifier);

    return this.dbService
      .update<FindingClassifierDBModel>('findingClassifiers', dbModel)
      .pipe(
        map(
          (data: FindingClassifierDBModel): FindingClassifierDto =>
            this.mapFindingClassifierDBModelToDto(data)
        )
      );
  }

  override updateVariable$(
    variable: VariableUpdateDto
  ): Observable<VariableDto> {
    const dbModel: VariableDBModel =
      this.mapVariableUpdateDtoToDBModel(variable);

    return this.dbService
      .update<VariableDBModel>('variables', dbModel)
      .pipe(
        map(
          (data: VariableDBModel): VariableDto =>
            this.mapVariableDBModelToDto(data)
        )
      );
  }

  override updateVariableValue$(
    variableValue: VariableValueUpdateDto
  ): Observable<VariableValueDto> {
    const dbModel: VariableValueDBModel =
      this.mapVariableValueUpdateDtoToDBModel(variableValue);

    return this.dbService
      .update<VariableValueDBModel>('variableValues', dbModel)
      .pipe(
        map(
          (data: VariableValueDBModel): VariableValueDto =>
            this.mapVariableValueDBModelToDto(data)
        )
      );
  }

  override deleteTemplate$(templateId: string): Observable<void> {
    return this.dbService
      .delete<TemplateDBModel>('templates', templateId)
      .pipe(switchMap(() => this.deleteAllScopesByTemplateId$(templateId)));
  }

  override deleteScope$(scopeId: string): Observable<void> {
    return this.dbService
      .delete<ScopeDBModel>('scopes', scopeId)
      .pipe(switchMap(() => this.deleteAllGroupsByScopeId$(scopeId)));
  }

  override deleteFinding$(findingId: string): Observable<void> {
    return this.dbService
      .delete<FindingDBModel>('findings', findingId)
      .pipe(switchMap(() => this.deleteAllVariablesByEntityId$(findingId)));
  }

  override deleteFindingGroup$(groupId: string): Observable<void> {
    return this.dbService
      .delete<FindingGroupDBModel>('findingGroups', groupId)
      .pipe(switchMap(() => this.deleteAllClassifiersByGroupId$(groupId)));
  }

  override deleteFindingClassifier$(classifierId: string): Observable<void> {
    return this.dbService
      .delete<FindingClassifierDBModel>('findingClassifiers', classifierId)
      .pipe(
        switchMap(() => this.deleteAllFindingByClassifierId$(classifierId))
      );
  }

  override deleteVariable$(variableId: string): Observable<void> {
    return this.dbService
      .delete<VariableValueDBModel>('variables', variableId)
      .pipe(
        switchMap(() => this.deleteAllVariableValuesByVariableId$(variableId))
      );
  }

  override deleteVariableValue$(variableValueId: string): Observable<void> {
    return this.dbService
      .delete<VariableValueDBModel>('variableValues', variableValueId)
      .pipe(map(() => void 0));
  }

  override reorderTemplates$(
    sortOrderUpdateRequest: SortOrderUpdateDto
  ): Observable<void> {
    const scopeIds: string[] = sortOrderUpdateRequest.sortOrdersMap.map(
      (sortOrder: SortOrderItemDto): string => sortOrder.id
    );

    const templates$: Observable<TemplateDBModel[]> =
      this.dbService.bulkGet<TemplateDBModel>('templates', scopeIds);

    return templates$.pipe(
      mergeMap((templates: TemplateDBModel[]) => {
        const templatesToUpdate: TemplateDBModel[] =
          this.getUpdatedTemplatesSortOrder(templates, sortOrderUpdateRequest);

        return this.dbService.bulkPut<TemplateDBModel>(
          'templates',
          templatesToUpdate
        );
      }),
      map(() => void 0)
    );
  }

  override reorderScopes$(
    sortOrderUpdateRequest: SortOrderUpdateDto
  ): Observable<void> {
    const scopeIds: string[] = sortOrderUpdateRequest.sortOrdersMap.map(
      (sortOrder: SortOrderItemDto): string => sortOrder.id
    );

    const scopes$: Observable<ScopeDBModel[]> =
      this.dbService.bulkGet<ScopeDBModel>('scopes', scopeIds);

    return scopes$.pipe(
      mergeMap((scopes: ScopeDBModel[]) => {
        const scopesToUpdate: ScopeDBModel[] = this.getUpdatedScopesSortOrder(
          scopes,
          sortOrderUpdateRequest
        );

        return this.dbService.bulkPut<ScopeDBModel>('scopes', scopesToUpdate);
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

  override reorderFindingGroups$(
    sortOrderUpdateRequest: SortOrderUpdateDto
  ): Observable<void> {
    const groupIds: string[] = sortOrderUpdateRequest.sortOrdersMap.map(
      (sortOrder: SortOrderItemDto): string => sortOrder.id
    );

    const groups$: Observable<FindingGroupDBModel[]> =
      this.dbService.bulkGet<FindingGroupDBModel>('findingGroups', groupIds);

    return groups$.pipe(
      mergeMap((groups: FindingGroupDBModel[]) => {
        const groupsToUpdate: FindingGroupDBModel[] =
          this.getUpdatedGroupsSortOrder(groups, sortOrderUpdateRequest);

        return this.dbService.bulkPut<FindingGroupDBModel>(
          'findingGroups',
          groupsToUpdate
        );
      }),
      map(() => void 0)
    );
  }

  override reorderFindingClassifiers$(
    sortOrderUpdateRequest: SortOrderUpdateDto
  ): Observable<void> {
    const classifierIds: string[] = sortOrderUpdateRequest.sortOrdersMap.map(
      (sortOrder: SortOrderItemDto): string => sortOrder.id
    );

    const classifiers$: Observable<FindingClassifierDBModel[]> =
      this.dbService.bulkGet<FindingClassifierDBModel>(
        'findingClassifiers',
        classifierIds
      );

    return classifiers$.pipe(
      mergeMap((classifiers: FindingClassifierDBModel[]) => {
        const classifiersToUpdate: FindingClassifierDBModel[] =
          this.getUpdatedClassifiersSortOrder(
            classifiers,
            sortOrderUpdateRequest
          );

        return this.dbService.bulkPut<FindingClassifierDBModel>(
          'findingClassifiers',
          classifiersToUpdate
        );
      }),
      map(() => void 0)
    );
  }

  override reorderVariables$(
    sortOrderUpdateRequest: SortOrderUpdateDto
  ): Observable<void> {
    const ids: string[] = sortOrderUpdateRequest.sortOrdersMap.map(
      (sortOrder: SortOrderItemDto): string => sortOrder.id
    );

    const entities$: Observable<VariableDBModel[]> =
      this.dbService.bulkGet<VariableDBModel>('variables', ids);

    return entities$.pipe(
      mergeMap((entities: VariableDBModel[]) => {
        const entityToUpdate: VariableDBModel[] =
          this.getUpdatedVariablesSortOrder(entities, sortOrderUpdateRequest);

        return this.dbService.bulkPut<VariableDBModel>(
          'variables',
          entityToUpdate
        );
      }),
      map(() => void 0)
    );
  }

  override reorderVariableValues$(
    sortOrderUpdateRequest: SortOrderUpdateDto
  ): Observable<void> {
    const ids: string[] = sortOrderUpdateRequest.sortOrdersMap.map(
      (sortOrder: SortOrderItemDto): string => sortOrder.id
    );

    const entities$: Observable<VariableValueDBModel[]> =
      this.dbService.bulkGet<VariableValueDBModel>('variableValues', ids);

    return entities$.pipe(
      mergeMap((entities: VariableValueDBModel[]) => {
        const entityToUpdate: VariableValueDBModel[] =
          this.getUpdatedVariableValuesSortOrder(
            entities,
            sortOrderUpdateRequest
          );

        return this.dbService.bulkPut<VariableValueDBModel>(
          'variableValues',
          entityToUpdate
        );
      }),
      map(() => void 0)
    );
  }

  override fetchTemplate$(templateId: string): Observable<TemplateDataDto> {
    return this.fetchTemplateData$(templateId);
  }

  override exportTemplate$(templateId: string): Observable<TemplateExportDto> {
    return this.fetchTemplateData$(
      templateId,
      true
    ) as Observable<TemplateExportDto>;
  }

  override importTemplate$(
    template: TemplateImportDto
  ): Observable<TemplateDto> {
    const templateDbModel: TemplateDBModel =
      this.mapTemplateCreateDtoToDBModel(template);

    const allScopesToCreate: ScopeDBModel[] = [];

    const allGroupsToCreate: FindingGroupDBModel[] = [];

    const allClassifiersToCreate: FindingClassifierDBModel[] = [];

    const allFindingsToCreate: FindingDBModel[] = [];

    const allVariablesToCreate: VariableDBModel[] = [];

    const allVariableValuesToCreate: VariableValueDBModel[] = [];

    template.scopes.forEach((scopeImportDto: ScopeImportDto): void => {
      const newScopeId: string = this.generateId();

      allScopesToCreate.push({
        ...this.mapScopeBaseDtoToDBModel(scopeImportDto),
        id: newScopeId,
        templateId: templateDbModel.id,
      });

      (scopeImportDto.groups || []).forEach(
        (groupImportDto: FindingGroupImportDto): void => {
          const newGroupId: string = this.generateId();

          allGroupsToCreate.push({
            ...this.mapFindingGroupBaseDtoToDBModel(groupImportDto),
            id: newGroupId,
            scopeId: newScopeId,
          });

          (groupImportDto.classifiers || []).forEach(
            (classifierImportDto: FindingClassifierImportDto): void => {
              const newClassifierId: string = this.generateId();

              allClassifiersToCreate.push({
                ...this.mapFindingClassifierBaseDtoToDBModel(
                  classifierImportDto
                ),
                id: newClassifierId,
                scopeId: newScopeId,
                groupId: newGroupId,
              });

              (classifierImportDto.findings || []).forEach(
                (findingImportDto: FindingImportDto): void => {
                  const newFindingId: string = this.generateId();

                  const oldToNewVariableDtoMap: Map<string, VariableDBModel> =
                    new Map<string, VariableDBModel>();

                  (findingImportDto.variables || []).forEach(
                    (variableImportDto: VariableImportDto): void => {
                      const newVariableId: string = this.generateId();

                      const variableDbModel: VariableDBModel = {
                        ...this.mapVariableBaseDtoToDBModel(variableImportDto),
                        id: newVariableId,
                        entityId: newFindingId,
                      };

                      allVariablesToCreate.push(variableDbModel);

                      oldToNewVariableDtoMap.set(
                        variableImportDto.id,
                        variableDbModel
                      );

                      (variableImportDto.variableValues || []).forEach(
                        (
                          variableValueImportDto: VariableValueImportDto
                        ): void => {
                          allVariableValuesToCreate.push({
                            ...this.mapVariableValueBaseDtoToDBModel(
                              variableValueImportDto
                            ),
                            id: this.generateId(),
                            variableId: newVariableId,
                          });
                        }
                      );
                    }
                  );

                  const findingDbModel: FindingDBModel = {
                    ...this.mapFindingBaseDtoToDBModel(findingImportDto),
                    id: newFindingId,
                    scopeId: newScopeId,
                    groupId: newGroupId,
                    classifierId: newClassifierId,
                  };

                  const findingWithReplacedVariables: FindingDBModel =
                    this.getFindingDBModelWithVariablesReplaced(
                      findingDbModel,
                      oldToNewVariableDtoMap
                    );

                  allFindingsToCreate.push(findingWithReplacedVariables);
                }
              );
            }
          );
        }
      );
    });

    const allDbOperations: Observable<TemplateDto | number[]>[] = [
      this.createTemplateInDb$(templateDbModel),
    ];

    if (allScopesToCreate.length > 0) {
      allDbOperations.push(
        this.dbService.bulkAdd<ScopeDBModel>('scopes', allScopesToCreate)
      );
    }

    if (allGroupsToCreate.length > 0) {
      allDbOperations.push(
        this.dbService.bulkAdd<FindingGroupDBModel>(
          'findingGroups',
          allGroupsToCreate
        )
      );
    }

    if (allClassifiersToCreate.length > 0) {
      allDbOperations.push(
        this.dbService.bulkAdd<FindingClassifierDBModel>(
          'findingClassifiers',
          allClassifiersToCreate
        )
      );
    }

    if (allFindingsToCreate.length > 0) {
      allDbOperations.push(
        this.dbService.bulkAdd<FindingDBModel>('findings', allFindingsToCreate)
      );
    }

    if (allVariablesToCreate.length > 0) {
      allDbOperations.push(
        this.dbService.bulkAdd<VariableDBModel>(
          'variables',
          allVariablesToCreate
        )
      );
    }

    if (allVariableValuesToCreate.length > 0) {
      allDbOperations.push(
        this.dbService.bulkAdd<VariableValueDBModel>(
          'variableValues',
          allVariableValuesToCreate
        )
      );
    }

    return forkJoin(allDbOperations).pipe(
      map(
        (results: (TemplateDto | number[])[]): TemplateDto =>
          results[0] as TemplateDto
      )
    );
  }

  override cloneScope$(
    scopeId: string,
    templateId: string
  ): Observable<ScopeDto> {
    return this.cloneScopeByIdIntoTemplate$(scopeId, templateId);
  }

  override cloneFinding$(findingId: string): Observable<FindingDto> {
    return this.cloneFindingById$(findingId);
  }

  override cloneVariable$(
    variableId: string,
    entityId: string
  ): Observable<VariableDto> {
    return this.cloneVariableByIdIntoEntity$(variableId, entityId);
  }

  private generateId(): string {
    return crypto.randomUUID();
  }

  private fetchVariableValuesForVariable$(
    variableId: string
  ): Observable<VariableValueExportDto[]> {
    return this.dbService
      .getAllByIndex<VariableValueDBModel>(
        'variableValues',
        'variableId',
        variableId
      )
      .pipe(
        map((db: VariableValueDBModel[]) =>
          db.map(this.mapVariableValueDBModelToDto.bind(this))
        )
      );
  }

  private fetchVariablesForFinding$(
    findingId: string
  ): Observable<VariableExportDto[]> {
    return this.dbService
      .getAllByIndex<VariableDBModel>('variables', 'entityId', findingId)
      .pipe(
        mergeMap((rows: VariableDBModel[]) => {
          if (!rows || rows.length === 0) {
            return of([]);
          }

          const obs: Observable<VariableExportDto>[] = rows.map(
            (row: VariableDBModel) => {
              const dto: VariableDto = this.mapVariableDBModelToDto(row);

              return this.fetchVariableValuesForVariable$(row.id).pipe(
                map((variableValues: VariableValueExportDto[]) => ({
                  ...dto,
                  variableValues,
                }))
              );
            }
          );

          return forkJoin(obs);
        })
      );
  }

  private fetchFindingsForClassifier$(
    classifierId: string,
    isExport?: boolean
  ): Observable<(FindingDataDto | FindingExportDto)[]> {
    if (isExport) {
      return this.dbService
        .getAllByIndex<FindingDBModel>('findings', 'classifierId', classifierId)
        .pipe(
          mergeMap((rows: FindingDBModel[]) => {
            if (!rows || rows.length === 0) {
              return of([]);
            }

            const obs: Observable<FindingExportDto>[] = rows.map(
              (row: FindingDBModel) => {
                const dto: FindingDto = this.mapFindingDBModelToDto(row);

                return this.fetchVariablesForFinding$(row.id).pipe(
                  map((variables: VariableExportDto[]) => ({
                    ...dto,
                    variables,
                  }))
                );
              }
            );

            return forkJoin(obs);
          })
        );
    }

    return this.dbService
      .getAllByIndex<FindingDBModel>('findings', 'classifierId', classifierId)
      .pipe(
        map((findingsDb: FindingDBModel[]) =>
          findingsDb.map(this.mapFindingDBModelToDto.bind(this))
        )
      );
  }

  private fetchClassifiersForGroup$(
    groupId: string,
    isExport?: boolean
  ): Observable<(FindingClassifierDataDto | FindingClassifierExportDto)[]> {
    return this.dbService
      .getAllByIndex<FindingClassifierDBModel>(
        'findingClassifiers',
        'groupId',
        groupId
      )
      .pipe(
        mergeMap((classifiersDb: FindingClassifierDBModel[]) => {
          if (!classifiersDb || classifiersDb.length === 0) {
            return of([]);
          }

          const classifierObservables: Observable<FindingClassifierDataDto>[] =
            classifiersDb.map((classifierDb: FindingClassifierDBModel) => {
              const classifierDto: FindingClassifierDto =
                this.mapFindingClassifierDBModelToDto(classifierDb);

              return this.fetchFindingsForClassifier$(
                classifierDb.id,
                isExport
              ).pipe(
                map((findingsDto: FindingDataDto[]) => ({
                  ...classifierDto,
                  findings: findingsDto,
                }))
              );
            });

          return forkJoin(classifierObservables);
        })
      );
  }

  private fetchGroupsForScope$(
    scopeId: string,
    isExport?: boolean
  ): Observable<(FindingGroupDataDto | FindingGroupExportDto)[]> {
    return this.dbService
      .getAllByIndex<FindingGroupDBModel>('findingGroups', 'scopeId', scopeId)
      .pipe(
        mergeMap((groupsDb: FindingGroupDBModel[]) => {
          if (!groupsDb || groupsDb.length === 0) {
            return of([]);
          }

          const groupObservables: Observable<FindingGroupDataDto>[] =
            groupsDb.map((groupDb: FindingGroupDBModel) => {
              const groupDto: FindingGroupDto =
                this.mapFindingGroupDBModelToDto(groupDb);

              return this.fetchClassifiersForGroup$(groupDb.id, isExport).pipe(
                map((classifiersDataDto: FindingClassifierDataDto[]) => ({
                  ...groupDto,
                  classifiers: classifiersDataDto,
                }))
              );
            });

          return forkJoin(groupObservables);
        })
      );
  }

  private fetchScopesForTemplate$(
    templateId: string,
    isExport?: boolean
  ): Observable<(ScopeDataDto | ScopeExportDto)[]> {
    return this.dbService
      .getAllByIndex<ScopeDBModel>('scopes', 'templateId', templateId)
      .pipe(
        mergeMap((scopesDb: ScopeDBModel[]) => {
          if (!scopesDb || scopesDb.length === 0) {
            return of([]);
          }

          const scopeObservables: Observable<ScopeDataDto>[] = scopesDb.map(
            (scopeDb: ScopeDBModel) => {
              const scopeDto: ScopeDto = this.mapScopeDBModelToDto(scopeDb);

              return this.fetchGroupsForScope$(scopeDb.id, isExport).pipe(
                map((groupsDataDto: FindingGroupDataDto[]) => ({
                  ...scopeDto,
                  groups: groupsDataDto,
                }))
              );
            }
          );

          return forkJoin(scopeObservables);
        })
      );
  }

  private fetchTemplateData$(
    templateId: string,
    isExport?: boolean
  ): Observable<TemplateDataDto | TemplateExportDto> {
    return this.dbService
      .getByID<TemplateDBModel>('templates', templateId)
      .pipe(
        take(1),
        mergeMap((templateDb: TemplateDBModel) => {
          const templateDto: TemplateDto =
            this.mapTemplateDBModelToDto(templateDb);

          return this.fetchScopesForTemplate$(templateDb.id, isExport).pipe(
            map((scopesDataDto: ScopeDataDto[]) => ({
              ...templateDto,
              scopes: scopesDataDto,
            }))
          );
        })
      );
  }

  private cloneFindingById$(findingId: string): Observable<FindingDto> {
    return this.dbService.getByID<FindingDBModel>('findings', findingId).pipe(
      take(1),
      switchMap((originalFinding: FindingDBModel) =>
        this.dbService
          .getAllByIndex<FindingDBModel>(
            'findings',
            'classifierId',
            IDBKeyRange.only(originalFinding.classifierId)
          )
          .pipe(
            mergeMap((siblingFindings: FindingDBModel[]) => {
              const nextSortOrder: number =
                findNextSortOrderWhenOptional(siblingFindings);

              const newFindingId: string = this.generateId();

              return this.cloneVariables$(findingId, newFindingId).pipe(
                mergeMap((variableIdsMap: Map<string, VariableDto>) => {
                  const newFindingWithVariablesReplaced: FindingDBModel =
                    this.getFindingDBModelWithVariablesReplaced(
                      originalFinding,
                      variableIdsMap
                    );

                  return this.createFindingInDb$({
                    ...newFindingWithVariablesReplaced,
                    id: newFindingId,
                    sortOrder: nextSortOrder,
                  });
                })
              );
            })
          )
      )
    );
  }

  private getFindingDBModelWithVariablesReplaced(
    finding: FindingDBModel,
    variableIdsMap: Map<string, VariableDto | VariableDBModel>
  ): FindingDBModel {
    const varIdsMap: Map<string, string> = new Map<string, string>();

    variableIdsMap.forEach((value: VariableDto, key: string) => {
      varIdsMap.set(key, value.id);
    });

    const descriptionHTML: string | undefined =
      this.editorVariableReplaceService.replaceInHtml(
        finding.descriptionHTML,
        varIdsMap
      );

    const descriptionJSON: string | undefined =
      this.editorVariableReplaceService.replaceInJson(
        finding.descriptionJSON,
        varIdsMap
      );

    const impressionHTML: string | undefined =
      this.editorVariableReplaceService.replaceInHtml(
        finding.impressionHTML,
        varIdsMap
      );

    const impressionJSON: string | undefined =
      this.editorVariableReplaceService.replaceInJson(
        finding.impressionJSON,
        varIdsMap
      );

    const recommendationHTML: string | undefined =
      this.editorVariableReplaceService.replaceInHtml(
        finding.recommendationHTML,
        varIdsMap
      );

    const recommendationJSON: string | undefined =
      this.editorVariableReplaceService.replaceInJson(
        finding.recommendationJSON,
        varIdsMap
      );

    return {
      ...finding,
      descriptionHTML,
      descriptionJSON,
      impressionHTML,
      impressionJSON,
      recommendationHTML,
      recommendationJSON,
    };
  }

  private cloneVariables$(
    cloneEntityId: string,
    entityId: string
  ): Observable<Map<string, VariableDto>> {
    return this.dbService
      .getAllByIndex<VariableDBModel>('variables', 'entityId', cloneEntityId)
      .pipe(
        mergeMap((originalVariables: VariableDBModel[]) => {
          if (!originalVariables || originalVariables.length === 0) {
            return of(new Map<string, VariableDto>());
          }

          const variablesMap: Map<string, VariableDto> = new Map<
            string,
            VariableDto
          >();

          const cloneOps$: Observable<VariableDto>[] = originalVariables.map(
            (originalVariable: VariableDBModel) => {
              const newVariableId: string = this.generateId();

              return this.createVariableInDb$({
                ...originalVariable,
                id: newVariableId,
                entityId,
              }).pipe(
                mergeMap((newVariableDto: VariableDto) =>
                  this.cloneVariableValues$(
                    originalVariable.id,
                    newVariableDto.id
                  ).pipe(
                    map(() => {
                      variablesMap.set(originalVariable.id, newVariableDto);

                      return newVariableDto;
                    })
                  )
                )
              );
            }
          );

          return forkJoin(cloneOps$).pipe(map(() => variablesMap));
        })
      );
  }

  private cloneVariableValues$(
    cloneVariableId: string,
    variableId: string
  ): Observable<VariableValueDto[]> {
    return this.dbService
      .getAllByIndex<VariableValueDBModel>(
        'variableValues',
        'variableId',
        cloneVariableId
      )
      .pipe(
        mergeMap((originalValues: VariableValueDBModel[]) => {
          if (!originalValues || originalValues.length === 0) {
            return of([]);
          }

          const cloneOps$: Observable<VariableValueDto>[] = originalValues.map(
            (originalValue: VariableValueDBModel) =>
              this.createVariableValueInDb$({
                ...originalValue,
                id: this.generateId(),
                variableId,
              })
          );

          return forkJoin(cloneOps$);
        })
      );
  }

  private cloneVariableByIdIntoEntity$(
    variableId: string,
    entityId: string
  ): Observable<VariableDto> {
    return this.dbService
      .getByID<VariableDBModel>('variables', variableId)
      .pipe(
        take(1),
        switchMap((originalVariable: VariableDBModel) =>
          this.dbService
            .getAllByIndex<VariableDBModel>(
              'variables',
              'entityId',
              IDBKeyRange.only(entityId)
            )
            .pipe(
              mergeMap((siblingVariables: VariableDBModel[]) => {
                const newSortOrder: number =
                  findNextSortOrderWhenOptional(siblingVariables);

                const newVariableId: string = this.generateId();

                return this.createVariableInDb$({
                  ...originalVariable,
                  id: newVariableId,
                  entityId,
                  sortOrder: newSortOrder,
                }).pipe(
                  mergeMap((newVariableDto: VariableDto) =>
                    this.cloneVariableValues$(
                      variableId,
                      newVariableDto.id
                    ).pipe(map(() => newVariableDto))
                  )
                );
              })
            )
        )
      );
  }

  private cloneScopeByIdIntoTemplate$(
    scopeId: string,
    templateId: string
  ): Observable<ScopeDto> {
    return this.dbService.getByID<ScopeDBModel>('scopes', scopeId).pipe(
      take(1),
      switchMap((originalScope: ScopeDBModel) =>
        this.dbService
          .getAllByIndex<ScopeDBModel>(
            'scopes',
            'templateId',
            IDBKeyRange.only(templateId)
          )
          .pipe(
            switchMap((siblingScopes: ScopeDBModel[]) => {
              const newSortOrder: number =
                findNextSortOrderWhenOptional(siblingScopes);

              const newScopeId: string = this.generateId();

              return this.createScopeInDb$({
                ...originalScope,
                id: newScopeId,
                templateId,
                sortOrder: newSortOrder,
              }).pipe(
                mergeMap((newScopeDto: ScopeDto) =>
                  this.cloneGroups$(scopeId, newScopeDto.id).pipe(
                    map(() => newScopeDto)
                  )
                )
              );
            })
          )
      )
    );
  }

  private cloneGroups$(
    cloneScopeId: string,
    scopeId: string
  ): Observable<FindingGroupDto[]> {
    return this.dbService
      .getAllByIndex<FindingGroupDBModel>(
        'findingGroups',
        'scopeId',
        cloneScopeId
      )
      .pipe(
        mergeMap((originalGroups: FindingGroupDBModel[]) => {
          if (!originalGroups || originalGroups.length === 0) {
            return of([]);
          }

          const cloneOps$: Observable<FindingGroupDto>[] = originalGroups.map(
            (originalGroup: FindingGroupDBModel) => {
              const newGroupId: string = this.generateId();

              return this.createFindingGroupInDb$({
                ...originalGroup,
                id: newGroupId,
                scopeId,
              }).pipe(
                mergeMap((newGroupDto: FindingGroupDto) =>
                  this.cloneClassifiers$(
                    originalGroup.id,
                    newGroupDto.id,
                    scopeId
                  ).pipe(map(() => newGroupDto))
                )
              );
            }
          );

          return forkJoin(cloneOps$);
        })
      );
  }

  private cloneClassifiers$(
    cloneGroupId: string,
    groupId: string,
    scopeId: string
  ): Observable<FindingClassifierDto[]> {
    return this.dbService
      .getAllByIndex<FindingClassifierDBModel>(
        'findingClassifiers',
        'groupId',
        cloneGroupId
      )
      .pipe(
        mergeMap((originalClassifiers: FindingClassifierDBModel[]) => {
          if (!originalClassifiers || originalClassifiers.length === 0) {
            return of([]);
          }

          const cloneOps$: Observable<FindingClassifierDto>[] =
            originalClassifiers.map(
              (originalClassifier: FindingClassifierDBModel) => {
                const newClassifierId: string = this.generateId();

                return this.createFindingClassifierInDb$({
                  ...originalClassifier,
                  id: newClassifierId,
                  groupId,
                  scopeId,
                }).pipe(
                  mergeMap((newClassifierDto: FindingClassifierDto) =>
                    this.cloneFindings$(
                      originalClassifier.id,
                      newClassifierDto.id,
                      groupId,
                      scopeId
                    ).pipe(map(() => newClassifierDto))
                  )
                );
              }
            );

          return forkJoin(cloneOps$);
        })
      );
  }

  private cloneFindings$(
    cloneClassifierId: string,
    classifierId: string,
    groupId: string,
    scopeId: string
  ): Observable<FindingDto[]> {
    return this.dbService
      .getAllByIndex<FindingDBModel>(
        'findings',
        'classifierId',
        cloneClassifierId
      )
      .pipe(
        mergeMap((originalFindings: FindingDBModel[]) => {
          if (!originalFindings || originalFindings.length === 0) {
            return of([]);
          }

          const cloneOps$: Observable<FindingDto>[] = originalFindings.map(
            (originalFinding: FindingDBModel) => {
              const newFindingId: string = this.generateId();

              return this.cloneVariables$(
                originalFinding.id,
                newFindingId
              ).pipe(
                mergeMap((variableIdsMap: Map<string, VariableDto>) => {
                  const newFindingWithVariablesReplaced: FindingDBModel =
                    this.getFindingDBModelWithVariablesReplaced(
                      originalFinding,
                      variableIdsMap
                    );

                  return this.createFindingInDb$({
                    ...newFindingWithVariablesReplaced,
                    id: newFindingId,
                    classifierId,
                    groupId,
                    scopeId,
                  });
                })
              );
            }
          );

          return forkJoin(cloneOps$);
        })
      );
  }

  private cloneVariableValue$(
    variableValueId: string,
    variableId: string
  ): Observable<VariableValueDto> {
    return this.dbService
      .getByID<VariableValueDBModel>('variableValues', variableValueId)
      .pipe(
        take(1),
        mergeMap((variableValue: VariableValueDBModel) =>
          this.createVariableValueInDb$({
            ...variableValue,
            id: this.generateId(),
            variableId,
          })
        )
      );
  }

  private getImportObservable$<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TParentImport extends Record<string, any>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TEntityImport extends Record<string, any>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TDBModel extends Record<string, any>,
  >(
    parent: TParentImport,
    childKey: string,
    parentIdKey: string,
    parentId: string,
    dbStoreName: string,
    dbModelMapper: (entity: TEntityImport) => Partial<TDBModel>
  ): {
    readonly observable: Observable<number[]>;
    entries: [string, TEntityImport][];
  } {
    const idsMap: Record<string, TEntityImport> = this.generateIdsMap([
      ...(parent[childKey] as Iterable<TEntityImport>),
    ]);

    const entries: [string, TEntityImport][] = Object.entries(idsMap);

    const rows: TDBModel[] = entries.map(
      ([id, row]: [string, TEntityImport]): TDBModel =>
        ({
          ...dbModelMapper(row),
          id,
          [parentIdKey]: parentId,
        }) as unknown as TDBModel
    );

    return {
      observable: this.dbService.bulkAdd<TDBModel>(dbStoreName, rows),
      entries,
    };
  }

  private deleteAllVariablesByEntityId$(entityId: string): Observable<void> {
    return this.dbService
      .deleteAllByIndex<VariableDBModel>('variables', 'entityId', entityId)
      .pipe(map(() => void 0));
  }

  private deleteAllVariableValuesByVariableId$(
    variableId: string
  ): Observable<void> {
    return this.dbService
      .deleteAllByIndex<VariableValueDBModel>(
        'variableValues',
        'variableId',
        variableId
      )
      .pipe(map(() => void 0));
  }

  private deleteAllFindingByClassifierId$(
    classifierId: string
  ): Observable<void> {
    return this.dbService
      .deleteAllByIndex<FindingDBModel>(
        'findings',
        'classifierId',
        classifierId
      )
      .pipe(map(() => void 0));
  }

  private deleteAllClassifiersByGroupId$(groupId: string): Observable<void> {
    return this.dbService
      .getAllByIndex<FindingClassifierDBModel>(
        'findingClassifiers',
        'groupId',
        groupId
      )
      .pipe(
        mergeMap((items: FindingClassifierDBModel[]) => {
          const obserables: Observable<void>[] = [];

          obserables.push(
            this.dbService.deleteAllByIndex<FindingClassifierDBModel>(
              'findingClassifiers',
              'groupId',
              groupId
            )
          );

          items.forEach((item: FindingClassifierDBModel) => {
            obserables.push(this.deleteAllFindingByClassifierId$(item.id));
          });

          return forkJoin(obserables).pipe(map(() => void 0));
        })
      );
  }

  private deleteAllGroupsByScopeId$(scopeId: string): Observable<void> {
    return this.dbService
      .getAllByIndex<FindingGroupDBModel>('findingGroups', 'scopeId', scopeId)
      .pipe(
        mergeMap((items: FindingGroupDBModel[]) => {
          const obserables: Observable<void>[] = [];

          obserables.push(
            this.dbService.deleteAllByIndex<FindingGroupDBModel>(
              'findingGroups',
              'scopeId',
              scopeId
            )
          );

          items.forEach((item: FindingGroupDBModel) => {
            obserables.push(this.deleteAllClassifiersByGroupId$(item.id));
          });

          return forkJoin(obserables).pipe(map(() => void 0));
        })
      );
  }

  private deleteAllScopesByTemplateId$(templateId: string): Observable<void> {
    return this.dbService
      .getAllByIndex<ScopeDBModel>('scopes', 'templateId', templateId)
      .pipe(
        mergeMap((items: ScopeDBModel[]) => {
          const obserables: Observable<void>[] = [];

          obserables.push(
            this.dbService.deleteAllByIndex<ScopeDBModel>(
              'scopes',
              'templateId',
              templateId
            )
          );

          items.forEach((item: ScopeDBModel) => {
            obserables.push(this.deleteAllGroupsByScopeId$(item.id));
          });

          return forkJoin(obserables).pipe(map(() => void 0));
        })
      );
  }

  private createScopeInDb$(dbModel: ScopeDBModel): Observable<ScopeDto> {
    return this.dbService
      .add<ScopeDBModel>('scopes', dbModel)
      .pipe(
        map((data: ScopeDBModel): ScopeDto => this.mapScopeDBModelToDto(data))
      );
  }

  private createFindingInDb$(dbModel: FindingDBModel): Observable<FindingDto> {
    return this.dbService
      .add<FindingDBModel>('findings', dbModel)
      .pipe(
        map(
          (data: FindingDBModel): FindingDto =>
            this.mapFindingDBModelToDto(data)
        )
      );
  }

  private createFindingGroupInDb$(
    dbModel: FindingGroupDBModel
  ): Observable<FindingGroupDto> {
    return this.dbService
      .add<FindingGroupDBModel>('findingGroups', dbModel)
      .pipe(
        map(
          (data: FindingGroupDBModel): FindingGroupDto =>
            this.mapFindingGroupDBModelToDto(data)
        )
      );
  }

  private createFindingClassifierInDb$(
    dbModel: FindingClassifierDBModel
  ): Observable<FindingClassifierDto> {
    return this.dbService
      .add<FindingClassifierDBModel>('findingClassifiers', dbModel)
      .pipe(
        map(
          (data: FindingClassifierDBModel): FindingClassifierDto =>
            this.mapFindingClassifierDBModelToDto(data)
        )
      );
  }

  private createVariableInDb$(
    dbModel: VariableDBModel
  ): Observable<VariableDto> {
    return this.dbService
      .add<VariableDBModel>('variables', dbModel)
      .pipe(
        map(
          (data: VariableDBModel): VariableDto =>
            this.mapVariableDBModelToDto(data)
        )
      );
  }

  private createVariableValueInDb$(
    dbModel: VariableValueDBModel
  ): Observable<VariableValueDto> {
    return this.dbService
      .add<VariableValueDBModel>('variableValues', dbModel)
      .pipe(
        map(
          (data: VariableValueDBModel): VariableValueDto =>
            this.mapVariableValueDBModelToDto(data)
        )
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

  private generateIdsMap<T>(entities: T[]): Record<string, T> {
    return entities.reduce(
      (accumulator: Record<string, T>, current: T) => {
        accumulator[this.generateId()] = current;
        return accumulator;
      },
      {} as Record<string, T>
    );
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

  private getUpdatedTemplatesSortOrder(
    templates: TemplateDBModel[],
    sortOrderUpdateRequest: SortOrderUpdateDto
  ): TemplateDBModel[] {
    return templates.map((template: TemplateDBModel): TemplateDBModel => {
      const sortOrderItem: SortOrderItemDto | undefined =
        sortOrderUpdateRequest.sortOrdersMap.find(
          (sortOrder: SortOrderItemDto): boolean => sortOrder.id === template.id
        );

      if (!sortOrderItem) {
        return template;
      }

      return {
        ...template,
        sortOrder: sortOrderItem.sortOrder,
      };
    });
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
        sortOrder: sortOrderItem.sortOrder,
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
        sortOrder: sortOrderItem.sortOrder,
      };
    });
  }

  private getUpdatedGroupsSortOrder(
    groups: FindingGroupDBModel[],
    sortOrderUpdateRequest: SortOrderUpdateDto
  ): FindingGroupDBModel[] {
    return groups.map((group: FindingGroupDBModel): FindingGroupDBModel => {
      const sortOrderItem: SortOrderItemDto | undefined =
        sortOrderUpdateRequest.sortOrdersMap.find(
          (sortOrder: SortOrderItemDto): boolean => sortOrder.id === group.id
        );

      if (!sortOrderItem) {
        return group;
      }

      return {
        ...group,
        sortOrder: sortOrderItem.sortOrder,
      };
    });
  }

  private getUpdatedClassifiersSortOrder(
    classifiers: FindingClassifierDBModel[],
    sortOrderUpdateRequest: SortOrderUpdateDto
  ): FindingClassifierDBModel[] {
    return classifiers.map(
      (classifier: FindingClassifierDBModel): FindingClassifierDBModel => {
        const sortOrderItem: SortOrderItemDto | undefined =
          sortOrderUpdateRequest.sortOrdersMap.find(
            (sortOrder: SortOrderItemDto): boolean =>
              sortOrder.id === classifier.id
          );

        if (!sortOrderItem) {
          return classifier;
        }

        return {
          ...classifier,
          sortOrder: sortOrderItem.sortOrder,
        };
      }
    );
  }

  private getUpdatedVariablesSortOrder(
    entities: VariableDBModel[],
    sortOrderUpdateRequest: SortOrderUpdateDto
  ): VariableDBModel[] {
    return entities.map((entity: VariableDBModel): VariableDBModel => {
      const sortOrderItem: SortOrderItemDto | undefined =
        sortOrderUpdateRequest.sortOrdersMap.find(
          (sortOrder: SortOrderItemDto): boolean => sortOrder.id === entity.id
        );

      if (!sortOrderItem) {
        return entity;
      }

      return {
        ...entity,
        sortOrder: sortOrderItem.sortOrder,
      };
    });
  }

  private getUpdatedVariableValuesSortOrder(
    entities: VariableValueDBModel[],
    sortOrderUpdateRequest: SortOrderUpdateDto
  ): VariableValueDBModel[] {
    return entities.map(
      (entity: VariableValueDBModel): VariableValueDBModel => {
        const sortOrderItem: SortOrderItemDto | undefined =
          sortOrderUpdateRequest.sortOrdersMap.find(
            (sortOrder: SortOrderItemDto): boolean => sortOrder.id === entity.id
          );

        if (!sortOrderItem) {
          return entity;
        }

        return {
          ...entity,
          sortOrder: sortOrderItem.sortOrder,
        };
      }
    );
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
      scopeId: finding.scopeId,
      groupId: finding.groupId,
      classifierId: finding.classifierId,
    };
  }

  private mapFindingGroupUpdateDtoToDBModel(
    group: FindingGroupUpdateDto
  ): FindingGroupDBModel {
    return {
      ...this.mapFindingGroupBaseDtoToDBModel(group),
      id: group.id,
      scopeId: group.scopeId,
    };
  }

  private mapFindingClassiferUpdateDtoToDBModel(
    classifier: FindingClassifierUpdateDto
  ): FindingClassifierDBModel {
    return {
      ...this.mapFindingClassifierBaseDtoToDBModel(classifier),
      id: classifier.id,
      scopeId: classifier.scopeId,
      groupId: classifier.groupId,
    };
  }

  private mapVariableUpdateDtoToDBModel(
    variable: VariableUpdateDto
  ): VariableDBModel {
    return {
      ...this.mapVariableBaseDtoToDBModel(variable),
      id: variable.id,
      entityId: variable.entityId,
    };
  }

  private mapVariableValueUpdateDtoToDBModel(
    variableValue: VariableValueUpdateDto
  ): VariableValueDBModel {
    return {
      ...this.mapVariableValueBaseDtoToDBModel(variableValue),
      id: variableValue.id,
      variableId: variableValue.variableId,
    };
  }

  private mapTemplateBaseDtoToDBModel(
    template: TemplateBaseDto
  ): Omit<TemplateDBModel, 'id'> {
    return {
      ...this.mapEditorContentToProtocol(template.protocol),
      ...this.mapEditorContentToPatientInfo(template.patientInfo),
      name: template.name,
      sortOrder: template.sortOrder,
    };
  }

  private mapFindingDBModelToCreateDto(
    template: FindingDBModel
  ): FindingCreateDto {
    return {
      ...this.mapFindingDBModelToBaseDto(template),
      scopeId: template.scopeId,
      groupId: template.groupId,
      classifierId: template.classifierId,
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
      sortOrder: template.sortOrder,
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
      sortOrder: scope.sortOrder,
    };
  }

  private mapFindingGroupBaseDtoToDBModel(
    group: FindingGroupBaseDto
  ): Omit<FindingGroupDBModel, 'id' | 'scopeId'> {
    return {
      name: group.name,
      sortOrder: group.sortOrder,
      isDefault: group.isDefault,
    };
  }

  private mapFindingClassifierBaseDtoToDBModel(
    classifier: FindingClassifierBaseDto
  ): Omit<FindingClassifierDBModel, 'id' | 'scopeId' | 'groupId'> {
    return {
      name: classifier.name,
      sortOrder: classifier.sortOrder,
      isDefault: classifier.isDefault,
    };
  }

  private mapVariableBaseDtoToDBModel(
    variable: VariableBaseDto
  ): Omit<VariableDBModel, 'id' | 'entityId'> {
    return {
      name: variable.name,
      sortOrder: variable.sortOrder,
      source: variable.source,
      type: variable.type,
    };
  }

  private mapVariableValueBaseDtoToDBModel(
    variableValue: VariableValueBaseDto
  ): Omit<VariableValueDBModel, 'id' | 'variableId'> {
    return {
      name: variableValue.name,
      sortOrder: variableValue.sortOrder,
    };
  }

  private mapScopeCreateDtoToDBModel(scope: ScopeCreateDto): ScopeDBModel {
    return {
      ...this.mapScopeBaseDtoToDBModel(scope),
      id: this.generateId(),
      templateId: scope.templateId,
    };
  }

  private mapFindingGroupCreateDtoToDBModel(
    group: FindingGroupCreateDto
  ): FindingGroupDBModel {
    return {
      ...this.mapFindingGroupBaseDtoToDBModel(group),
      id: this.generateId(),
      scopeId: group.scopeId,
    };
  }

  private mapFindingClassifierCreateDtoToDBModel(
    classifier: FindingClassifierCreateDto
  ): FindingClassifierDBModel {
    return {
      ...this.mapFindingGroupBaseDtoToDBModel(classifier),
      id: this.generateId(),
      scopeId: classifier.scopeId,
      groupId: classifier.groupId,
    };
  }

  private mapVariableCreateDtoToDBModel(
    variable: VariableCreateDto
  ): VariableDBModel {
    return {
      ...this.mapVariableBaseDtoToDBModel(variable),
      id: this.generateId(),
      entityId: variable.entityId,
    };
  }

  private mapVariableValueCreateDtoToDBModel(
    variableValue: VariableValueCreateDto
  ): VariableValueDBModel {
    return {
      ...this.mapVariableValueBaseDtoToDBModel(variableValue),
      id: this.generateId(),
      variableId: variableValue.variableId,
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
      sortOrder: scope.sortOrder,
    };
  }

  private mapScopeDBModelToDto(scope: ScopeDBModel): ScopeDto {
    return {
      ...this.mapScopeDBModelToBaseDto(scope),
      id: scope.id,
      templateId: scope.templateId,
    };
  }

  private mapFindingGroupDBModelToDto(
    group: FindingGroupDBModel
  ): FindingGroupDto {
    return {
      ...this.mapFindingGroupBaseDtoToDBModel(group),
      id: group.id,
      scopeId: group.scopeId,
    };
  }

  private mapFindingClassifierDBModelToDto(
    classifier: FindingClassifierDBModel
  ): FindingClassifierDto {
    return {
      ...this.mapFindingClassifierBaseDtoToDBModel(classifier),
      id: classifier.id,
      scopeId: classifier.scopeId,
      groupId: classifier.groupId,
    };
  }

  private mapVariableDBModelToDto(variable: VariableDBModel): VariableDto {
    return {
      ...this.mapVariableBaseDtoToDBModel(variable),
      id: variable.id,
      entityId: variable.entityId,
    };
  }

  private mapVariableValueDBModelToDto(
    variableValue: VariableValueDBModel
  ): VariableValueDto {
    return {
      ...this.mapVariableValueBaseDtoToDBModel(variableValue),
      id: variableValue.id,
      variableId: variableValue.variableId,
    };
  }

  private mapFindingBaseDtoToDBModel(
    finding: FindingBaseDto
  ): Omit<FindingDBModel, 'id' | 'scopeId' | 'groupId' | 'classifierId'> {
    return {
      ...this.mapEditorContentToFindingDescription(finding.description),
      ...this.mapEditorContentToImpression(finding.impression),
      ...this.mapEditorContentToRecommendation(finding.recommendation),
      name: finding.name,
      sortOrder: finding.sortOrder,
      isNormal: finding.isNormal,
    };
  }

  private mapFindingCreateDtoToDBModel(
    finding: FindingCreateDto
  ): FindingDBModel {
    return {
      ...this.mapFindingBaseDtoToDBModel(finding),
      id: this.generateId(),
      scopeId: finding.scopeId,
      groupId: finding.groupId,
      classifierId: finding.classifierId,
    };
  }

  private mapFindingDBModelToBaseDto(finding: FindingDBModel): FindingBaseDto {
    return {
      name: finding.name,
      isNormal: finding.isNormal ?? false,
      sortOrder: finding.sortOrder ?? 0,
      description: this.mapFindingDescriptionToEditorContent(finding),
      impression: this.mapImpressionToEditorContent(finding),
      recommendation: this.mapRecommendationToEditorContent(finding),
    };
  }

  private mapFindingDBModelToDto(finding: FindingDBModel): FindingDto {
    return {
      ...this.mapFindingDBModelToBaseDto(finding),
      id: finding.id,
      scopeId: finding.scopeId,
      groupId: finding.groupId,
      classifierId: finding.classifierId,
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
