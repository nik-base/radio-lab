import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import { EditorAlignLeftDirective } from '@app/editor/directives/editor-align-left.directive';

import { EditorButtonBaseComponent } from '../button-base/editor-button-base.component';

@Component({
  selector: 'radio-editor-button-align-left',
  standalone: true,
  imports: [CommonModule, EditorButtonBaseComponent],
  hostDirectives: [
    {
      directive: EditorAlignLeftDirective,
      inputs: ['context'],
      outputs: ['clicked'],
    },
  ],
  templateUrl: './editor-button-align-left.component.html',
})
export class EditorButtonAlignLeftComponent {
  readonly hostDirective: EditorAlignLeftDirective = inject(
    EditorAlignLeftDirective,
    {
      host: true,
    }
  );
}
