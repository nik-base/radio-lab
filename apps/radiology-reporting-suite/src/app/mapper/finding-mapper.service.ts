import { inject, Injectable } from '@angular/core';

import {
  FindingBaseDto,
  FindingCreateDto,
  FindingDto,
  FindingUpdateDto,
} from '@app/models/data';
import {
  Finding,
  FindingBase,
  FindingCreate,
  FindingUpdate,
} from '@app/models/domain';

import { EditorContentMapperService } from './editor-content-mapper.service';

@Injectable({
  providedIn: 'root',
})
export class FindingMapperService {
  private readonly editorContentMapper: EditorContentMapperService = inject(
    EditorContentMapperService
  );

  mapToBaseDto(finding: FindingBase): FindingBaseDto {
    return {
      name: finding.name,
      group: finding.group,
      isNormal: finding.isNormal,
      sortOrder: finding.sortOrder,
      description: this.editorContentMapper.mapToDto(finding.description),
      impression: this.editorContentMapper.mapToDto(finding.impression),
      recommendation: this.editorContentMapper.mapToDto(finding.recommendation),
    };
  }

  mapFromBaseDto(finding: FindingBaseDto): FindingBase {
    return {
      name: finding.name,
      group: finding.group,
      isNormal: finding.isNormal,
      sortOrder: finding.sortOrder,
      description: this.editorContentMapper.mapFromDto(finding.description),
      impression: this.editorContentMapper.mapFromDto(finding.impression),
      recommendation: this.editorContentMapper.mapFromDto(
        finding.recommendation
      ),
    };
  }

  mapToDto(finding: Finding): FindingDto {
    return {
      ...this.mapToBaseDto(finding),
      id: finding.id,
      scopeId: finding.scopeId,
    };
  }

  mapFromDto(finding: FindingDto): Finding {
    return {
      ...this.mapFromBaseDto(finding),
      id: finding.id,
      scopeId: finding.scopeId,
    };
  }

  mapToCreateDto(finding: FindingCreate): FindingCreateDto {
    return {
      ...this.mapToBaseDto(finding),
      scopeId: finding.scopeId,
    };
  }

  mapFromCreateDto(finding: FindingCreateDto): FindingCreate {
    return {
      ...this.mapFromBaseDto(finding),
      scopeId: finding.scopeId,
    };
  }

  mapToUpdateDto(finding: FindingUpdate): FindingUpdateDto {
    return {
      ...this.mapToDto(finding),
      id: finding.id,
      scopeId: finding.scopeId,
    };
  }

  mapFromUpdateDto(finding: FindingUpdateDto): FindingUpdate {
    return {
      ...this.mapFromDto(finding),
      id: finding.id,
      scopeId: finding.scopeId,
    };
  }
}
