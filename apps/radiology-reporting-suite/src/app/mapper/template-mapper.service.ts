import { inject, Injectable } from '@angular/core';

import {
  ScopeDataDto,
  ScopeImportDto,
  TemplateBaseDto,
  TemplateCreateDto,
  TemplateDataDto,
  TemplateDto,
  TemplateImportDto,
  TemplateUpdateDto,
} from '@app/models/data';
import {
  ScopeData,
  ScopeImport,
  Template,
  TemplateBase,
  TemplateCreate,
  TemplateData,
  TemplateImport,
  TemplateUpdate,
} from '@app/models/domain';

import { EditorContentMapperService } from './editor-content-mapper.service';
import { ScopeMapperService } from './scope-mapper.service';

@Injectable({ providedIn: 'root' })
export class TemplateMapperService {
  private readonly editorContentMapper: EditorContentMapperService = inject(
    EditorContentMapperService
  );

  private readonly scopeMapper: ScopeMapperService = inject(ScopeMapperService);

  mapToBaseDto(template: TemplateBase): TemplateBaseDto {
    return {
      name: template.name,
      protocol: this.editorContentMapper.mapToDto(template.protocol),
      patientInfo: this.editorContentMapper.mapToDto(template.patientInfo),
    };
  }

  mapFromBaseDto(finding: TemplateBaseDto): TemplateBase {
    return {
      name: finding.name,
      protocol: this.editorContentMapper.mapFromDto(finding.protocol),
      patientInfo: this.editorContentMapper.mapFromDto(finding.patientInfo),
    };
  }

  mapToDto(template: Template): TemplateDto {
    return {
      ...this.mapToBaseDto(template),
      id: template.id,
    };
  }

  mapFromDto(template: TemplateDto): Template {
    return {
      ...this.mapFromBaseDto(template),
      id: template.id,
    };
  }

  mapToCreateDto(template: TemplateCreate): TemplateCreateDto {
    return {
      ...this.mapToBaseDto(template),
    };
  }

  mapFromCreateDto(template: TemplateCreateDto): TemplateCreate {
    return {
      ...this.mapFromBaseDto(template),
    };
  }

  mapToUpdateDto(template: TemplateUpdate): TemplateUpdateDto {
    return {
      ...this.mapToBaseDto(template),
      id: template.id,
    };
  }

  mapFromUpdateDto(template: TemplateUpdateDto): TemplateUpdate {
    return {
      ...this.mapFromBaseDto(template),
      id: template.id,
    };
  }

  mapFromDataDto(template: TemplateDataDto): TemplateData {
    return {
      ...this.mapFromBaseDto(template),
      id: template.id,
      scopes: template.scopes.map(
        (scope: ScopeDataDto): ScopeData =>
          this.scopeMapper.mapFromDataDto(scope)
      ),
    };
  }

  mapToImportDto(template: TemplateImport): TemplateImportDto {
    return {
      ...this.mapToBaseDto(template),
      scopes: template.scopes.map(
        (scope: ScopeImport): ScopeImportDto =>
          this.scopeMapper.mapToImportDto(scope)
      ),
    };
  }

  mapFromImportDto(template: TemplateImportDto): TemplateImport {
    return {
      ...this.mapFromBaseDto(template),
      scopes: template.scopes.map(
        (scope: ScopeImportDto): ScopeImport =>
          this.scopeMapper.mapFromImportDto(scope)
      ),
    };
  }
}
