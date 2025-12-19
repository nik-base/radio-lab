import { Component, inject } from '@angular/core';

import { EditorItalicDirective } from '@app/editor/directives/editor-italic.directive';

import { EditorButtonBaseComponent } from '../button-base/editor-button-base.component';

@Component({
  selector: 'radio-editor-button-italic',
  imports: [EditorButtonBaseComponent],
  hostDirectives: [
    {
      directive: EditorItalicDirective,
      inputs: ['context'],
      outputs: ['clicked'],
    },
  ],
  templateUrl: './editor-button-italic.component.html',
})
export class EditorButtonItalicComponent {
  readonly hostDirective: EditorItalicDirective = inject(
    EditorItalicDirective,
    {
      host: true,
    }
  );
}
