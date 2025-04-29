import { inject, Injectable } from '@angular/core';

import {
  FindingClassifierBaseDto,
  FindingClassifierCreateDto,
  FindingClassifierDataDto,
  FindingClassifierDto,
  FindingClassifierImportDto,
  FindingClassifierUpdateDto,
} from '@app/models/data';
import {
  FindingClassifier,
  FindingClassifierBase,
  FindingClassifierCreate,
  FindingClassifierData,
  FindingClassifierImport,
  FindingClassifierUpdate,
} from '@app/models/domain';

import { FindingMapperService } from './finding-mapper.service';

@Injectable({
  providedIn: 'root',
})
export class FindingClassifierMapperService {
  private readonly findingMapper: FindingMapperService =
    inject(FindingMapperService);

  mapToBaseDto(classifier: FindingClassifierBase): FindingClassifierBaseDto {
    return {
      name: classifier.name,
      sortOrder: classifier.sortOrder,
      isDefault: classifier.isDefault,
    };
  }

  mapFromBaseDto(classifier: FindingClassifierBaseDto): FindingClassifierBase {
    return {
      name: classifier.name,
      sortOrder: classifier.sortOrder,
      isDefault: classifier.isDefault,
    };
  }

  mapToDto(classifier: FindingClassifier): FindingClassifierDto {
    return {
      ...this.mapToBaseDto(classifier),
      id: classifier.id,
      scopeId: classifier.scopeId,
      groupId: classifier.groupId,
    };
  }

  mapFromDto(classifier: FindingClassifierDto): FindingClassifier {
    return {
      ...this.mapFromBaseDto(classifier),
      id: classifier.id,
      scopeId: classifier.scopeId,
      groupId: classifier.groupId,
    };
  }

  mapFromDataDto(classifier: FindingClassifierDataDto): FindingClassifierData {
    return {
      ...this.mapFromBaseDto(classifier),
      id: classifier.id,
      name: classifier.name,
      sortOrder: classifier.sortOrder,
      scopeId: classifier.scopeId,
      groupId: classifier.groupId,
      findings: [],
      // findings: classifier.findings.map(
      //   (finding: FindingDto): Finding => this.findingMapper.mapFromDto(finding)
      // ),
    };
  }

  mapToCreateDto(
    classifier: FindingClassifierCreate
  ): FindingClassifierCreateDto {
    return {
      ...this.mapToBaseDto(classifier),
      scopeId: classifier.scopeId,
      groupId: classifier.groupId,
    };
  }

  mapFromCreateDto(
    classifier: FindingClassifierCreateDto
  ): FindingClassifierCreate {
    return {
      ...this.mapFromBaseDto(classifier),
      scopeId: classifier.scopeId,
      groupId: classifier.groupId,
    };
  }

  mapToUpdateDto(
    classifier: FindingClassifierUpdate
  ): FindingClassifierUpdateDto {
    return {
      ...this.mapToBaseDto(classifier),
      id: classifier.id,
      scopeId: classifier.scopeId,
      groupId: classifier.groupId,
    };
  }

  mapFromUpdateDto(
    classifier: FindingClassifierUpdateDto
  ): FindingClassifierUpdate {
    return {
      ...this.mapFromBaseDto(classifier),
      id: classifier.id,
      scopeId: classifier.scopeId,
      groupId: classifier.groupId,
    };
  }

  mapToImportDto(
    classifier: FindingClassifierImport
  ): FindingClassifierImportDto {
    return {
      ...this.mapToBaseDto(classifier),
      findings: [],
      // findings: classifier.findings.map(
      //   (finding: FindingBase): FindingBaseDto =>
      //     this.findingMapper.mapToBaseDto(finding)
      // ),
    };
  }

  mapFromImportDto(
    classifier: FindingClassifierImportDto
  ): FindingClassifierImport {
    return {
      ...this.mapFromBaseDto(classifier),
      findings: [],
      // findings: classifier.findings.map(
      //   (finding: FindingBaseDto): FindingBase =>
      //     this.findingMapper.mapFromBaseDto(finding)
      // ),
    };
  }
}
