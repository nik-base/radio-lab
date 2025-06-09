import {
  Directive,
  InputSignal,
  OutputEmitterRef,
  input,
  output,
} from '@angular/core';
import { isNil } from 'lodash-es';

import {
  EDITOR_DEFAULT_FONT_SIZE,
  EDITOR_DEFAULT_MAX_FONT_SIZE,
  EDITOR_DEFAULT_MIN_FONT_SIZE,
} from '../constants';
import { EditorFontSizeOptions } from '../models/editor-font-size-options.interface';
import { EditorToolbarItemContext } from '../models/editor-toolbar-item-context.interface';

@Directive({
  selector: '[radioEditorFontSize]',
  standalone: true,
})
export class EditorFontSizeDirective {
  readonly context: InputSignal<
    EditorToolbarItemContext<EditorFontSizeOptions> | undefined
  > = input.required<
    EditorToolbarItemContext<EditorFontSizeOptions> | undefined
  >();

  readonly clicked: OutputEmitterRef<EditorToolbarItemContext | undefined> =
    output<EditorToolbarItemContext | undefined>();

  get fontSize(): number {
    const context: EditorToolbarItemContext<EditorFontSizeOptions> | undefined =
      this.context();

    if (!context) {
      return EDITOR_DEFAULT_FONT_SIZE;
    }

    const textStyle: Record<string, unknown> =
      context.editor.getAttributes('textStyle');

    const fontSize: number =
      this.parseFontSizePx(textStyle['fontSize']?.toString()) ||
      context.options?.defaultSize ||
      EDITOR_DEFAULT_FONT_SIZE;

    return fontSize;
  }

  set fontSize(fontSize: number | string | null) {
    this.run(fontSize);
  }

  run(fontSize: number | string | null): void {
    const context: EditorToolbarItemContext<EditorFontSizeOptions> | undefined =
      this.context();

    if (!context) {
      return;
    }

    const size: number = this.getSize(fontSize);

    context.editor.chain().focus().setFontSizeInPx(size).run();
  }

  private parseFontSizePx(
    fontSize: string | null | undefined
  ): number | undefined {
    if (isNil(fontSize)) {
      return undefined;
    }

    return parseInt(fontSize, 10);
  }

  private parseFontSizeValue(
    fontSize: number | string | null | undefined
  ): number | undefined {
    if (isNil(fontSize)) {
      return undefined;
    }

    return parseInt(fontSize.toString(), 10);
  }

  private getSize(fontSizeValue: number | string | null): number {
    const fontSize: number | undefined | null =
      this.parseFontSizeValue(fontSizeValue) ?? EDITOR_DEFAULT_FONT_SIZE;

    if (this.isLessThanMinSize(fontSize)) {
      return this.getMinSize();
    }

    if (this.isGreaterThanMaxSize(fontSize)) {
      return this.getMaxSize();
    }

    return fontSize;
  }

  private isLessThanMinSize(fontSize: number): boolean {
    return fontSize < this.getMinSize();
  }

  private getMinSize(): number {
    return this.context()?.options?.minSize ?? EDITOR_DEFAULT_MIN_FONT_SIZE;
  }

  private isGreaterThanMaxSize(fontSize: number): boolean {
    return fontSize > this.getMaxSize();
  }

  private getMaxSize(): number {
    return this.context()?.options?.maxSize ?? EDITOR_DEFAULT_MAX_FONT_SIZE;
  }
}
