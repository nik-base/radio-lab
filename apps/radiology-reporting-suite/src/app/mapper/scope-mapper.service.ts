import { inject, Injectable } from '@angular/core';

import {
  FindingBaseDto,
  FindingDto,
  ScopeBaseDto,
  ScopeCreateDto,
  ScopeDataDto,
  ScopeDto,
  ScopeImportDto,
  ScopeUpdateDto,
} from '@app/models/data';
import {
  Finding,
  FindingBase,
  Scope,
  ScopeBase,
  ScopeCreate,
  ScopeData,
  ScopeImport,
  ScopeUpdate,
} from '@app/models/domain';

import { FindingMapperService } from './finding-mapper.service';

@Injectable({
  providedIn: 'root',
})
export class ScopeMapperService {
  private readonly findingMapper: FindingMapperService =
    inject(FindingMapperService);

  mapToBaseDto(scope: ScopeBase): ScopeBaseDto {
    return {
      name: scope.name,
      sortOrder: scope.sortOrder,
    };
  }

  mapFromBaseDto(scope: ScopeBaseDto): ScopeBase {
    return {
      name: scope.name,
      sortOrder: scope.sortOrder,
    };
  }

  mapToDto(scope: Scope): ScopeDto {
    return {
      ...this.mapToBaseDto(scope),
      id: scope.id,
      templateId: scope.templateId,
    };
  }

  mapFromDto(scope: ScopeDto): Scope {
    return {
      ...this.mapFromBaseDto(scope),
      id: scope.id,
      templateId: scope.templateId,
    };
  }

  mapFromDataDto(scope: ScopeDataDto): ScopeData {
    return {
      ...this.mapFromBaseDto(scope),
      id: scope.id,
      name: scope.name,
      sortOrder: scope.sortOrder,
      templateId: scope.templateId,
      findings: scope.findings.map(
        (finding: FindingDto): Finding => this.findingMapper.mapFromDto(finding)
      ),
    };
  }

  mapToCreateDto(scope: ScopeCreate): ScopeCreateDto {
    return {
      ...this.mapToBaseDto(scope),
      templateId: scope.templateId,
    };
  }

  mapFromCreateDto(scope: ScopeCreateDto): ScopeCreate {
    return {
      ...this.mapFromBaseDto(scope),
      templateId: scope.templateId,
    };
  }

  mapToUpdateDto(scope: ScopeUpdate): ScopeUpdateDto {
    return {
      ...this.mapToBaseDto(scope),
      id: scope.id,
      templateId: scope.templateId,
    };
  }

  mapFromUpdateDto(scope: ScopeUpdateDto): ScopeUpdate {
    return {
      ...this.mapFromBaseDto(scope),
      id: scope.id,
      templateId: scope.templateId,
    };
  }

  mapToImportDto(scope: ScopeImport): ScopeImportDto {
    return {
      ...this.mapToBaseDto(scope),
      findings: scope.findings.map(
        (finding: FindingBase): FindingBaseDto =>
          this.findingMapper.mapToBaseDto(finding)
      ),
    };
  }

  mapFromImportDto(scope: ScopeImportDto): ScopeImport {
    return {
      ...this.mapFromBaseDto(scope),
      findings: scope.findings.map(
        (finding: FindingBaseDto): FindingBase =>
          this.findingMapper.mapFromBaseDto(finding)
      ),
    };
  }
}
