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
  selector: '[radioEditorAlignCenter]',
  standalone: true,
})
export class EditorAlignCenterDirective {
  @Input({ required: true }) context: EditorToolbarItemContext | undefined;

  @Output() clicked: EventEmitter<EditorToolbarItemContext | undefined> =
    new EventEmitter<EditorToolbarItemContext | undefined>();

  @HostBinding('attr.disabled')
  get disabled(): boolean {
    if (!this.context) {
      return false;
    }

    const disabled: boolean =
      !this.context.editor.can().chain().focus().setTextAlign('center').run() &&
      !this.context.editor.can().chain().focus().setNodeAlign('center').run();

    return disabled;
  }

  @HostBinding('attr.isactive')
  get isActive(): boolean {
    if (!this.context) {
      return false;
    }

    const isActive: boolean =
      this.context.editor.isActive({ textAlign: 'center' }) ||
      this.context.editor.isActive({ nodeAlign: 'center' });

    return isActive;
  }

  @HostListener('click') onClick(): void {
    if (!this.context) {
      return;
    }

    if (
      this.context.editor.can().chain().focus().setTextAlign('center').run()
    ) {
      this.context.editor.chain().focus().setTextAlign('center').run();
    }

    if (
      this.context.editor.can().chain().focus().setNodeAlign('center').run()
    ) {
      this.context.editor.chain().focus().setNodeAlign('center').run();
    }

    this.clicked.emit(this.context);
  }
}
