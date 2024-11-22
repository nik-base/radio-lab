import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { TooltipModule } from 'primeng/tooltip';

import { EDITOR_DEFAULT_FONT_FAMILY } from '@app/editor/constants';
import { EditorFontFamilyDirective } from '@app/editor/directives/editor-font-family.directive';

@Component({
  selector: 'radio-editor-selector-font-family',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, TooltipModule],
  hostDirectives: [
    {
      directive: EditorFontFamilyDirective,
      inputs: ['context'],
    },
  ],
  templateUrl: './editor-selector-font-family.component.html',
})
export class EditorSelectorFontFamilyComponent {
  readonly hostDirective: EditorFontFamilyDirective = inject(
    EditorFontFamilyDirective,
    {
      host: true,
    }
  );

  private readonly defaultFontFamilies: string[] = [
    'Aptos',
    'Calibri',
    'Times New Roman',
    'Arial',
    'Arial Nova',
    'HP Simplified',
    'Helvetica',
  ];

  fontFamilies: string[] = !this.hostDirective?.context?.options?.fonts?.length
    ? [EDITOR_DEFAULT_FONT_FAMILY, ...this.defaultFontFamilies]
    : [EDITOR_DEFAULT_FONT_FAMILY, ...this.hostDirective.context.options.fonts];

  onFontFamilyChange(fontFamily: string): void {
    this.hostDirective.fontFamily = fontFamily;
  }
}
