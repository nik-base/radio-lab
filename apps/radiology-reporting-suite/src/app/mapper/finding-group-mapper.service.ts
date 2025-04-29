import { inject, Injectable } from '@angular/core';

import {
  FindingGroupBaseDto,
  FindingGroupCreateDto,
  FindingGroupDataDto,
  FindingGroupDto,
  FindingGroupImportDto,
  FindingGroupUpdateDto,
} from '@app/models/data';
import {
  FindingGroup,
  FindingGroupBase,
  FindingGroupCreate,
  FindingGroupData,
  FindingGroupImport,
  FindingGroupUpdate,
} from '@app/models/domain';

import { FindingClassifierMapperService } from './finding-classifier-mapper.service';

@Injectable({
  providedIn: 'root',
})
export class FindingGroupMapperService {
  private readonly classifierMapper: FindingClassifierMapperService = inject(
    FindingClassifierMapperService
  );

  mapToBaseDto(group: FindingGroupBase): FindingGroupBaseDto {
    return {
      name: group.name,
      sortOrder: group.sortOrder,
      isDefault: group.isDefault,
    };
  }

  mapFromBaseDto(group: FindingGroupBaseDto): FindingGroupBase {
    return {
      name: group.name,
      sortOrder: group.sortOrder,
      isDefault: group.isDefault,
    };
  }

  mapToDto(group: FindingGroup): FindingGroupDto {
    return {
      ...this.mapToBaseDto(group),
      id: group.id,
      scopeId: group.scopeId,
    };
  }

  mapFromDto(group: FindingGroupDto): FindingGroup {
    return {
      ...this.mapFromBaseDto(group),
      id: group.id,
      scopeId: group.scopeId,
    };
  }

  mapFromDataDto(group: FindingGroupDataDto): FindingGroupData {
    return {
      ...this.mapFromBaseDto(group),
      id: group.id,
      name: group.name,
      sortOrder: group.sortOrder,
      scopeId: group.scopeId,
      classifiers: [],
      // classifiers: group.classifiers.map(
      //   (classifier: FindingClassifierDto): FindingClassifier =>
      //     this.classifierMapper.mapFromDto(classifier)
      // ),
    };
  }

  mapToCreateDto(group: FindingGroupCreate): FindingGroupCreateDto {
    return {
      ...this.mapToBaseDto(group),
      scopeId: group.scopeId,
    };
  }

  mapFromCreateDto(group: FindingGroupCreateDto): FindingGroupCreate {
    return {
      ...this.mapFromBaseDto(group),
      scopeId: group.scopeId,
    };
  }

  mapToUpdateDto(group: FindingGroupUpdate): FindingGroupUpdateDto {
    return {
      ...this.mapToBaseDto(group),
      id: group.id,
      scopeId: group.scopeId,
    };
  }

  mapFromUpdateDto(group: FindingGroupUpdateDto): FindingGroupUpdate {
    return {
      ...this.mapFromBaseDto(group),
      id: group.id,
      scopeId: group.scopeId,
    };
  }

  mapToImportDto(group: FindingGroupImport): FindingGroupImportDto {
    return {
      ...this.mapToBaseDto(group),
      classifiers: [],
      // classifiers: group.classifiers.map(
      //   (classifier: FindingClassifierBase): FindingClassifierBaseDto =>
      //     this.classifierMapper.mapToBaseDto(classifier)
      // ),
    };
  }

  mapFromImportDto(group: FindingGroupImportDto): FindingGroupImport {
    return {
      ...this.mapFromBaseDto(group),
      classifiers: [],
      // classifiers: group.classifiers.map(
      //   (classifier: FindingClassifierBaseDto): FindingClassifierBase =>
      //     this.classifierMapper.mapFromBaseDto(classifier)
      // ),
    };
  }
}
