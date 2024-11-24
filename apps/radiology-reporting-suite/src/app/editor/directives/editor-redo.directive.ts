import {
  Directive,
  EventEmitter,
  HostBinding,
  HostListener,
  InputSignal,
  Output,
  input,
} from '@angular/core';

import { EditorToolbarItemContext } from '../models/editor-toolbar-item-context.interface';

@Directive({
  selector: '[radioEditorRedo]',
  standalone: true,
})
export class EditorRedoDirective {
  readonly context: InputSignal<EditorToolbarItemContext | undefined> =
    input.required<EditorToolbarItemContext | undefined>();

  @Output() clicked: EventEmitter<EditorToolbarItemContext | undefined> =
    new EventEmitter<EditorToolbarItemContext | undefined>();

  @HostBinding('attr.disabled')
  get disabled(): boolean {
    const context: EditorToolbarItemContext | undefined = this.context();

    if (!context) {
      return false;
    }

    const disabled: boolean = !context.editor
      .can()
      .chain()
      .focus()
      .redo()
      .run();

    return disabled;
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

    context.editor.chain().focus().redo().run();
  }
}
