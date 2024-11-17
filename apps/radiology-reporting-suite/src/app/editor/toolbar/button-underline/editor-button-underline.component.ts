import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import { EditorUnderlineDirective } from '@app/editor/directives/editor-underline.directive';

import { EditorButtonBaseComponent } from '../button-base/editor-button-base.component';

@Component({
  selector: 'radio-editor-button-underline',
  standalone: true,
  imports: [CommonModule, EditorButtonBaseComponent],
  hostDirectives: [
    {
      directive: EditorUnderlineDirective,
      inputs: ['context'],
      outputs: ['clicked'],
    },
  ],
  templateUrl: './editor-button-underline.component.html',
})
export class EditorButtonUnderlineComponent {
  readonly hostDirective: EditorUnderlineDirective = inject(
    EditorUnderlineDirective,
    {
      host: true,
    }
  );
}
