import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  FindingCreateDto,
  FindingDto,
  FindingUpdateDto,
  SortOrderUpdateDto,
} from '../../models/data';
import { ReportBaseService } from '../report-base.service';

import { EntityManagerBaseService } from './entity-manager-base.service';

@Injectable({ providedIn: 'root' })
export class FindingManagerService
  implements
    EntityManagerBaseService<
      FindingDto,
      FindingCreateDto,
      FindingUpdateDto,
      {
        readonly id: string;
        readonly groupId: string;
        readonly classifierId: string;
      }
    >
{
  private readonly reportService: ReportBaseService = inject(ReportBaseService);

  fetchAll$({
    id,
    groupId,
    classifierId,
  }: {
    readonly id: string;
    readonly groupId: string;
    readonly classifierId: string;
  }): Observable<FindingDto[]> {
    return this.reportService.fetchFindings$(id, groupId, classifierId);
  }

  fetchByScopeId$(scopeId: string): Observable<FindingDto[]> {
    return this.reportService.fetchFindingsByScopeId$(scopeId);
  }

  create$(entity: FindingCreateDto): Observable<FindingDto> {
    return this.reportService.createFinding$(entity);
  }

  update$(entity: FindingUpdateDto): Observable<FindingDto> {
    return this.reportService.updateFinding$(entity);
  }

  delete$(id: string): Observable<void> {
    return this.reportService.deleteFinding$(id);
  }

  reorder$(sortOrderUpdateRequest: SortOrderUpdateDto): Observable<void> {
    return this.reportService.reorderFindings$(sortOrderUpdateRequest);
  }

  clone$(
    id: string,
    groupId: string,
    classifierId: string
  ): Observable<FindingDto> {
    return this.reportService.cloneFinding$(id, groupId, classifierId);
  }
}
