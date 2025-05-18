import {
  Component,
  computed,
  effect,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
  Signal,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';

import { EditorTableGridOutput } from '@app/editor/models';

@Component({
  selector: 'radio-editor-table-grid-selector',
  standalone: true,
  imports: [ButtonModule],
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

  constructor() {
    effect(() => console.log(this.rows()));
  }

  onHover(rows: number, columns: number) {
    this.selectedRows = rows;

    this.selectedColumns = columns;
  }

  resetHover() {
    this.selectedRows = 0;

    this.selectedRows = 0;
  }

  onClick(rows: number, columns: number) {
    this.selected.emit({ rows, columns });
  }

  onKeydown(rows: number, columns: number) {
    this.selectedRows = rows;

    this.selectedColumns = columns;
  }
}
