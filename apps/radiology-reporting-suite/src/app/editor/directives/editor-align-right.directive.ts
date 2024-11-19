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
  selector: '[radioEditorAlignRight]',
  standalone: true,
})
export class EditorAlignRightDirective {
  @Input({ required: true }) context: EditorToolbarItemContext | undefined;

  @Output() clicked: EventEmitter<EditorToolbarItemContext | undefined> =
    new EventEmitter<EditorToolbarItemContext | undefined>();

  @HostBinding('attr.disabled')
  get disabled(): boolean {
    if (!this.context) {
      return false;
    }

    const disabled: boolean =
      !this.context.editor.can().chain().focus().setTextAlign('right').run() &&
      !this.context.editor.can().chain().focus().setNodeAlign('right').run();

    return disabled;
  }

  @HostBinding('attr.isactive')
  get isActive(): boolean {
    if (!this.context) {
      return false;
    }

    const isActive: boolean =
      this.context.editor.isActive({ textAlign: 'right' }) ||
      this.context.editor.isActive({ nodeAlign: 'flex-end' });

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

    if (this.context.editor.can().chain().focus().setTextAlign('right').run()) {
      this.context.editor.chain().focus().setTextAlign('right').run();
    }

    if (
      this.context.editor.can().chain().focus().setNodeAlign('flex-end').run()
    ) {
      this.context.editor.chain().focus().setNodeAlign('flex-end').run();
    }
  }
}
