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

import { SortOrderMapperService } from '@app/mapper/sort-order-mapper.service';
import { TableCRUDRowMapperService } from '@app/mapper/table-crud-row-mapper.service';
import { Variable, VariableValue } from '@app/models/domain';
import { TableCRUDRow } from '@app/models/ui';
import { VariableValueStore } from '@app/store/report-manager/variable-value.store';
import { findNextSortOrder } from '@app/utils/functions/order.functions';

import { TableCRUDComponent } from '../table-crud/table-crud.component';

@Component({
  selector: 'radio-variable-value-manager',
  standalone: true,
  imports: [TableCRUDComponent],
  templateUrl: './variable-value-manager.component.html',
})
export class VariableValueManagerComponent {
  private readonly tableCRUDRowMapperService: TableCRUDRowMapperService<VariableValue> =
    inject(
      TableCRUDRowMapperService
    ) as TableCRUDRowMapperService<VariableValue>;

  private readonly sortOrderMapperService: SortOrderMapperService = inject(
    SortOrderMapperService
  );

  readonly variable: InputSignal<Variable> = input.required<Variable>();

  protected readonly variableValueStore$: InstanceType<
    typeof VariableValueStore
  > = inject(VariableValueStore);

  readonly variableValues: Signal<TableCRUDRow<VariableValue>[]> = computed(
    (): TableCRUDRow<VariableValue>[] =>
      this.tableCRUDRowMapperService.mapToTableCRUDRows(
        this.variableValueStore$.orderedList()
      )
  );

  constructor() {
    effect((): void => {
      const variable: Variable = this.variable();

      untracked(() => {
        this.variableValueStore$.fetchAll({
          id: variable.id,
        });
      });
    });
  }

  onChange(row: TableCRUDRow<VariableValue> | null): void {
    this.variableValueStore$.change(row?.value ?? null);
  }

  onCreate(row: TableCRUDRow<VariableValue>): void {
    const variable: Variable = this.variable();

    const nextSortOrder: number = findNextSortOrder(
      this.variableValueStore$.orderedList()
    );

    this.variableValueStore$.create({
      name: row.label,
      variableId: variable.id,
      sortOrder: nextSortOrder,
    });
  }

  onUpdate(row: TableCRUDRow<VariableValue>): void {
    this.variableValueStore$.update({
      ...row.value,
      name: row.label,
    });
  }

  onDelete(row: TableCRUDRow<VariableValue>): void {
    this.variableValueStore$.delete(row.value);
  }

  onReorder(rows: ReadonlyArray<TableCRUDRow<VariableValue>>): void {
    this.variableValueStore$.reorder(
      this.sortOrderMapperService.mapEntitiesToSortOrderUpdate(
        this.tableCRUDRowMapperService.mapFromTableCRUDRows(rows)
      )
    );
  }
}
