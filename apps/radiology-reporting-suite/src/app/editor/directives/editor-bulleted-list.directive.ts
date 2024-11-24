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
  selector: '[radioEditorBulletedList]',
  standalone: true,
})
export class EditorBulletedListDirective {
  readonly context: InputSignal<EditorToolbarItemContext | undefined> =
    input.required<EditorToolbarItemContext | undefined>();

  @Output() clicked: EventEmitter<EditorToolbarItemContext | undefined> =
    new EventEmitter<EditorToolbarItemContext | undefined>();

  @HostBinding('attr.isactive')
  get isActive(): boolean {
    const context: EditorToolbarItemContext | undefined = this.context();

    if (!context) {
      return false;
    }

    const isActive: boolean = context.editor.isActive('bulletList');

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

    context.editor
      .chain()
      .focus()
      .toggleBulletList()
      .updateAttributes('bulletList', { listType: 'disc' })
      .run();
  }
}
