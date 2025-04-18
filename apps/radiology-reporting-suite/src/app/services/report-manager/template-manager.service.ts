import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  SortOrderUpdateDto,
  TemplateCreateDto,
  TemplateDataDto,
  TemplateDto,
  TemplateImportDto,
  TemplateUpdateDto,
} from '../../models/data';
import { ReportBaseService } from '../report-base.service';

import { EntityManagerBaseService } from './entity-manager-base.service';

@Injectable({ providedIn: 'root' })
export class TemplateManagerService
  implements
    EntityManagerBaseService<TemplateDto, TemplateCreateDto, TemplateUpdateDto>
{
  private readonly reportService: ReportBaseService = inject(ReportBaseService);

  fetchAll$(): Observable<TemplateDto[]> {
    return this.reportService.fetchTemplates$();
  }

  create$(entity: TemplateCreateDto): Observable<TemplateDto> {
    return this.reportService.createTemplate$(entity);
  }

  update$(entity: TemplateUpdateDto): Observable<TemplateDto> {
    return this.reportService.updateTemplate$(entity);
  }

  delete$(id: string): Observable<void> {
    return this.reportService.deleteTemplate$(id);
  }

  reorder$(sortOrderUpdateRequest: SortOrderUpdateDto): Observable<void> {
    return this.reportService.reorderTemplates$(sortOrderUpdateRequest);
  }

  import$(entity: TemplateImportDto): Observable<TemplateDto> {
    return this.reportService.importTemplate$(entity);
  }

  export$(id: string): Observable<TemplateDataDto> {
    return this.reportService.fetchTemplate$(id);
  }
}
