import { inject, Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { concatMap, forkJoin, map, mergeMap, Observable, of } from 'rxjs';

import {
  RadioFindingAreaBaseDto,
  RadioFindingAreaCreateRequestDto,
  RadioFindingAreaDto,
  RadioFindingAreaImportModelDto,
  RadioFindingAreaModelDto,
  RadioFindingAreaUpdateRequestDto,
  RadioFindingDetailsBaseDto,
  RadioFindingDetailsCreateRequestDto,
  RadioFindingDetailsDto,
  RadioFindingDetailsUpdateRequestDto,
  RadioSortOrderModelDto,
  RadioSortOrderUpdateRequestDto,
  RadioTemplateBaseDto,
  RadioTemplateCreateRequestDto,
  RadioTemplateDto,
  RadioTemplateImportModelDto,
  RadioTemplateModelDto,
  RadioTemplateUpdateRequestDto,
  RTFEditorContentDto,
} from '../models/data';

import {
  RadioFindingAreaDBModel,
  RadioFindingDetailsDBModel,
  RadioTemplateDBModel,
} from './radio-db.models';

@Injectable()
export class RadioDBService {
  private readonly radioDBService: NgxIndexedDBService =
    inject(NgxIndexedDBService);

  fetchTemplates$(): Observable<RadioTemplateDto[]> {
    return this.radioDBService
      .getAll<RadioTemplateDBModel>('templates')
      .pipe(
        map((templates: RadioTemplateDBModel[]) =>
          templates.map(
            (template: RadioTemplateDBModel): RadioTemplateDto =>
              this.mapTemplateDBModelToTemplateDto(template)
          )
        )
      );
  }

  fetchFindingAreas$(templateId: string): Observable<RadioFindingAreaDto[]> {
    return this.radioDBService
      .getAllByIndex<RadioFindingAreaDBModel>(
        'protocols',
        'templateId',
        IDBKeyRange.only(templateId)
      )
      .pipe(
        map((findingAreas: RadioFindingAreaDBModel[]) =>
          findingAreas.map(
            (findingArea: RadioFindingAreaDBModel): RadioFindingAreaDto =>
              this.mapFindingAreaDBModelToFindingAreaDto(findingArea)
          )
        )
      );
  }

  fetchFindingDetails$(
    findingAreaId: string
  ): Observable<RadioFindingDetailsDto[]> {
    return this.radioDBService
      .getAllByIndex<RadioFindingDetailsDBModel>(
        'findings',
        'protocolId',
        IDBKeyRange.only(findingAreaId)
      )
      .pipe(
        map((findingDetails: RadioFindingDetailsDBModel[]) =>
          findingDetails.map(
            (
              findingDetail: RadioFindingDetailsDBModel
            ): RadioFindingDetailsDto =>
              this.mapFindingDetailsDBModelToFindingDetailsDto(findingDetail)
          )
        )
      );
  }

  createTemplate$(
    template: RadioTemplateCreateRequestDto
  ): Observable<RadioTemplateDto> {
    const dbModel: RadioTemplateDBModel =
      this.mapTemplateCreateRequestToTemplateDBModel(template);

    return this.createTemplateInDb$(dbModel);
  }

  createFindingArea$(
    findingArea: RadioFindingAreaCreateRequestDto
  ): Observable<RadioFindingAreaDto> {
    const dbModel: RadioFindingAreaDBModel =
      this.mapFindingAreaCreateRequestToFindingAreaDBModel(findingArea);

    return this.createFindingAreaInDb$(dbModel);
  }

  createFindingDetails$(
    findingDetails: RadioFindingDetailsCreateRequestDto
  ): Observable<RadioFindingDetailsDto> {
    const dbModel: RadioFindingDetailsDBModel =
      this.mapFindingDetailsCreateRequestToFindingDetailsDBModel(
        findingDetails
      );

    return this.radioDBService
      .add<RadioFindingDetailsDBModel>('findings', dbModel)
      .pipe(
        map(
          (data: RadioFindingDetailsDBModel): RadioFindingDetailsDto =>
            this.mapFindingDetailsDBModelToFindingDetailsDto(data)
        )
      );
  }

  updateTemplate$(
    template: RadioTemplateUpdateRequestDto
  ): Observable<RadioTemplateDto> {
    const dbModel: RadioTemplateDBModel =
      this.mapTemplateUpdateRequestToTemplateDBModel(template);

    return this.radioDBService
      .update<RadioTemplateDBModel>('templates', dbModel)
      .pipe(
        map(
          (data: RadioTemplateDBModel): RadioTemplateDto =>
            this.mapTemplateDBModelToTemplateDto(data)
        )
      );
  }

  updateFindingArea$(
    findingArea: RadioFindingAreaUpdateRequestDto
  ): Observable<RadioFindingAreaDto> {
    const dbModel: RadioFindingAreaDBModel =
      this.mapFindingAreaUpdateRequestToFindingAreaDBModel(findingArea);

    return this.radioDBService
      .update<RadioFindingAreaDBModel>('protocols', dbModel)
      .pipe(
        map(
          (data: RadioFindingAreaDBModel): RadioFindingAreaDto =>
            this.mapFindingAreaDBModelToFindingAreaDto(data)
        )
      );
  }

  updateFindingDetails$(
    findingDetails: RadioFindingDetailsUpdateRequestDto
  ): Observable<RadioFindingDetailsDto> {
    const dbModel: RadioFindingDetailsDBModel =
      this.mapFindingDetailsUpdateRequestToFindingDetailsDBModel(
        findingDetails
      );

    return this.radioDBService
      .update<RadioFindingDetailsDBModel>('findings', dbModel)
      .pipe(
        map(
          (data: RadioFindingDetailsDBModel): RadioFindingDetailsDto =>
            this.mapFindingDetailsDBModelToFindingDetailsDto(data)
        )
      );
  }

  deleteTemplate$(templateId: string): Observable<void> {
    return this.radioDBService
      .delete<RadioTemplateDBModel>('templates', templateId)
      .pipe(map(() => void 0));
  }

  deleteFindingArea$(findingAreaId: string): Observable<void> {
    return this.radioDBService
      .delete<RadioFindingAreaDBModel>('protocols', findingAreaId)
      .pipe(map(() => void 0));
  }

  deleteFindingDetails$(findingDetailsId: string): Observable<void> {
    return this.radioDBService
      .delete<RadioFindingDetailsDBModel>('findings', findingDetailsId)
      .pipe(map(() => void 0));
  }

  updateFindingAreaSortOrder$(
    sortOrderUpdateRequest: RadioSortOrderUpdateRequestDto
  ): Observable<void> {
    const findingAreaIds: string[] = sortOrderUpdateRequest.sortOrders.map(
      (sortOrder: RadioSortOrderModelDto): string => sortOrder.id
    );

    const findingAreas$: Observable<RadioFindingAreaDBModel[]> =
      this.radioDBService.bulkGet<RadioFindingAreaDBModel>(
        'protocols',
        findingAreaIds
      ) as Observable<RadioFindingAreaDBModel[]>;

    return findingAreas$.pipe(
      mergeMap((findingAreas: RadioFindingAreaDBModel[]) => {
        const findingAreasToUpdate: RadioFindingAreaDBModel[] =
          this.getUpdatedFindingAreasSortOrder(
            findingAreas,
            sortOrderUpdateRequest
          );

        return this.radioDBService.bulkPut<RadioFindingAreaDBModel>(
          'protocols',
          findingAreasToUpdate
        );
      }),
      map(() => void 0)
    );
  }

  updateFindingDetailsSortOrder$(
    sortOrderUpdateRequest: RadioSortOrderUpdateRequestDto
  ): Observable<void> {
    const findingDetailIds: string[] = sortOrderUpdateRequest.sortOrders.map(
      (sortOrder: RadioSortOrderModelDto): string => sortOrder.id
    );

    const findingDetails$: Observable<RadioFindingDetailsDBModel[]> =
      this.radioDBService.bulkGet<RadioFindingDetailsDBModel>(
        'findings',
        findingDetailIds
      ) as Observable<RadioFindingDetailsDBModel[]>;

    return findingDetails$.pipe(
      mergeMap((findingDetails: RadioFindingDetailsDBModel[]) => {
        const findingDetailsToUpdate: RadioFindingDetailsDBModel[] =
          this.getUpdatedFindingDetailsSortOrder(
            findingDetails,
            sortOrderUpdateRequest
          );

        return this.radioDBService.bulkPut<RadioFindingDetailsDBModel>(
          'findings',
          findingDetailsToUpdate
        );
      }),
      map(() => void 0)
    );
  }

  fetchTemplate$(templateId: string): Observable<RadioTemplateModelDto> {
    return this.radioDBService
      .getByID<RadioTemplateDBModel>('templates', templateId)
      .pipe(
        mergeMap(
          (template: RadioTemplateDBModel): Observable<RadioTemplateModelDto> =>
            this.getFindingAreasForTemplate$(template)
        )
      );
  }

  importTemplate$(
    template: RadioTemplateImportModelDto
  ): Observable<RadioTemplateDto> {
    const templateDbModel: RadioTemplateDBModel =
      this.mapTemplateCreateRequestToTemplateDBModel(template);

    const findingAreaIdsMap: Record<string, RadioFindingAreaImportModelDto> =
      this.generateFindingAreaIdsMap(template);

    const findingAreas: RadioFindingAreaDBModel[] =
      this.generateFindingAreasForImport(findingAreaIdsMap, templateDbModel);

    const findingDetails: RadioFindingDetailsDBModel[] =
      this.generateFindingDetailsForImport(findingAreaIdsMap);

    return forkJoin([
      this.createTemplateInDb$(templateDbModel),
      this.radioDBService.bulkAdd<RadioFindingAreaDBModel>(
        'protocols',
        findingAreas
      ),
      this.radioDBService.bulkAdd<RadioFindingDetailsDBModel>(
        'findings',
        findingDetails
      ),
    ]).pipe(
      map(
        ([template]: [
          RadioTemplateDto,
          number[],
          number[],
        ]): RadioTemplateDto => template
      )
    );
  }

  cloneFindingArea$(findingAreaId: string): Observable<RadioFindingAreaDto> {
    return this.fetchFindingArea$(findingAreaId).pipe(
      mergeMap(
        (
          findingArea: RadioFindingAreaModelDto
        ): Observable<RadioFindingAreaDto> => {
          const findingAreaDbModel: RadioFindingAreaDBModel =
            this.mapFindingAreaCreateRequestToFindingAreaDBModel(findingArea);

          const findingDetails: RadioFindingDetailsDBModel[] =
            this.generateFindingDetailsForClone$(
              findingArea,
              findingAreaDbModel
            );

          return forkJoin([
            this.createFindingAreaInDb$(findingAreaDbModel),
            this.radioDBService.bulkAdd<RadioFindingDetailsDBModel>(
              'findings',
              findingDetails
            ),
          ]).pipe(
            map(
              ([findingArea]: [
                RadioFindingAreaDto,
                number[],
              ]): RadioFindingAreaDto => findingArea
            )
          );
        }
      )
    );
  }

  cloneFindingDetails$(
    findingDetailsId: string
  ): Observable<RadioFindingDetailsDto> {
    return this.radioDBService
      .getByID<RadioFindingDetailsDBModel>('findings', findingDetailsId)
      .pipe(
        mergeMap(
          (
            findingDetails: RadioFindingDetailsDBModel
          ): Observable<RadioFindingDetailsDto> =>
            this.createFindingDetails$({
              ...this.mapFindingDetailsDBModelToFindingDetailsCreateRequest(
                findingDetails
              ),
            })
        )
      );
  }

  private generateId(): string {
    return crypto.randomUUID();
  }

  private generateFindingDetailsForClone$(
    findingArea: RadioFindingAreaModelDto,
    findingAreaDbModel: RadioFindingAreaDBModel
  ): RadioFindingDetailsDBModel[] {
    return findingArea.findingDetails.map(
      (
        findingDetail: RadioFindingDetailsBaseDto
      ): RadioFindingDetailsDBModel => ({
        ...this.mapFindingDetailsBaseDtoToFindingDetailsDBModel(findingDetail),
        id: this.generateId(),
        protocolId: findingAreaDbModel.id,
      })
    );
  }

  private createFindingAreaInDb$(
    dbModel: RadioFindingAreaDBModel
  ): Observable<RadioFindingAreaDto> {
    return this.radioDBService
      .add<RadioFindingAreaDBModel>('protocols', dbModel)
      .pipe(
        map(
          (data: RadioFindingAreaDBModel): RadioFindingAreaDto =>
            this.mapFindingAreaDBModelToFindingAreaDto(data)
        )
      );
  }

  private generateFindingAreaIdsMap(
    template: RadioTemplateImportModelDto
  ): Record<string, RadioFindingAreaImportModelDto> {
    return template.findingAreas.reduce(
      (
        accumulator: Record<string, RadioFindingAreaImportModelDto>,
        current: RadioFindingAreaImportModelDto
      ) => {
        accumulator[this.generateId()] = current;
        return accumulator;
      },
      {} as Record<string, RadioFindingAreaImportModelDto>
    );
  }

  private generateFindingDetailsForImport(
    findingAreaIdsMap: Record<string, RadioFindingAreaImportModelDto>
  ): RadioFindingDetailsDBModel[] {
    return Object.entries(findingAreaIdsMap)
      .map(
        ([findingAreaId, findingArea]: [
          string,
          RadioFindingAreaImportModelDto,
        ]): RadioFindingDetailsDBModel[] =>
          findingArea.findingDetails.map(
            (
              findingDetail: RadioFindingDetailsBaseDto
            ): RadioFindingDetailsDBModel => ({
              ...this.mapFindingDetailsBaseDtoToFindingDetailsDBModel(
                findingDetail
              ),
              id: this.generateId(),
              protocolId: findingAreaId,
            })
          )
      )
      .flat();
  }

  private generateFindingAreasForImport(
    findingAreaIdsMap: Record<string, RadioFindingAreaImportModelDto>,
    templateDbModel: RadioTemplateDBModel
  ): RadioFindingAreaDBModel[] {
    return Object.entries(findingAreaIdsMap).map(
      ([findingAreaId, findingArea]: [
        string,
        RadioFindingAreaImportModelDto,
      ]): RadioFindingAreaDBModel => ({
        ...this.mapFindingAreaBaseDtoToFindingAreaDBModel(findingArea),
        templateId: templateDbModel.id,
        id: findingAreaId,
      })
    );
  }

  private createTemplateInDb$(
    template: RadioTemplateDBModel
  ): Observable<RadioTemplateDto> {
    return this.radioDBService
      .add<RadioTemplateDBModel>('templates', template)
      .pipe(
        map(
          (data: RadioTemplateDBModel): RadioTemplateDto =>
            this.mapTemplateDBModelToTemplateDto(data)
        )
      );
  }

  private getFindingAreasForTemplate$(
    template: RadioTemplateDBModel
  ): Observable<RadioTemplateModelDto> {
    return this.radioDBService
      .getAllByIndex<RadioFindingAreaDBModel>(
        'protocols',
        'templateId',
        IDBKeyRange.only(template.id)
      )
      .pipe(
        concatMap(
          (
            findingAreas: RadioFindingAreaDBModel[]
          ): Observable<RadioTemplateModelDto> =>
            this.mapFindingAreasToTemplateDto(findingAreas, template)
        )
      );
  }

  private mapFindingAreasToTemplateDto(
    findingAreas: RadioFindingAreaDBModel[],
    template: RadioTemplateDBModel
  ): Observable<RadioTemplateModelDto> {
    if (!findingAreas?.length) {
      return of<RadioTemplateModelDto>({
        ...this.mapTemplateDBModelToTemplateBaseDto(template),
        id: template.id,
        findingAreas: [],
      });
    }

    return this.getFindingDetailsForFindingArea$(findingAreas, template);
  }

  private getFindingDetailsForFindingArea$(
    findingAreas: RadioFindingAreaDBModel[],
    template: RadioTemplateDBModel
  ): Observable<RadioTemplateModelDto> {
    const findingAreas$: Observable<RadioFindingAreaModelDto>[] =
      findingAreas.map(
        (
          findingArea: RadioFindingAreaDBModel
        ): Observable<RadioFindingAreaModelDto> =>
          this.fetchFindingDetailsForArea$(findingArea)
      );

    return forkJoin(findingAreas$).pipe(
      map(
        (findingAreas: RadioFindingAreaModelDto[]): RadioTemplateModelDto => ({
          ...this.mapTemplateDBModelToTemplateBaseDto(template),
          id: template.id,
          findingAreas,
        })
      )
    );
  }

  private fetchFindingDetailsForArea$(
    findingArea: RadioFindingAreaDBModel
  ): Observable<RadioFindingAreaModelDto> {
    return this.radioDBService
      .getAllByIndex<RadioFindingDetailsDBModel>(
        'findings',
        'protocolId',
        IDBKeyRange.only(findingArea.id)
      )
      .pipe(
        map(
          (
            findingDetails: RadioFindingDetailsDBModel[]
          ): RadioFindingAreaModelDto =>
            this.mapFindingAreaToDto(findingArea, findingDetails)
        )
      );
  }

  private mapFindingAreaToDto(
    findingArea: RadioFindingAreaDBModel,
    findingDetails: RadioFindingDetailsDBModel[]
  ): RadioFindingAreaModelDto {
    return {
      ...this.mapFindingAreaDBModelToFindingAreaBaseDto(findingArea),
      id: findingArea.id,
      templateId: findingArea.templateId,
      findingDetails: findingDetails.map(
        (findingDetail: RadioFindingDetailsDBModel): RadioFindingDetailsDto =>
          this.mapFindingDetailsDBModelToFindingDetailsDto(findingDetail)
      ),
    };
  }

  private fetchFindingArea$(
    findingAreaId: string
  ): Observable<RadioFindingAreaModelDto> {
    return this.radioDBService
      .getByID<RadioFindingAreaDBModel>('protocols', findingAreaId)
      .pipe(
        mergeMap(
          (
            findingArea: RadioFindingAreaDBModel
          ): Observable<RadioFindingAreaModelDto> =>
            this.fetchFindingDetailsForArea$(findingArea)
        )
      );
  }

  private getUpdatedFindingAreasSortOrder(
    findingAreas: RadioFindingAreaDBModel[],
    sortOrderUpdateRequest: RadioSortOrderUpdateRequestDto
  ): RadioFindingAreaDBModel[] {
    return findingAreas.map(
      (findingArea: RadioFindingAreaDBModel): RadioFindingAreaDBModel => {
        const sortOrderItem: RadioSortOrderModelDto | undefined =
          sortOrderUpdateRequest.sortOrders.find(
            (sortOrder: RadioSortOrderModelDto): boolean =>
              sortOrder.id === findingArea.id
          );

        if (!sortOrderItem) {
          return findingArea;
        }

        return {
          ...findingArea,
          order: sortOrderItem.sortOrder,
        };
      }
    );
  }

  private getUpdatedFindingDetailsSortOrder(
    findingDetails: RadioFindingDetailsDBModel[],
    sortOrderUpdateRequest: RadioSortOrderUpdateRequestDto
  ): RadioFindingDetailsDBModel[] {
    return findingDetails.map(
      (
        findingDetail: RadioFindingDetailsDBModel
      ): RadioFindingDetailsDBModel => {
        const sortOrderItem: RadioSortOrderModelDto | undefined =
          sortOrderUpdateRequest.sortOrders.find(
            (sortOrder: RadioSortOrderModelDto): boolean =>
              sortOrder.id === findingDetail.id
          );

        if (!sortOrderItem) {
          return findingDetail;
        }

        return {
          ...findingDetail,
          order: sortOrderItem.sortOrder,
        };
      }
    );
  }

  private mapTemplateUpdateRequestToTemplateDBModel(
    template: RadioTemplateUpdateRequestDto
  ): RadioTemplateDBModel {
    return {
      ...this.mapTemplateBaseDtoToTemplateDBModel(template),
      id: template.id,
    };
  }

  private mapFindingAreaUpdateRequestToFindingAreaDBModel(
    findingArea: RadioFindingAreaUpdateRequestDto
  ): RadioFindingAreaDBModel {
    return {
      ...this.mapFindingAreaBaseDtoToFindingAreaDBModel(findingArea),
      id: findingArea.id,
      templateId: findingArea.templateId,
    };
  }

  private mapFindingDetailsUpdateRequestToFindingDetailsDBModel(
    findingDetails: RadioFindingDetailsUpdateRequestDto
  ): RadioFindingDetailsDBModel {
    return {
      ...this.mapFindingDetailsBaseDtoToFindingDetailsDBModel(findingDetails),
      id: findingDetails.id,
      protocolId: findingDetails.findingAreaId,
    };
  }

  private mapTemplateBaseDtoToTemplateDBModel(
    template: RadioTemplateBaseDto
  ): Omit<RadioTemplateDBModel, 'id'> {
    return {
      ...this.mapRTFEditorContentToTemplateProtocolEditorContent(
        template.protocol
      ),
      ...this.mapRTFEditorContentToTemplatePatientInfoEditorContent(
        template.patientInfo
      ),
      name: template.name,
    };
  }

  private mapFindingDetailsDBModelToFindingDetailsCreateRequest(
    template: RadioFindingDetailsDBModel
  ): RadioFindingDetailsCreateRequestDto {
    return {
      ...this.mapFindingDetailsDBModelToFindingDetailsBaseDto(template),
      findingAreaId: template.protocolId,
    };
  }

  private mapTemplateCreateRequestToTemplateDBModel(
    template: RadioTemplateCreateRequestDto
  ): RadioTemplateDBModel {
    return {
      ...this.mapTemplateBaseDtoToTemplateDBModel(template),
      id: this.generateId(),
    };
  }

  private mapTemplateDBModelToTemplateBaseDto(
    template: RadioTemplateDBModel
  ): RadioTemplateBaseDto {
    return {
      name: template.name,
      protocol:
        this.mapTemplateProtocolEditorContentToRTFEditorContent(template),
      patientInfo:
        this.mapTemplatePatientInfoEditorContentToRTFEditorContent(template),
    };
  }

  private mapTemplateDBModelToTemplateDto(
    template: RadioTemplateDBModel
  ): RadioTemplateDto {
    return {
      ...this.mapTemplateDBModelToTemplateBaseDto(template),
      id: template.id,
    };
  }

  private mapFindingAreaBaseDtoToFindingAreaDBModel(
    findingArea: RadioFindingAreaBaseDto
  ): Omit<RadioFindingAreaDBModel, 'id' | 'templateId'> {
    return {
      name: findingArea.name,
      order: findingArea.sortOrder,
    };
  }

  private mapFindingAreaCreateRequestToFindingAreaDBModel(
    findingArea: RadioFindingAreaCreateRequestDto
  ): RadioFindingAreaDBModel {
    return {
      ...this.mapFindingAreaBaseDtoToFindingAreaDBModel(findingArea),
      id: this.generateId(),
      templateId: findingArea.templateId,
    };
  }

  private mapFindingAreaDBModelToFindingAreaBaseDto(
    findingArea: RadioFindingAreaDBModel
  ): RadioFindingAreaBaseDto {
    return {
      name: findingArea.name,
      sortOrder: findingArea.order,
    };
  }

  private mapFindingAreaDBModelToFindingAreaDto(
    findingArea: RadioFindingAreaDBModel
  ): RadioFindingAreaDto {
    return {
      ...this.mapFindingAreaDBModelToFindingAreaBaseDto(findingArea),
      id: findingArea.id,
      templateId: findingArea.templateId,
    };
  }

  private mapFindingDetailsBaseDtoToFindingDetailsDBModel(
    findingDetail: RadioFindingDetailsBaseDto
  ): Omit<RadioFindingDetailsDBModel, 'id' | 'protocolId'> {
    return {
      ...this.mapRTFEditorContentToFindingDetailsDescriptionEditorContent(
        findingDetail.description
      ),
      ...this.mapRTFEditorContentToFindingDetailsImpressionEditorContent(
        findingDetail.impression
      ),
      ...this.mapRTFEditorContentToFindingDetailsRecommendationEditorContent(
        findingDetail.recommendation
      ),
      title: findingDetail.name,
      group: findingDetail.group ?? undefined,
      order: findingDetail.sortOrder,
      isNormal: findingDetail.isNormal,
    };
  }

  private mapFindingDetailsCreateRequestToFindingDetailsDBModel(
    findingDetail: RadioFindingDetailsCreateRequestDto
  ): RadioFindingDetailsDBModel {
    return {
      ...this.mapFindingDetailsBaseDtoToFindingDetailsDBModel(findingDetail),
      id: this.generateId(),
      protocolId: findingDetail.findingAreaId,
    };
  }

  private mapFindingDetailsDBModelToFindingDetailsBaseDto(
    findingDetail: RadioFindingDetailsDBModel
  ): RadioFindingDetailsBaseDto {
    return {
      name: findingDetail.title,
      group: findingDetail.group ?? null,
      isNormal: findingDetail.isNormal ?? false,
      sortOrder: findingDetail.order ?? 0,
      description:
        this.mapFindingDetailsDescriptionEditorContentToRTFEditorContent(
          findingDetail
        ),
      impression:
        this.mapFindingDetailsImpressionEditorContentToRTFEditorContent(
          findingDetail
        ),
      recommendation:
        this.mapFindingDetailsRecommendationEditorContentToRTFEditorContent(
          findingDetail
        ),
    };
  }

  private mapFindingDetailsDBModelToFindingDetailsDto(
    findingDetail: RadioFindingDetailsDBModel
  ): RadioFindingDetailsDto {
    return {
      ...this.mapFindingDetailsDBModelToFindingDetailsBaseDto(findingDetail),
      id: findingDetail.id,
      findingAreaId: findingDetail.protocolId,
    };
  }

  private mapTemplateProtocolEditorContentToRTFEditorContent(
    editorContent: RadioTemplateDBModel
  ): RTFEditorContentDto {
    return {
      text: editorContent.description ?? '',
      html: editorContent.descriptionHTML ?? '',
      json: editorContent.descriptionJSON ?? '',
    };
  }

  private mapRTFEditorContentToTemplateProtocolEditorContent(
    editorContent: RTFEditorContentDto
  ): Pick<
    RadioTemplateDBModel,
    'description' | 'descriptionHTML' | 'descriptionJSON'
  > {
    return {
      description: editorContent.text,
      descriptionHTML: editorContent.html,
      descriptionJSON: editorContent.json,
    };
  }

  private mapTemplatePatientInfoEditorContentToRTFEditorContent(
    editorContent: RadioTemplateDBModel
  ): RTFEditorContentDto | null {
    if (!editorContent.patientInfoHTML) {
      return null;
    }

    return {
      text: editorContent.patientInfo ?? '',
      html: editorContent.patientInfoHTML ?? '',
      json: editorContent.patientInfoJSON ?? '',
    };
  }

  private mapRTFEditorContentToTemplatePatientInfoEditorContent(
    editorContent: RTFEditorContentDto | null
  ): Pick<
    RadioTemplateDBModel,
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

  private mapFindingDetailsDescriptionEditorContentToRTFEditorContent(
    editorContent: RadioFindingDetailsDBModel
  ): RTFEditorContentDto {
    return {
      text: editorContent.description ?? '',
      html: editorContent.descriptionHTML ?? '',
      json: editorContent.descriptionJSON ?? '',
    };
  }

  private mapRTFEditorContentToFindingDetailsDescriptionEditorContent(
    editorContent: RTFEditorContentDto
  ): Pick<
    RadioFindingDetailsDBModel,
    'description' | 'descriptionHTML' | 'descriptionJSON'
  > {
    return {
      description: editorContent.text,
      descriptionHTML: editorContent.html,
      descriptionJSON: editorContent.json,
    };
  }

  private mapFindingDetailsImpressionEditorContentToRTFEditorContent(
    editorContent: RadioFindingDetailsDBModel
  ): RTFEditorContentDto | null {
    if (!editorContent.impressionHTML) {
      return null;
    }

    return {
      text: editorContent.impression ?? '',
      html: editorContent.impressionHTML ?? '',
      json: editorContent.impressionJSON ?? '',
    };
  }

  private mapRTFEditorContentToFindingDetailsImpressionEditorContent(
    editorContent: RTFEditorContentDto | null
  ): Pick<
    RadioFindingDetailsDBModel,
    'impression' | 'impressionHTML' | 'impressionJSON'
  > {
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

  private mapFindingDetailsRecommendationEditorContentToRTFEditorContent(
    editorContent: RadioFindingDetailsDBModel
  ): RTFEditorContentDto | null {
    if (!editorContent.recommendationHTML) {
      return null;
    }

    return {
      text: editorContent.recommendation ?? '',
      html: editorContent.recommendationHTML ?? '',
      json: editorContent.recommendationJSON ?? '',
    };
  }

  private mapRTFEditorContentToFindingDetailsRecommendationEditorContent(
    editorContent: RTFEditorContentDto | null
  ): Pick<
    RadioFindingDetailsDBModel,
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
