import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { TooltipModule } from 'primeng/tooltip';

import { EDITOR_FONT_DEFAULT } from '@app/editor/constants';
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
  @Input({ transform: transformEmptyArray }) set fonts(value: string[]) {
    this.fontFamilies = value;
  }

  readonly hostDirective: EditorFontFamilyDirective = inject(
    EditorFontFamilyDirective,
    {
      host: true,
    }
  );

  fontFamilies: string[] = [EDITOR_FONT_DEFAULT];
}

function transformEmptyArray(value: string[] | null | undefined): string[] {
  if (!value?.length) {
    return [];
  }

  return value;
}
