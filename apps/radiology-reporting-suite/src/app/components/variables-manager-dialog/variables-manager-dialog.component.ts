import { Component, computed, inject, Signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { VARIABLE_SOURCE, VARIABLE_TYPE } from '@app/constants';
import { SortOrderMapperService } from '@app/mapper/sort-order-mapper.service';
import { TableCRUDRowMapperService } from '@app/mapper/table-crud-row-mapper.service';
import { Variable } from '@app/models/domain';
import { TableCRUDRow, VariablesManagerDialogData } from '@app/models/ui';
import { VariableStore } from '@app/store/report-manager/variable-store';
import { isNotNil } from '@app/utils/functions/common.functions';
import { findNextSortOrder } from '@app/utils/functions/order.functions';

import { DialogLayoutComponent } from '../dialog-layout/dialog-layout.component';
import { TableCRUDComponent } from '../table-crud/table-crud.component';

@Component({
  selector: 'radio-variables-manager-dialog',
  standalone: true,
  imports: [ButtonModule, DialogLayoutComponent, TableCRUDComponent],
  templateUrl: './variables-manager-dialog.component.html',
})
export class VariablesManagerDialogComponent {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  private readonly tableCRUDRowMapperService: TableCRUDRowMapperService<Variable> =
    inject(TableCRUDRowMapperService);

  private readonly sortOrderMapperService: SortOrderMapperService = inject(
    SortOrderMapperService
  );

  protected readonly variableStore$: InstanceType<typeof VariableStore> =
    inject(VariableStore);

  private readonly dynamicDialogRef: DynamicDialogRef =
    inject(DynamicDialogRef);

  private readonly dynamicDialogConfig: DynamicDialogConfig<VariablesManagerDialogData> =
    inject(
      DynamicDialogConfig
    ) as DynamicDialogConfig<VariablesManagerDialogData>;

  readonly variables: Signal<TableCRUDRow<Variable>[]> = computed(
    (): TableCRUDRow<Variable>[] =>
      this.tableCRUDRowMapperService.mapToTableCRUDRows(
        this.variableStore$.variables()(this._dialogData.finding.id)()
      )
  );

  private _dialogData!: VariablesManagerDialogData;

  constructor() {
    if (isNotNil(this.dynamicDialogConfig.data)) {
      this._dialogData = this.dynamicDialogConfig.data;

      this.variableStore$.fetchAll({
        id: this.dynamicDialogConfig.data.finding.id,
      });
    }
  }

  onCreate(row: TableCRUDRow<Variable>): void {
    const nextSortOrder: number = findNextSortOrder(
      this.variableStore$.variables()(this._dialogData.finding.id)()
    );

    this.variableStore$.create({
      name: row.label,
      entityId: this._dialogData.finding.id,
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

  close(): void {
    this.dynamicDialogRef.close();
  }
}
