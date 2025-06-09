import {
  Component,
  inject,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
  Signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, TooltipOptions } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { InputTextModule } from 'primeng/inputtext';
import { SkeletonModule } from 'primeng/skeleton';
import { Table, TableModule, TableRowSelectEvent } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

import { APP_TOOLTIP_OPTIONS } from '@app/constants';
import { TableCRUDRow } from '@app/models/ui';

@Component({
  selector: 'radio-table-crud',
  standalone: true,
  imports: [
    FormsModule,
    TableModule,
    ButtonModule,
    TooltipModule,
    InputTextModule,
    ConfirmPopupModule,
    SkeletonModule,
  ],
  providers: [ConfirmationService],
  templateUrl: './table-crud.component.html',
})
export class TableCRUDComponent<T> {
  private readonly confirmationService: ConfirmationService =
    inject(ConfirmationService);

  protected readonly tooltipOptions: TooltipOptions = APP_TOOLTIP_OPTIONS;

  protected table: Signal<Table> = viewChild.required<Table>('tableElement');

  readonly rows: InputSignal<TableCRUDRow<T>[]> =
    input.required<TableCRUDRow<T>[]>();

  readonly emptyMessage: InputSignal<string> = input<string>('No items found.');

  readonly entityName: InputSignal<string> = input<string>('Item');

  readonly entityNamePlural: InputSignal<string> = input<string>('Items');

  readonly isLoading: InputSignal<boolean> = input<boolean>(true);

  readonly rowCreate: OutputEmitterRef<TableCRUDRow<T>> =
    output<TableCRUDRow<T>>();

  readonly rowUpdate: OutputEmitterRef<TableCRUDRow<T>> =
    output<TableCRUDRow<T>>();

  readonly rowDelete: OutputEmitterRef<TableCRUDRow<T>> =
    output<TableCRUDRow<T>>();

  readonly rowSelect: OutputEmitterRef<TableCRUDRow<T> | null> =
    output<TableCRUDRow<T> | null>();

  readonly rowReorder: OutputEmitterRef<ReadonlyArray<TableCRUDRow<T>>> =
    output<ReadonlyArray<TableCRUDRow<T>>>();

  protected readonly clonedRows: { [s: string]: TableCRUDRow<T> } = {};

  protected readonly mockRows: TableCRUDRow<T>[] = Array<TableCRUDRow<T>>(
    3
  ).fill({
    id: '',
    label: '',
    value: {} as T,
  });

  onRowSelect(event: TableRowSelectEvent): void {
    this.rowSelect.emit(event.data as TableCRUDRow<T>);
  }

  onRowUnSelect(): void {
    this.rowSelect.emit(null);
  }

  onRowReorder(): void {
    this.rowReorder.emit(this.table().value);
  }

  addNew(event: Event): void {
    const newRow: Partial<TableCRUDRow<T>> = { id: '-1' };

    this.table().value.unshift(newRow);

    this.table().initRowEdit(newRow);

    event.preventDefault();
  }

  onRowEditInit(row: TableCRUDRow<T>) {
    this.clonedRows[row.id] = { ...row };
  }

  onRowEditSave(row: TableCRUDRow<T>) {
    if (row.id === '-1') {
      this.rowCreate.emit(row);
    } else {
      this.rowUpdate.emit(row);
    }

    delete this.clonedRows[row.id];
  }

  onRowEditCancel(row: TableCRUDRow<T>, index: number) {
    this.rows()[index] = this.clonedRows[row.id];

    delete this.clonedRows[row.id];
  }

  deleteRow(event: Event, row: TableCRUDRow<T>): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Do you want to delete this ${this.entityName()}?`,
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-sm',
      accept: () => {
        this.rowDelete.emit(row);
      },
    });
  }
}
