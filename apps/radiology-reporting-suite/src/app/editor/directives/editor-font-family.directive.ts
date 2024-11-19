import { Directive, EventEmitter, Input, Output } from '@angular/core';

import { EDITOR_FONT_DEFAULT } from '../constants';
import { EditorFontFamilyOptions } from '../models/editor-font-family-options.interface';
import { EditorToolbarItemContext } from '../models/editor-toolbar-item-context.interface';

@Directive({
  selector: '[radioEditorFontFamily]',
  standalone: true,
})
export class EditorFontFamilyDirective {
  @Input({ required: true }) context:
    | EditorToolbarItemContext<EditorFontFamilyOptions>
    | undefined;

  @Output() clicked: EventEmitter<EditorToolbarItemContext | undefined> =
    new EventEmitter<EditorToolbarItemContext | undefined>();

  get fontFamily(): string {
    if (!this.context) {
      return EDITOR_FONT_DEFAULT;
    }

    const textStyle: Record<string, unknown> =
      this.context.editor.getAttributes('textStyle');

    const fontFamily: string =
      textStyle['fontFamily']?.toString() ||
      this.context.options?.defaultFont ||
      EDITOR_FONT_DEFAULT;

    return fontFamily;
  }

  run(fontFamily: string): void {
    if (!this.context) {
      return;
    }

    if (this.isDefaultFont(fontFamily)) {
      this.context.editor.chain().focus().unsetFontFamily().run();
    }

    this.context.editor.chain().focus().setFontFamily(fontFamily).run();
  }

  private isDefaultFont(fontFamily: string): boolean {
    return (
      fontFamily === this.context?.options?.defaultFont ||
      fontFamily === EDITOR_FONT_DEFAULT
    );
  }
}
