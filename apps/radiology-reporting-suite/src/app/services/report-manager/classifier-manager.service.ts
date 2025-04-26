import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  FindingClassifierCreateDto,
  FindingClassifierDto,
  FindingClassifierUpdateDto,
  SortOrderUpdateDto,
} from '../../models/data';
import { ReportBaseService } from '../report-base.service';

import { EntityManagerBaseService } from './entity-manager-base.service';

@Injectable({ providedIn: 'root' })
export class ClassifierManagerService
  implements
    EntityManagerBaseService<
      FindingClassifierDto,
      FindingClassifierCreateDto,
      FindingClassifierUpdateDto,
      { readonly id: string; readonly groupId: string }
    >
{
  private readonly reportService: ReportBaseService = inject(ReportBaseService);

  fetchAll$({
    id,
    groupId,
  }: {
    readonly id: string;
    readonly groupId: string;
  }): Observable<FindingClassifierDto[]> {
    return this.reportService.fetchFindingClassifiers$(id, groupId);
  }

  create$(
    entity: FindingClassifierCreateDto
  ): Observable<FindingClassifierDto> {
    return this.reportService.createFindingClassifier$(entity);
  }

  update$(
    entity: FindingClassifierUpdateDto
  ): Observable<FindingClassifierDto> {
    return this.reportService.updateFindingClassifier$(entity);
  }

  delete$(id: string): Observable<void> {
    return this.reportService.deleteFindingClassifier$(id);
  }

  reorder$(sortOrderUpdateRequest: SortOrderUpdateDto): Observable<void> {
    return this.reportService.reorderFindingClassifiers$(
      sortOrderUpdateRequest
    );
  }
}
