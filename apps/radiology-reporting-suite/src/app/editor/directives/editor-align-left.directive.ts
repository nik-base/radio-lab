import {
  Directive,
  InputSignal,
  OutputEmitterRef,
  input,
  output,
} from '@angular/core';

import { EditorToolbarItemContext } from '../models/editor-toolbar-item-context.interface';

@Directive({
  selector: '[radioEditorAlignLeft]',
  host: {
    '[attr.disabled]': 'disabled',
    '[attr.isactive]': 'isActive',
    '(click)': 'onClick()',
  },
})
export class EditorAlignLeftDirective {
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
      !context.editor.can().chain().focus().setTextAlign('left').run() &&
      !context.editor.can().chain().focus().setNodeAlign('left').run();

    return disabled;
  }

  get isActive(): boolean {
    const context: EditorToolbarItemContext | undefined = this.context();

    if (!context) {
      return false;
    }

    const isActive: boolean =
      context.editor.isActive({ textAlign: 'left' }) ||
      context.editor.isActive({ nodeAlign: 'flex-start' });

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

    if (context.editor.can().chain().focus().setTextAlign('left').run()) {
      context.editor.chain().focus().setTextAlign('left').run();
    }

    if (context.editor.can().chain().focus().setNodeAlign('flex-start').run()) {
      context.editor.chain().focus().setNodeAlign('flex-start').run();
    }
  }
}
