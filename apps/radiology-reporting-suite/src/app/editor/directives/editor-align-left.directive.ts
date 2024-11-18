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
  selector: '[radioEditorAlignLeft]',
  standalone: true,
})
export class EditorAlignLeftDirective {
  @Input({ required: true }) context: EditorToolbarItemContext | undefined;

  @Output() clicked: EventEmitter<EditorToolbarItemContext | undefined> =
    new EventEmitter<EditorToolbarItemContext | undefined>();

  @HostBinding('attr.disabled')
  get disabled(): boolean {
    if (!this.context) {
      return false;
    }

    const disabled: boolean =
      !this.context.editor.can().chain().focus().setTextAlign('left').run() &&
      !this.context.editor.can().chain().focus().setNodeAlign('left').run();

    return disabled;
  }

  @HostBinding('attr.isactive')
  get isActive(): boolean {
    if (!this.context) {
      return false;
    }

    const isActive: boolean =
      this.context.editor.isActive({ textAlign: 'left' }) ||
      this.context.editor.isActive({ nodeAlign: 'flex-start' });

    return isActive;
  }

  @HostListener('click') onClick(): void {
    if (!this.context) {
      return;
    }

    if (this.context.editor.can().chain().focus().setTextAlign('left').run()) {
      this.context.editor.chain().focus().setTextAlign('left').run();
    }

    if (
      this.context.editor.can().chain().focus().setNodeAlign('flex-start').run()
    ) {
      this.context.editor.chain().focus().setNodeAlign('flex-start').run();
    }

    this.clicked.emit(this.context);
  }
}
