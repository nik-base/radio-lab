/* eslint-disable @typescript-eslint/no-unused-vars */
import { inject, Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { map, Observable } from 'rxjs';

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
              this.mapFindingAreasDBModelToFindingAreasDto(findingArea)
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
    temlate: RadioTemplateCreateRequestDto
  ): Observable<RadioTemplateDto> {
    throw new Error('Method not implemented.');
  }

  createFindingArea$(
    findingArea: RadioFindingAreaCreateRequestDto
  ): Observable<RadioFindingAreaDto> {
    throw new Error('Method not implemented.');
  }

  createFindingDetails$(
    findingDetails: RadioFindingDetailsCreateRequestDto
  ): Observable<RadioFindingDetailsDto> {
    throw new Error('Method not implemented.');
  }

  updateTemplate$(
    template: RadioTemplateUpdateRequestDto
  ): Observable<RadioTemplateDto> {
    throw new Error('Method not implemented.');
  }

  updateFindingArea$(
    findingArea: RadioFindingAreaUpdateRequestDto
  ): Observable<RadioFindingAreaDto> {
    throw new Error('Method not implemented.');
  }

  updateFindingDetails$(
    findingDetails: RadioFindingDetailsUpdateRequestDto
  ): Observable<RadioFindingDetailsDto> {
    throw new Error('Method not implemented.');
  }

  deleteTemplate$(templateId: string): Observable<RadioTemplateDto> {
    throw new Error('Method not implemented.');
  }

  deleteFindingArea$(findingAreaId: string): Observable<RadioFindingAreaDto> {
    throw new Error('Method not implemented.');
  }

  deleteFindingDetails$(
    findingDetailsId: string
  ): Observable<RadioFindingDetailsDto> {
    throw new Error('Method not implemented.');
  }

  updateFindingAreaSortOrder$(
    sortOrders: RadioSortOrderUpdateRequestDto
  ): Observable<void> {
    throw new Error('Method not implemented.');
  }

  updateFindingDetailsSortOrder$(
    sortOrders: RadioSortOrderUpdateRequestDto
  ): Observable<void> {
    throw new Error('Method not implemented.');
  }

  fetchTemplate$(templateId: string): Observable<RadioTemplateModelDto> {
    throw new Error('Method not implemented.');
  }

  importTemplate$(
    template: RadioTemplateImportModelDto
  ): Observable<RadioTemplateDto> {
    throw new Error('Method not implemented.');
  }

  cloneFindingArea$(findingAreaId: string): Observable<RadioFindingAreaDto> {
    throw new Error('Method not implemented.');
  }

  cloneFindingDetails$(
    findingDetailsId: string
  ): Observable<RadioFindingDetailsDto> {
    throw new Error('Method not implemented.');
  }

  private mapTemplateDBModelToTemplateDto(
    template: RadioTemplateDBModel
  ): RadioTemplateDto {
    return {
      id: template.id,
      name: template.name,
      protocol:
        this.mapTemplateProtocolEditorContentToRTFEditorContent(template),
      patientInfo:
        this.mapTemplatePatientInfoEditorContentToRTFEditorContent(template),
    };
  }

  private mapFindingAreasDBModelToFindingAreasDto(
    findingArea: RadioFindingAreaDBModel
  ): RadioFindingAreaDto {
    return {
      id: findingArea.id,
      name: findingArea.name,
      sortOrder: findingArea.order,
      templateId: findingArea.templateId,
    };
  }

  private mapFindingDetailsDBModelToFindingDetailsDto(
    findingDetail: RadioFindingDetailsDBModel
  ): RadioFindingDetailsDto {
    return {
      id: findingDetail.id,
      name: findingDetail.title,
      group: findingDetail.group ?? null,
      isNormal: findingDetail.isNormal ?? false,
      sortOrder: findingDetail.order ?? 0,
      findingAreaId: findingDetail.protocolId,
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

  private mapTemplateProtocolEditorContentToRTFEditorContent(
    editorContent: RadioTemplateDBModel
  ): RTFEditorContentDto {
    return {
      text: editorContent.description ?? '',
      html: editorContent.decriptionHTML ?? '',
      json: editorContent.decriptionJSON ?? '',
    };
  }

  private mapRTFEditorContentToTemplateProtocolEditorContent(
    editorContent: RTFEditorContentDto
  ): Pick<
    RadioTemplateDBModel,
    'description' | 'decriptionHTML' | 'decriptionJSON'
  > {
    return {
      description: editorContent.text,
      decriptionHTML: editorContent.html,
      decriptionJSON: editorContent.json,
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
    editorContent: RTFEditorContentDto
  ): Pick<
    RadioTemplateDBModel,
    'patientInfo' | 'patientInfoHTML' | 'patientInfoJSON'
  > {
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
      html: editorContent.decriptionHTML ?? '',
      json: editorContent.decriptionJSON ?? '',
    };
  }

  private mapRTFEditorContentToFindingDetailsDescriptionEditorContent(
    editorContent: RTFEditorContentDto
  ): Pick<
    RadioFindingDetailsDBModel,
    'description' | 'decriptionHTML' | 'decriptionJSON'
  > {
    return {
      description: editorContent.text,
      decriptionHTML: editorContent.html,
      decriptionJSON: editorContent.json,
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
    editorContent: RTFEditorContentDto
  ): Pick<
    RadioFindingDetailsDBModel,
    'impression' | 'impressionHTML' | 'impressionJSON'
  > {
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
    editorContent: RTFEditorContentDto
  ): Pick<
    RadioFindingDetailsDBModel,
    'recommendation' | 'recommendationHTML' | 'recommendationJSON'
  > {
    return {
      recommendation: editorContent.text,
      recommendationHTML: editorContent.html,
      recommendationJSON: editorContent.json,
    };
  }
}
