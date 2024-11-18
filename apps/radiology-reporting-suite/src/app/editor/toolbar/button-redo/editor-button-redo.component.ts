import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import { EditorRedoDirective } from '@app/editor/directives/editor-redo.directive';

import { EditorButtonBaseComponent } from '../button-base/editor-button-base.component';

@Component({
  selector: 'radio-editor-button-redo',
  standalone: true,
  imports: [CommonModule, EditorButtonBaseComponent],
  hostDirectives: [
    {
      directive: EditorRedoDirective,
      inputs: ['context'],
      outputs: ['clicked'],
    },
  ],
  templateUrl: './editor-button-redo.component.html',
})
export class EditorButtonRedoComponent {
  readonly hostDirective: EditorRedoDirective = inject(EditorRedoDirective, {
    host: true,
  });
}
