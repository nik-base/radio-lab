import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  SortOrderUpdateDto,
  VariableValueCreateDto,
  VariableValueDto,
  VariableValueUpdateDto,
} from '../../models/data';
import { ReportBaseService } from '../report-base.service';

import { EntityManagerBaseService } from './entity-manager-base.service';

@Injectable({ providedIn: 'root' })
export class VariableValueManagerService
  implements
    EntityManagerBaseService<
      VariableValueDto,
      VariableValueCreateDto,
      VariableValueUpdateDto,
      {
        readonly id: string;
      }
    >
{
  private readonly reportService: ReportBaseService = inject(ReportBaseService);

  fetchAll$({ id }: { readonly id: string }): Observable<VariableValueDto[]> {
    return this.reportService.fetchVariableValues$(id);
  }

  create$(entity: VariableValueCreateDto): Observable<VariableValueDto> {
    return this.reportService.createVariableValue$(entity);
  }

  update$(entity: VariableValueUpdateDto): Observable<VariableValueDto> {
    return this.reportService.updateVariableValue$(entity);
  }

  delete$(id: string): Observable<void> {
    return this.reportService.deleteVariableValue$(id);
  }

  reorder$(sortOrderUpdateRequest: SortOrderUpdateDto): Observable<void> {
    return this.reportService.reorderVariableValues$(sortOrderUpdateRequest);
  }
}
