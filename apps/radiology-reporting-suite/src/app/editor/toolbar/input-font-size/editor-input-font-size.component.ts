import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { TooltipModule } from 'primeng/tooltip';

import {
  EDITOR_DEFAULT_MAX_FONT_SIZE,
  EDITOR_DEFAULT_MIN_FONT_SIZE,
} from '@app/editor/constants';
import { EditorFontSizeDirective } from '@app/editor/directives/editor-font-size.directive';

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
export class EditorInputFontSizeComponent {
  readonly hostDirective: EditorFontSizeDirective = inject(
    EditorFontSizeDirective,
    {
      host: true,
    }
  );

  readonly minFontSize: number =
    this.hostDirective.context?.options?.minSize ??
    EDITOR_DEFAULT_MIN_FONT_SIZE;

  readonly maxFontSize: number =
    this.hostDirective.context?.options?.maxSize ??
    EDITOR_DEFAULT_MAX_FONT_SIZE;

  onFontSizeChange(fontSize: number | string | null): void {
    this.hostDirective.fontSize = fontSize;
  }
}
