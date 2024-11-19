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
  selector: '[radioEditorBold]',
  standalone: true,
})
export class EditorBoldDirective {
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
      .toggleBold()
      .run();

    return disabled;
  }

  @HostBinding('attr.isactive')
  get isActive(): boolean {
    if (!this.context) {
      return false;
    }

    const isActive: boolean = this.context.editor.isActive('bold');

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

    this.context.editor.chain().focus().toggleBold().run();
  }
}
