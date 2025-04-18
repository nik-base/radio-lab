import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  ScopeCreateDto,
  ScopeDto,
  ScopeUpdateDto,
  SortOrderUpdateDto,
} from '../../models/data';
import { ReportBaseService } from '../report-base.service';

import { EntityManagerBaseService } from './entity-manager-base.service';

@Injectable({ providedIn: 'root' })
export class ScopeManagerService
  implements
    EntityManagerBaseService<
      ScopeDto,
      ScopeCreateDto,
      ScopeUpdateDto,
      { id: string }
    >
{
  private readonly reportService: ReportBaseService = inject(ReportBaseService);

  fetchAll$({ id }: { id: string }): Observable<ScopeDto[]> {
    return this.reportService.fetchScopes$(id);
  }

  create$(entity: ScopeCreateDto): Observable<ScopeDto> {
    return this.reportService.createScope$(entity);
  }

  update$(entity: ScopeUpdateDto): Observable<ScopeDto> {
    return this.reportService.updateScope$(entity);
  }

  delete$(id: string): Observable<void> {
    return this.reportService.deleteScope$(id);
  }

  reorder$(sortOrderUpdateRequest: SortOrderUpdateDto): Observable<void> {
    return this.reportService.reorderScopes$(sortOrderUpdateRequest);
  }

  clone$(id: string, templateId: string): Observable<ScopeDto> {
    return this.reportService.cloneScope$(id, templateId);
  }
}
