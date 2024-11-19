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
  selector: '[radioEditorOrderedList]',
  standalone: true,
})
export class EditorOrderedListDirective {
  @Input({ required: true }) context: EditorToolbarItemContext | undefined;

  @Output() clicked: EventEmitter<EditorToolbarItemContext | undefined> =
    new EventEmitter<EditorToolbarItemContext | undefined>();

  @HostBinding('attr.isactive')
  get isActive(): boolean {
    if (!this.context) {
      return false;
    }

    const isActive: boolean = this.context.editor.isActive('orderedList');

    return isActive;
  }

  @HostListener('click') onClick(): void {
    this.run();

    this.clicked.emit(this.context);
  }

  run(): void {
    if (!this.context) {
      return;
    }

    this.context.editor
      .chain()
      .focus()
      .toggleOrderedList()
      .updateAttributes('orderedList', { listType: 'decimal' })
      .run();
  }
}
