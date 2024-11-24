import {
  Directive,
  EventEmitter,
  InputSignal,
  Output,
  input,
} from '@angular/core';

import { EDITOR_DEFAULT_FONT_FAMILY } from '../constants';
import { EditorFontFamilyOptions } from '../models/editor-font-family-options.interface';
import { EditorToolbarItemContext } from '../models/editor-toolbar-item-context.interface';

@Directive({
  selector: '[radioEditorFontFamily]',
  standalone: true,
})
export class EditorFontFamilyDirective {
  readonly context: InputSignal<
    EditorToolbarItemContext<EditorFontFamilyOptions> | undefined
  > = input.required<
    EditorToolbarItemContext<EditorFontFamilyOptions> | undefined
  >();

  @Output() clicked: EventEmitter<EditorToolbarItemContext | undefined> =
    new EventEmitter<EditorToolbarItemContext | undefined>();

  get fontFamily(): string {
    const context:
      | EditorToolbarItemContext<EditorFontFamilyOptions>
      | undefined = this.context();

    if (!context) {
      return EDITOR_DEFAULT_FONT_FAMILY;
    }

    const textStyle: Record<string, unknown> =
      context.editor.getAttributes('textStyle');

    const fontFamily: string =
      textStyle['fontFamily']?.toString() ||
      context.options?.defaultFont ||
      EDITOR_DEFAULT_FONT_FAMILY;

    return fontFamily;
  }

  set fontFamily(fontFamily: string) {
    this.run(fontFamily);
  }

  run(fontFamily: string): void {
    const context:
      | EditorToolbarItemContext<EditorFontFamilyOptions>
      | undefined = this.context();

    if (!context) {
      return;
    }

    if (this.isDefaultFont(fontFamily)) {
      context.editor.chain().focus().unsetFontFamily().run();
    }

    context.editor.chain().focus().setFontFamily(fontFamily).run();
  }

  private isDefaultFont(fontFamily: string): boolean {
    return (
      fontFamily === this.context()?.options?.defaultFont ||
      fontFamily === EDITOR_DEFAULT_FONT_FAMILY
    );
  }
}
