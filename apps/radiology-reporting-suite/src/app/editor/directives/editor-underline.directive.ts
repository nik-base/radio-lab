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
  selector: '[radioEditorUnderline]',
  standalone: true,
})
export class EditorUnderlineDirective implements EditorDirectiveButtonBase {
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
      .toggleUnderline()
      .run();

    return disabled;
  }

  @HostBinding('attr.isactive')
  get isActive(): boolean {
    if (!this.context) {
      return false;
    }

    const isActive: boolean = this.context.editor.isActive('underline');

    return isActive;
  }

  @HostListener('click') onClick(): void {
    if (!this.context) {
      return;
    }

    this.context.editor.chain().focus().toggleUnderline().run();

    this.clicked.emit(this.context);
  }
}
