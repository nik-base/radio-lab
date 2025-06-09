import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  SortOrderUpdateDto,
  VariableCreateDto,
  VariableDto,
  VariableUpdateDto,
} from '../../models/data';
import { ReportBaseService } from '../report-base.service';

import { EntityManagerBaseService } from './entity-manager-base.service';

@Injectable({ providedIn: 'root' })
export class VariableManagerService
  implements
    EntityManagerBaseService<
      VariableDto,
      VariableCreateDto,
      VariableUpdateDto,
      {
        readonly id: string;
      }
    >
{
  private readonly reportService: ReportBaseService = inject(ReportBaseService);

  fetchAll$(): Observable<VariableDto[]> {
    return this.reportService.fetchAllFindingVariables$();
  }

  fetchExcept$(findingId: string): Observable<VariableDto[]> {
    return this.reportService.fetchAllFindingVariablesExcept$(findingId);
  }

  create$(entity: VariableCreateDto): Observable<VariableDto> {
    return this.reportService.createVariable$(entity);
  }

  update$(entity: VariableUpdateDto): Observable<VariableDto> {
    return this.reportService.updateVariable$(entity);
  }

  delete$(id: string): Observable<void> {
    return this.reportService.deleteVariable$(id);
  }

  reorder$(sortOrderUpdateRequest: SortOrderUpdateDto): Observable<void> {
    return this.reportService.reorderVariables$(sortOrderUpdateRequest);
  }

  clone$(variableId: string, entityId: string): Observable<VariableDto> {
    return this.reportService.cloneVariable$(variableId, entityId);
  }
}
