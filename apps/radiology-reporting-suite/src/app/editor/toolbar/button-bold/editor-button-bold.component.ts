import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import { EditorBoldDirective } from '@app/editor/directives/editor-bold.directive';

import { EditorButtonBaseComponent } from '../button-base/editor-button-base.component';

@Component({
  selector: 'radio-editor-button-bold',
  standalone: true,
  imports: [CommonModule, EditorButtonBaseComponent],
  hostDirectives: [
    {
      directive: EditorBoldDirective,
      inputs: ['context'],
      outputs: ['clicked'],
    },
  ],
  templateUrl: './editor-button-bold.component.html',
})
export class EditorButtonBoldComponent {
  readonly hostDirective: EditorBoldDirective = inject(EditorBoldDirective, {
    host: true,
  });
}
