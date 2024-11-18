import {
  Directive,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  Output,
} from '@angular/core';

import { EditorToolbarItemContext } from '../models/editor-toolbar-item-context.interface';

@Directive({
  selector: '[radioEditorUndo]',
  standalone: true,
})
export class EditorUndoDirective {
  @Input({ required: true }) context: EditorToolbarItemContext | undefined;

  @Output() clicked: EventEmitter<EditorToolbarItemContext | undefined> =
    new EventEmitter<EditorToolbarItemContext | undefined>();

  @HostBinding('attr.disabled')
  get disabled(): boolean {
    if (!this.context) {
      return false;
    }

    const disabled: boolean = !this.context.editor
      .can()
      .chain()
      .focus()
      .undo()
      .run();

    return disabled;
  }

  @HostListener('click') onClick(): void {
    if (!this.context) {
      return;
    }

    this.context.editor.chain().focus().undo().run();

    this.clicked.emit(this.context);
  }
}
