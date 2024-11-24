import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { TooltipModule } from 'primeng/tooltip';

import {
  EDITOR_DEFAULT_MAX_FONT_SIZE,
  EDITOR_DEFAULT_MIN_FONT_SIZE,
} from '@app/editor/constants';
import { EditorFontSizeDirective } from '@app/editor/directives/editor-font-size.directive';
import {
  EditorFontSizeOptions,
  EditorToolbarItemContext,
} from '@app/editor/models';

@Component({
  selector: 'radio-editor-input-font-size',
  standalone: true,
  imports: [CommonModule, FormsModule, InputNumberModule, TooltipModule],
  hostDirectives: [
    {
      directive: EditorFontSizeDirective,
      inputs: ['context'],
    },
  ],
  templateUrl: './editor-input-font-size.component.html',
})
export class EditorInputFontSizeComponent implements OnInit {
  readonly hostDirective: EditorFontSizeDirective = inject(
    EditorFontSizeDirective,
    {
      host: true,
    }
  );

  minFontSize: number = EDITOR_DEFAULT_MIN_FONT_SIZE;

  maxFontSize: number = EDITOR_DEFAULT_MAX_FONT_SIZE;

  ngOnInit(): void {
    const context: EditorToolbarItemContext<EditorFontSizeOptions> | undefined =
      this.hostDirective.context();

    this.setMinFontSize(context);

    this.setMaxFontSize(context);
  }

  onFontSizeChange(fontSize: number | string | null): void {
    this.hostDirective.fontSize = fontSize;
  }

  private setMinFontSize(
    context: EditorToolbarItemContext<EditorFontSizeOptions> | undefined
  ): void {
    this.minFontSize = this.getMinFontSize(context);
  }

  private setMaxFontSize(
    context: EditorToolbarItemContext<EditorFontSizeOptions> | undefined
  ): void {
    this.maxFontSize = this.getMaxFontSize(context);
  }

  private getMinFontSize(
    context: EditorToolbarItemContext<EditorFontSizeOptions> | undefined
  ): number {
    return context?.options?.minSize ?? EDITOR_DEFAULT_MIN_FONT_SIZE;
  }

  private getMaxFontSize(
    context: EditorToolbarItemContext<EditorFontSizeOptions> | undefined
  ): number {
    return context?.options?.maxSize ?? EDITOR_DEFAULT_MAX_FONT_SIZE;
  }
}
