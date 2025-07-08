import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  FindingGroupCreateDto,
  FindingGroupDto,
  FindingGroupUpdateDto,
  SortOrderUpdateDto,
} from '../../models/data';
import { ReportBaseService } from '../report-base.service';

import { EntityManagerBaseService } from './entity-manager-base.service';

@Injectable({ providedIn: 'root' })
export class GroupManagerService
  implements
    EntityManagerBaseService<
      FindingGroupDto,
      FindingGroupCreateDto,
      FindingGroupUpdateDto,
      { readonly id: string }
    >
{
  private readonly reportService: ReportBaseService = inject(ReportBaseService);

  fetchAll$({ id }: { readonly id: string }): Observable<FindingGroupDto[]> {
    return this.reportService.fetchFindingGroups$(id);
  }

  create$(entity: FindingGroupCreateDto): Observable<FindingGroupDto> {
    return this.reportService.createFindingGroup$(entity);
  }

  update$(entity: FindingGroupUpdateDto): Observable<FindingGroupDto> {
    return this.reportService.updateFindingGroup$(entity);
  }

  delete$(id: string): Observable<void> {
    return this.reportService.deleteFindingGroup$(id);
  }

  reorder$(sortOrderUpdateRequest: SortOrderUpdateDto): Observable<void> {
    return this.reportService.reorderFindingGroups$(sortOrderUpdateRequest);
  }

  clone$(id: string, scopeId: string): Observable<FindingGroupDto> {
    return this.reportService.cloneGroup$(id, scopeId);
  }
}
