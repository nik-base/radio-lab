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
  selector: '[radioEditorBulletedList]',
  standalone: true,
})
export class EditorBulletedListDirective {
  @Input({ required: true }) context: EditorToolbarItemContext | undefined;

  @Output() clicked: EventEmitter<EditorToolbarItemContext | undefined> =
    new EventEmitter<EditorToolbarItemContext | undefined>();

  @HostBinding('attr.isactive')
  get isActive(): boolean {
    if (!this.context) {
      return false;
    }

    const isActive: boolean = this.context.editor.isActive('bulletList');

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
      .toggleBulletList()
      .updateAttributes('bulletList', { listType: 'disc' })
      .run();
  }
}
