import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { TemplateDataDto, TemplateDto } from '../../models/data';
import { ReportBaseService } from '../report-base.service';

@Injectable({ providedIn: 'root' })
export class ReportBuilderService {
  private readonly reportService: ReportBaseService = inject(ReportBaseService);

  fetchTemplates$(): Observable<TemplateDto[]> {
    return this.reportService.fetchTemplates$();
  }

  fetchTemplate$(templateId: string): Observable<TemplateDataDto> {
    return this.reportService.fetchTemplate$(templateId);
  }
}
