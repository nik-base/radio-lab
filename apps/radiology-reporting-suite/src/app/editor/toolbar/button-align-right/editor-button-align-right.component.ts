import { Component, inject } from '@angular/core';

import { EditorAlignRightDirective } from '@app/editor/directives/editor-align-right.directive';

import { EditorButtonBaseComponent } from '../button-base/editor-button-base.component';

@Component({
  selector: 'radio-editor-button-align-right',
  imports: [EditorButtonBaseComponent],
  hostDirectives: [
    {
      directive: EditorAlignRightDirective,
      inputs: ['context'],
      outputs: ['clicked'],
    },
  ],
  templateUrl: './editor-button-align-right.component.html',
})
export class EditorButtonAlignRightComponent {
  readonly hostDirective: EditorAlignRightDirective = inject(
    EditorAlignRightDirective,
    {
      host: true,
    }
  );
}
