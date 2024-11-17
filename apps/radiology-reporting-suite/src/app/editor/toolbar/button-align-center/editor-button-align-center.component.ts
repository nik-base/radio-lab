import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import { EditorAlignCenterDirective } from '@app/editor/directives/editor-align-center.directive';

import { EditorButtonBaseComponent } from '../button-base/editor-button-base.component';

@Component({
  selector: 'radio-editor-button-align-center',
  standalone: true,
  imports: [CommonModule, EditorButtonBaseComponent],
  hostDirectives: [
    {
      directive: EditorAlignCenterDirective,
      inputs: ['context'],
      outputs: ['clicked'],
    },
  ],
  templateUrl: './editor-button-align-center.component.html',
})
export class EditorButtonAlignCenterComponent {
  readonly hostDirective: EditorAlignCenterDirective = inject(
    EditorAlignCenterDirective,
    {
      host: true,
    }
  );
}
