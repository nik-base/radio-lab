import {
  Directive,
  InputSignal,
  OutputEmitterRef,
  input,
  output,
} from '@angular/core';

import { EditorTableGridOutput } from '../models';
import { EditorToolbarItemContext } from '../models/editor-toolbar-item-context.interface';

@Directive({
  selector: '[radioEditorTable]',
  standalone: true,
})
export class EditorTableDirective {
  readonly context: InputSignal<EditorToolbarItemContext | undefined> =
    input.required<EditorToolbarItemContext | undefined>();

  readonly clicked: OutputEmitterRef<EditorToolbarItemContext | undefined> =
    output<EditorToolbarItemContext | undefined>();

  run(data: EditorTableGridOutput): void {
    if (data.rows === 0 || data.columns === 0) {
      return;
    }

    const context: EditorToolbarItemContext | undefined = this.context();

    if (!context) {
      return;
    }

    context.editor
      .chain()
      .focus()
      .insertTable({
        rows: data.rows,
        cols: data.columns,
        withHeaderRow: false,
      })
      .run();
  }
}
