import {
  Component,
  computed,
  effect,
  inject,
  input,
  InputSignal,
  Signal,
  untracked,
} from '@angular/core';

import { VARIABLE_SOURCE, VARIABLE_TYPE } from '@app/constants';
import { SortOrderMapperService } from '@app/mapper/sort-order-mapper.service';
import { TableCRUDRowMapperService } from '@app/mapper/table-crud-row-mapper.service';
import { Finding, Variable } from '@app/models/domain';
import { TableCRUDRow } from '@app/models/ui';
import { VariableStore } from '@app/store/report-manager/variable-store';
import { findNextSortOrder } from '@app/utils/functions/order.functions';

import { TableCRUDComponent } from '../table-crud/table-crud.component';

@Component({
  selector: 'radio-variable-manager',
  standalone: true,
  imports: [TableCRUDComponent],
  templateUrl: './variable-manager.component.html',
})
export class VariableManagerComponent {
  private readonly tableCRUDRowMapperService: TableCRUDRowMapperService<Variable> =
    inject(TableCRUDRowMapperService) as TableCRUDRowMapperService<Variable>;

  private readonly sortOrderMapperService: SortOrderMapperService = inject(
    SortOrderMapperService
  );

  readonly finding: InputSignal<Finding> = input.required<Finding>();

  protected readonly variableStore$: InstanceType<typeof VariableStore> =
    inject(VariableStore);

  readonly variables: Signal<TableCRUDRow<Variable>[]> = computed(
    (): TableCRUDRow<Variable>[] =>
      this.tableCRUDRowMapperService.mapToTableCRUDRows(
        this.variableStore$.variables()(this.finding().id)()
      )
  );

  constructor() {
    effect((): void => {
      const finding: Finding = this.finding();

      untracked(() => {
        this.variableStore$.fetchAll({
          id: finding.id,
        });
      });
    });
  }

  onChange(row: TableCRUDRow<Variable> | null): void {
    this.variableStore$.change(row?.value ?? null);
  }

  onCreate(row: TableCRUDRow<Variable>): void {
    const finding: Finding = this.finding();

    const nextSortOrder: number = findNextSortOrder(
      this.variableStore$.variables()(finding.id)()
    );

    this.variableStore$.create({
      name: row.label,
      entityId: finding.id,
      sortOrder: nextSortOrder,
      source: VARIABLE_SOURCE.Finding,
      type: VARIABLE_TYPE.MultiSelect,
    });
  }

  onUpdate(row: TableCRUDRow<Variable>): void {
    this.variableStore$.update({
      ...row.value,
      name: row.label,
    });
  }

  onDelete(row: TableCRUDRow<Variable>): void {
    this.variableStore$.delete(row.value);
  }

  onReorder(rows: ReadonlyArray<TableCRUDRow<Variable>>): void {
    this.variableStore$.reorder(
      this.sortOrderMapperService.mapEntitiesToSortOrderUpdate(
        this.tableCRUDRowMapperService.mapFromTableCRUDRows(rows)
      )
    );
  }
}
