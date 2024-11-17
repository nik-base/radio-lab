import {
  Directive,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  Output,
} from '@angular/core';

import { EditorToolbarItemContext } from '../models/editor-toolbar-item-context.interface';

import { EditorDirectiveButtonBase } from './editor-directive-button-base.interface';

@Directive({
  selector: '[radioEditorItalic]',
  standalone: true,
})
export class EditorItalicDirective implements EditorDirectiveButtonBase {
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
      .toggleItalic()
      .run();

    return disabled;
  }

  @HostBinding('attr.isactive')
  get isActive(): boolean {
    if (!this.context) {
      return false;
    }

    const isActive: boolean = this.context.editor.isActive('italic');

    return isActive;
  }

  @HostListener('click') onClick(): void {
    if (!this.context) {
      return;
    }

    this.context.editor.chain().focus().toggleItalic().run();

    this.clicked.emit(this.context);
  }
}
