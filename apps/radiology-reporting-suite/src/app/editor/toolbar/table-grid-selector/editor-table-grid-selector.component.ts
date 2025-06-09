import {
  Component,
  computed,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
  Signal,
} from '@angular/core';

import { AutofocusDirective } from '@app/directives/auto-focus.directive';
import { EditorTableGridOutput } from '@app/editor/models';

@Component({
  selector: 'radio-editor-table-grid-selector',
  standalone: true,
  imports: [AutofocusDirective],
  templateUrl: './editor-table-grid-selector.component.html',
  styleUrls: ['./editor-table-grid-selector.component.scss'],
})
export class EditorTableGridSelectorComponent {
  readonly rows: InputSignal<number> = input<number>(5);

  readonly columns: InputSignal<number> = input<number>(5);

  readonly selected: OutputEmitterRef<EditorTableGridOutput> =
    output<EditorTableGridOutput>();

  protected readonly rowsArray: Signal<Array<void>> = computed(() =>
    Array<void>(this.rows())
  );

  protected readonly columnsArray: Signal<Array<void>> = computed(() =>
    Array<void>(this.columns())
  );

  protected selectedRows: number = 0;

  protected selectedColumns: number = 0;

  onHover(rows: number, columns: number): void {
    this.selectedRows = rows;

    this.selectedColumns = columns;
  }

  resetHover(): void {
    this.selectedRows = 0;

    this.selectedColumns = 0;
  }

  onClick(rows: number, columns: number): void {
    this.selected.emit({ rows, columns });
  }

  onKeydown(event: KeyboardEvent): void {
    const { key }: KeyboardEvent = event;

    switch (key) {
      case 'Enter':
        this.onEnter();

        break;

      case 'ArrowUp':
        this.onArrowUp();

        break;

      case 'ArrowDown':
        this.onArrowDown();

        break;

      case 'ArrowLeft':
        this.onArrowLeft();

        break;

      case 'ArrowRight':
        this.onArrowRight();

        break;

      default:
        break;
    }
  }

  private onArrowRight(): void {
    this.selectedColumns = Math.min(this.selectedColumns + 1, this.columns());

    if (this.selectedColumns === 1 && this.selectedRows <= 0) {
      this.selectedRows = 1;
    }
  }

  private onArrowLeft(): void {
    this.selectedColumns = Math.max(this.selectedColumns - 1, 0);

    if (this.selectedColumns === 0) {
      this.selectedRows = 0;
    }
  }

  private onArrowDown(): void {
    this.selectedRows = Math.min(this.selectedRows + 1, this.rows());

    if (this.selectedRows === 1 && this.selectedColumns <= 0) {
      this.selectedColumns = 1;
    }
  }

  private onArrowUp(): void {
    this.selectedRows = Math.max(this.selectedRows - 1, 0);

    if (this.selectedRows === 0) {
      this.selectedColumns = 0;
    }
  }

  private onEnter(): void {
    if (this.selectedRows === 0 || this.selectedColumns === 0) {
      return;
    }

    this.selected.emit({
      rows: this.selectedRows,
      columns: this.selectedColumns,
    });
  }
}
