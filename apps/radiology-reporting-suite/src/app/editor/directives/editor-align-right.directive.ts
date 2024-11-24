import {
  Directive,
  HostBinding,
  HostListener,
  InputSignal,
  OutputEmitterRef,
  input,
  output,
} from '@angular/core';

import { EditorToolbarItemContext } from '../models/editor-toolbar-item-context.interface';

@Directive({
  selector: '[radioEditorAlignRight]',
  standalone: true,
})
export class EditorAlignRightDirective {
  readonly context: InputSignal<EditorToolbarItemContext | undefined> =
    input.required<EditorToolbarItemContext | undefined>();

  readonly clicked: OutputEmitterRef<EditorToolbarItemContext | undefined> =
    output<EditorToolbarItemContext | undefined>();

  @HostBinding('attr.disabled')
  get disabled(): boolean {
    const context: EditorToolbarItemContext | undefined = this.context();

    if (!context) {
      return false;
    }

    const disabled: boolean =
      !context.editor.can().chain().focus().setTextAlign('right').run() &&
      !context.editor.can().chain().focus().setNodeAlign('right').run();

    return disabled;
  }

  @HostBinding('attr.isactive')
  get isActive(): boolean {
    const context: EditorToolbarItemContext | undefined = this.context();

    if (!context) {
      return false;
    }

    const isActive: boolean =
      context.editor.isActive({ textAlign: 'right' }) ||
      context.editor.isActive({ nodeAlign: 'flex-end' });

    return isActive;
  }

  @HostListener('click') onClick(): void {
    this.run();

    this.clicked.emit(this.context());
  }

  run(): void {
    const context: EditorToolbarItemContext | undefined = this.context();

    if (!context) {
      return;
    }

    if (context.editor.can().chain().focus().setTextAlign('right').run()) {
      context.editor.chain().focus().setTextAlign('right').run();
    }

    if (context.editor.can().chain().focus().setNodeAlign('flex-end').run()) {
      context.editor.chain().focus().setNodeAlign('flex-end').run();
    }
  }
}
