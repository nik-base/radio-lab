import {
  Directive,
  InputSignal,
  OutputEmitterRef,
  input,
  output,
} from '@angular/core';

import { EditorToolbarItemContext } from '../models/editor-toolbar-item-context.interface';

@Directive({
  selector: '[radioEditorAlignCenter]',
  host: {
    '[attr.disabled]': 'disabled',
    '[attr.isactive]': 'isActive',
    '(click)': 'onClick()',
  },
})
export class EditorAlignCenterDirective {
  readonly context: InputSignal<EditorToolbarItemContext | undefined> =
    input.required<EditorToolbarItemContext | undefined>();

  readonly clicked: OutputEmitterRef<EditorToolbarItemContext | undefined> =
    output<EditorToolbarItemContext | undefined>();

  get disabled(): boolean {
    const context: EditorToolbarItemContext | undefined = this.context();

    if (!context) {
      return false;
    }

    const disabled: boolean =
      !context.editor.can().chain().focus().setTextAlign('center').run() &&
      !context.editor.can().chain().focus().setNodeAlign('center').run();

    return disabled;
  }

  get isActive(): boolean {
    const context: EditorToolbarItemContext | undefined = this.context();

    if (!context) {
      return false;
    }

    const isActive: boolean =
      context.editor.isActive({ textAlign: 'center' }) ||
      context.editor.isActive({ nodeAlign: 'center' });

    return isActive;
  }

  protected onClick(): void {
    this.run();

    this.clicked.emit(this.context());
  }

  run(): void {
    const context: EditorToolbarItemContext | undefined = this.context();

    if (!context) {
      return;
    }

    if (context.editor.can().chain().focus().setTextAlign('center').run()) {
      context.editor.chain().focus().setTextAlign('center').run();
    }

    if (context.editor.can().chain().focus().setNodeAlign('center').run()) {
      context.editor.chain().focus().setNodeAlign('center').run();
    }
  }
}
